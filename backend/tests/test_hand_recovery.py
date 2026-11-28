"""Regression traces for the reported loss, hand swap and reach failures."""

import unittest
from pathlib import Path

from chemlab.config import Config
from chemlab.chemistry import load_database
from chemlab.gestures import OneEuro
from chemlab.selection import Candidate, HandSelector
from lab3d.hand_input import StableHandInput, measure
from lab3d.scene import LabScene
from lab3d.catalog import cards


def points(x=0.5, y=0.4, scale=1.0, closed=False):
    p = [(x, y)] * 21
    p[0], p[9], p[13] = (
        (x, y + 0.22 * scale),
        (x, y + 0.04 * scale),
        (x + 0.04 * scale, y + 0.06 * scale),
    )
    p[5], p[17] = (x - 0.10 * scale, y + 0.15 * scale), (
        x + 0.10 * scale,
        y + 0.15 * scale,
    )
    gap = (0.03 if closed else 0.12) * scale
    p[4], p[8] = (x - gap / 2, y), (x + gap / 2, y)
    return p


class RecoveryTests(unittest.TestCase):
    def setUp(self):
        self.cfg = Config(width=1280, height=800, footer=130)
        self.hand = StableHandInput(self.cfg)

    def held(self):
        for t in (0, 0.1):
            self.hand.update(points(), 960, 540, t)
        self.hand.update(points(closed=True), 960, 540, 0.2)
        self.assertEqual(
            self.hand.update(points(closed=True), 960, 540, 0.3)[1], "grab"
        )

    def test_short_dropout_keeps_grab_and_rebases_without_jump(self):
        self.held()
        before = self.hand.pointer
        self.assertEqual(self.hand.update(None, 960, 540, 0.4), (None, None))
        self.assertTrue(self.hand.gate.closed)
        self.assertFalse(self.hand.valid)
        for t in (0.5, 0.56):
            self.assertEqual(
                self.hand.update(points(0.7, closed=True), 960, 540, t), (None, None)
            )
        pointer, event = self.hand.update(points(0.7, closed=True), 960, 540, 0.64)
        self.assertEqual(pointer, before)
        self.assertIsNone(event)
        self.assertTrue(self.hand.valid)
        pointer, _ = self.hand.update(points(0.72, closed=True), 960, 540, 0.68)
        self.assertGreater(pointer[0], before[0])

    def test_long_dropout_parks_once_and_requires_open_hand(self):
        self.held()
        self.assertEqual(self.hand.update(None, 960, 540, 2.31)[1], "park")
        self.assertIsNone(self.hand.update(None, 960, 540, 2.4)[1])
        for t in (2.5, 2.65, 2.8):
            self.assertIsNone(self.hand.update(points(closed=True), 960, 540, t)[1])
        self.assertFalse(self.hand.gate.armed)

    def test_stalled_loop_is_loss_even_without_missing_frame(self):
        self.held()
        self.assertEqual(self.hand.update(points(closed=True), 960, 540, 3)[1], "park")

    def test_duplicate_sample_does_not_complete_debounce(self):
        self.hand.update(points(), 960, 540, 0)
        for _ in range(100):
            self.hand.update(points(), 960, 540, 0)
        self.assertFalse(self.hand.gate.armed)

    def test_single_open_spike_does_not_drop_item(self):
        self.held()
        self.hand.update(points(), 960, 540, 0.34)
        self.hand.update(points(closed=True), 960, 540, 0.37)
        self.assertTrue(self.hand.gate.closed)

    def test_sudden_discontinuity_freezes_instead_of_cancelling(self):
        self.held()
        before = self.hand.pointer
        self.assertEqual(
            self.hand.update(points(0.85, closed=True), 960, 540, 0.34), (None, None)
        )
        self.assertEqual(self.hand.pointer, before)
        self.assertTrue(self.hand.gate.closed)

    def test_tiny_hand_suspends_interaction_without_releasing(self):
        self.held()
        self.assertEqual(
            self.hand.update(points(scale=0.04, closed=True), 960, 540, 0.34),
            (None, None),
        )
        self.assertTrue(self.hand.gate.closed)
        self.assertFalse(self.hand.valid)

    def test_depth_scale_does_not_release(self):
        self.held()
        for i, scale in enumerate((0.8, 0.6, 0.4, 0.25, 0.12)):
            _, event = self.hand.update(
                points(scale=scale, closed=True), 960, 540, 0.34 + i * 0.04
            )
            self.assertIsNone(event)
            self.assertTrue(self.hand.gate.closed)

    def test_palm_length_prevents_edge_on_palm_ratio_blowup(self):
        p = points(closed=True)
        p[5], p[17] = (0.495, 0.55), (0.505, 0.55)
        self.assertLess(measure(p, 960, 540).ratio, 0.46)

    def test_reach_edges_stay_inside_camera(self):
        for x, expected in ((0.22, 0), (0.78, 1279)):
            hand = StableHandInput(Config(smoothing=False))
            pointer, _ = hand.update(points(x), 960, 540, 0)
            self.assertAlmostEqual(pointer[0], expected)

    def test_calibration_is_validated_and_suppresses_grab(self):
        self.hand.calibrate()
        self.hand.update(points(0.25, 0.20), 960, 540, 0)
        self.hand.calibrate()
        self.hand.update(points(0.70, 0.70), 960, 540, 0.1)
        self.hand.update(points(0.70, 0.70), 960, 540, 0.25)
        self.hand.calibrate()
        self.assertEqual(self.hand.reach, "custom")
        self.assertEqual(self.hand.cfg.active_region, (0.25, 0.20, 0.70, 0.70))
        self.assertFalse(self.hand.gate.closed)
        with self.assertRaises(ValueError):
            self.hand.set_region((0.5, 0.5, 0.51, 0.51))

    def test_filter_reduces_lag_vs_20_without_losing_rest_stability(self):
        previous, current = OneEuro(), OneEuro(1.8, 8.0)
        signal = [0.25] * 30 + [0.25 + (i + 1) * 0.01 for i in range(40)]
        old = [previous.update(x, i / 30) for i, x in enumerate(signal)]
        new = [current.update(x, i / 30) for i, x in enumerate(signal)]
        self.assertLess(
            sum(abs(a - b) for a, b in zip(signal[35:], new[35:])),
            sum(abs(a - b) for a, b in zip(signal[35:], old[35:])),
        )
        current.reset()
        raw = [0.5 + 0.005 * (-1) ** i for i in range(100)]
        filtered = [current.update(x, i / 30) for i, x in enumerate(raw)]
        self.assertLess(
            sum((x - 0.5) ** 2 for x in filtered[20:]),
            sum((x - 0.5) ** 2 for x in raw[20:]) / 2,
        )


