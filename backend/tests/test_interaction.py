import math
import unittest

from chemlab.config import Config
from chemlab.gestures import HandInput, OneEuro, PinchGate, map_pointer, measure_hand
from chemlab.scene import Scene, inventory_cards


def points_at(distance=0.12):
    points = [(0.5, 0.5)] * 21
    points[5] = (0.4, 0.65)
    points[17] = (0.6, 0.65)
    points[4] = (0.5 - distance / 2, 0.4)
    points[8] = (0.5 + distance / 2, 0.4)
    return points


class GestureTests(unittest.TestCase):
    def test_open_required_then_debounced_edges(self):
        gate = PinchGate(0.3, 0.46, 0.075)
        self.assertIsNone(gate.update(0.1, 0.0))
        self.assertIsNone(gate.update(0.1, 1.0))
        gate.update(0.6, 1.1)
        gate.update(0.6, 1.2)
        self.assertTrue(gate.armed)
        self.assertIsNone(gate.update(0.1, 1.3))
        self.assertEqual(gate.update(0.1, 1.4), "grab")
        for k in range(4):
            self.assertIsNone(gate.update(0.35, 1.5 + k * 0.1))
        self.assertTrue(gate.closed)
        gate.update(0.6, 2.0)
        self.assertEqual(gate.update(0.6, 2.1), "release")
        self.assertFalse(gate.closed)

    def test_short_spike_is_not_grab(self):
        gate = PinchGate(0.3, 0.46, 0.075)
        gate.update(0.6, 0)
        gate.update(0.6, 0.1)
        gate.update(0.1, 0.2)
        gate.update(0.6, 0.23)
        gate.update(0.1, 0.3)
        self.assertIsNone(gate.update(0.1, 0.32))
        self.assertFalse(gate.closed)

    def test_ratio_invariant_to_image_size(self):
        a = measure_hand(points_at(0.04), 640, 480)
        b = measure_hand(points_at(0.04), 1280, 960)
        self.assertAlmostEqual(a.ratio, b.ratio)
        self.assertAlmostEqual(b.distance_px, 2 * a.distance_px)

    def test_pixel_distance_uses_actual_height(self):
        points = points_at()
        points[4] = (0.5, 0.4)
        points[8] = (0.5, 0.5)
        self.assertAlmostEqual(measure_hand(points, 1280, 720).distance_px, 72)

    def test_pointer_reaches_left_and_right(self):
        cfg = Config()
        self.assertEqual(map_pointer((0.12, 0.12), cfg), (0, 0))
        self.assertEqual(map_pointer((0.88, 0.88), cfg), (1279, 799))
        self.assertLess(map_pointer((0.2, 0.5), cfg)[0], cfg.menu_width)
        self.assertGreater(map_pointer((0.7, 0.5), cfg)[0], cfg.menu_width)

    def test_long_loss_cancel_and_closed_reacquisition_does_not_grab(self):
        hand = HandInput(Config())
        hand.update(points_at(), 960, 540, 0)
        hand.update(points_at(), 960, 540, 0.1)
        hand.update(points_at(0.03), 960, 540, 0.2)
        self.assertEqual(hand.update(points_at(0.03), 960, 540, 0.3)[1], "grab")
        self.assertIsNone(hand.update(None, 960, 540, 0.4)[1])
        self.assertEqual(hand.update(None, 960, 540, 0.7)[1], "cancel")
        self.assertIsNone(hand.update(None, 960, 540, 0.8)[1])
        self.assertIsNone(hand.update(points_at(0.03), 960, 540, 0.9)[1])
        self.assertFalse(hand.gate.armed)

    def test_pending_close_does_not_count_missing_time(self):
        hand = HandInput(Config())
        hand.update(points_at(), 960, 540, 0)
        hand.update(points_at(), 960, 540, 0.1)
        hand.update(points_at(0.03), 960, 540, 0.2)
        hand.update(None, 960, 540, 0.22)
        self.assertIsNone(hand.update(points_at(0.03), 960, 540, 0.31)[1])

    def test_long_loop_pause_cancels(self):
        hand = HandInput(Config())
        hand.update(points_at(), 960, 540, 0)
        hand.update(points_at(), 960, 540, 0.1)
        self.assertEqual(hand.update(points_at(), 960, 540, 0.7)[1], "cancel")

    def test_tiny_palm_is_not_interactable(self):
        hand = HandInput(Config())
        pointer, event = hand.update(points_at(), 60, 60, 0)
        self.assertIsNone(pointer)
        self.assertIsNone(event)

    def test_one_euro_reduces_stationary_jitter(self):
        filter_ = OneEuro()
        raw = [0.5 + 0.01 * (-1) ** i for i in range(100)]
        smoothed = [filter_.update(x, i / 30) for i, x in enumerate(raw)]
        self.assertLess(
            sum((x - 0.5) ** 2 for x in smoothed[20:]),
            sum((x - 0.5) ** 2 for x in raw[20:]),
        )
        self.assertTrue(all(math.isfinite(x) for x in smoothed))


class SceneTests(unittest.TestCase):
    def setUp(self):
        self.scene = Scene(Config())
        _, rect = next(inventory_cards(self.scene.cfg))
        self.card = ((rect[0] + rect[2]) / 2, (rect[1] + rect[3]) / 2)
        self.table = (700, 350)

    def spawn(self):
        self.scene.handle("grab", self.card)
        self.scene.handle(None, self.table)
        self.scene.handle("release", self.table)

    def test_inventory_to_workspace(self):
        self.spawn()
        self.assertEqual(len(self.scene.objects), 1)
        self.assertEqual(self.scene.objects[0].x, 700)
        self.assertIsNone(self.scene.drag)

    def test_hold_does_not_duplicate_objects(self):
        self.scene.handle("grab", self.card)
        for _ in range(20):
            self.scene.handle(None, self.table)
        self.assertEqual(len(self.scene.objects), 1)

    def test_invalid_new_drop_removes_instance(self):
        self.scene.handle("grab", self.card)
        self.scene.handle("release", self.card)
        self.assertEqual(self.scene.objects, [])

    def test_invalid_existing_drop_restores_position(self):
        self.spawn()
        self.scene.handle("grab", self.table)
        self.scene.handle(None, (800, 400))
        self.scene.handle("release", self.card)
        obj = self.scene.objects[0]
        self.assertEqual((obj.x, obj.y), self.table)

    def test_tracking_loss_does_not_commit_new_object(self):
        self.scene.handle("grab", self.card)
        self.scene.handle(None, self.table)
        self.scene.handle("cancel", None)
        self.assertEqual(self.scene.objects, [])

    def test_existing_grab_preserves_offset(self):
        self.spawn()
        self.scene.handle("grab", (710, 350))
        self.scene.handle(None, (810, 350))
        self.assertEqual(self.scene.drag.obj.x, 800)

    def test_independent_instances_and_topmost_selection(self):
        self.spawn()
        self.spawn()
        a, b = self.scene.objects
        self.assertNotEqual(a.id, b.id)
        self.scene.handle("grab", self.table)
        self.assertEqual(self.scene.drag.obj.id, b.id)

    def test_drop_near_hud_clamps_to_visible_area(self):
        self.scene.handle("grab", self.card)
        self.scene.handle("release", (1250, 680))
        obj = self.scene.objects[0]
        self.assertLessEqual(obj.y + obj.half_height, self.scene.cfg.drop_zone[3])
        self.assertLessEqual(obj.x + obj.half_width, self.scene.cfg.drop_zone[2])


if __name__ == "__main__":
    unittest.main()
