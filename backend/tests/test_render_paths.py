"""Visual equivalence checks for the optimized CPU compositing path."""

import unittest
import numpy as np
from PIL import Image, ImageDraw
from chemlab.render import text, font


class RenderPathTests(unittest.TestCase):
    def test_cached_vietnamese_glyphs_match_pillow_text(self):
        for caption in ("", "Tay PHẢI · DỄ VỚI · Mở tay", "H₂SO₄ đặc", "°C"):
            old = Image.new("RGB", (700, 100), "#102331")
            new = old.copy()
            ImageDraw.Draw(old).text((15, 15), caption, font=font(15), fill="#e6edf5")
            text(ImageDraw.Draw(new), (15, 15), caption, 15)
            self.assertTrue(np.array_equal(np.asarray(old), np.asarray(new)))

    def test_native_unpremultiply_matches_previous_float_path(self):
        rgba = np.random.default_rng(1).integers(0, 256, (100, 200, 4), dtype=np.uint8)
        rgba[:, :, :3] = np.minimum(rgba[:, :, :3], rgba[:, :, 3:4])
        old = rgba.copy()
        old[:, :, :3] = np.clip(
            rgba[:, :, :3].astype(np.float32)
            * 255
            / np.maximum(rgba[:, :, 3:4].astype(np.float32), 1),
            0,
            255,
        ).astype(np.uint8)
        new = np.asarray(
            Image.frombytes("RGBa", (200, 100), rgba.tobytes()).convert("RGBA")
        )
        self.assertLessEqual(np.abs(old.astype(int) - new.astype(int)).max(), 1)


if __name__ == "__main__":
    unittest.main()