class OwnershipTests(unittest.TestCase):
    def test_small_right_hand_selected_over_larger_left(self):
        selector = HandSelector("right")
        right = Candidate(points(0.7, scale=0.3), label="Right", score=0.95)
        left = Candidate(points(0.3, scale=1.5), label="Left", score=0.99)
        for i, candidates in enumerate(([left, right], [right, left], [left, right])):
            self.assertIs(selector.choose(candidates, i * 0.1), right)

    def test_other_hand_cannot_take_held_object_after_loss(self):
        selector = HandSelector("auto")
        right = Candidate(points(), label="Right", score=0.98)
        left = Candidate(points(0.5), label="Left", score=0.99)
        selector.choose([right], 0)
        for t in (0.1, 0.4, 1.0, 3.0):
            self.assertIsNone(selector.choose([left], t, holding=True))
        self.assertIs(selector.choose([left], 3.1, holding=False), left)
        self.assertEqual(selector.generation, 1)

    def test_uncertain_label_nearby_not_new_owner(self):
        selector = HandSelector("right")
        selector.choose([Candidate(points(), label="Right", score=0.99)], 0)
        candidate = Candidate(points(0.51), label="Left", score=0.51)
        self.assertIs(selector.choose([candidate], 0.05, holding=True), candidate)
        self.assertEqual(selector.label, "Right")
        self.assertIsNone(selector.choose([candidate], 0.5, holding=True))


class SceneLossTests(unittest.TestCase):
    def setUp(self):
        db = load_database(Path(__file__).resolve().parents[1] / "data/chemistry.json")
        self.scene = LabScene(Config(width=1280, height=800, footer=130), db)
        _, rect = next(cards(self.scene.cfg, "tool", 0))
        self.card = ((rect[0] + rect[2]) / 2, (rect[1] + rect[3]) / 2)

    def test_new_vessel_survives_loss_even_before_leaving_inventory(self):
        self.scene.handle("grab", self.card)
        obj = self.scene.drag.obj
        self.scene.handle("park", None)
        self.assertEqual(self.scene.objects, [obj])
        self.assertGreater(obj.x, self.scene.cfg.workspace[0])
        self.assertIsNone(self.scene.drag)

    def test_existing_vessel_stays_at_last_valid_position(self):
        obj = self.scene.spawn("water", 600, 300)
        self.scene.handle("grab", (600, 300))
        self.scene.handle(None, (900, 320))
        self.scene.handle("park", None)
        self.assertEqual((obj.x, obj.y), (900, 320))
        self.assertEqual(obj.mixture.volume_ml, 100)

    def test_release_outside_workspace_does_not_delete_new_object(self):
        self.scene.handle("grab", self.card)
        self.scene.handle("release", self.card)
        self.assertEqual(len(self.scene.objects), 1)

    def test_missing_control_clears_stream_and_dwell_even_if_points_exist(self):
        self.scene.handle("grab", self.card)
        self.scene.stream = (10, 1, 2)
        self.scene.dwell = 0.4
        self.scene.tick(0.05, 1, points(), (720, 1280, 3), tracked=False)
        self.assertIsNone(self.scene.stream)
        self.assertEqual(self.scene.dwell, 0)

    def test_full_input_scene_trace_farther_hand_then_loss(self):
        hand = StableHandInput(self.scene.cfg)
        ax, ay, bx, by = hand.cfg.active_region
        x = ax + self.card[0] / (hand.cfg.width - 1) * (bx - ax)
        y = ay + self.card[1] / (hand.cfg.height - 1) * (by - ay)
        trace = [
            (0, points(x, y, 0.35)),
            (0.1, points(x, y, 0.35)),
            (0.2, points(x, y, 0.35, True)),
            (0.3, points(x, y, 0.35, True)),
        ]
        trace += [
            (0.35 + i * 0.05, points(x + (i + 1) * 0.025, y, 0.35, True))
            for i in range(12)
        ]
        for t, p in trace:
            pointer, event = hand.update(p, 960, 540, t)
            self.scene.handle(event, pointer)
            self.scene.tick(0.05, t, p, (540, 960, 3), hand.valid)
        self.assertEqual(len(self.scene.objects), 1)
        self.assertIsNotNone(self.scene.drag)
        obj = self.scene.drag.obj
        position = (obj.x, obj.y)
        for t in (1.0, 1.5):
            pointer, event = hand.update(None, 960, 540, t)
            self.scene.handle(event, pointer)
            self.scene.tick(0.05, t, tracked=hand.valid)
            self.assertEqual((obj.x, obj.y), position)
        pointer, event = hand.update(None, 960, 540, 3.0)
        self.scene.handle(event, pointer)
        self.assertEqual(self.scene.objects, [obj])
        self.assertIsNone(self.scene.drag)


if __name__ == "__main__":
    unittest.main()
