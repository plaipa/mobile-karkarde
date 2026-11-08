"""Pure-numpy checks for the mask cleaning (no model needed): python -m unittest tools/photo-background/test_matting.py"""
import os
import sys
import unittest

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from matting import clean_mask, final_alpha  # noqa: E402


def scene():
    a = np.zeros((400, 300), dtype=np.float32)
    a[100:340, 80:220] = 1.0          # the phone
    a[180:200, 120:140] = 0.0         # camera hole inside the phone
    a[20:26, 20:26] = 1.0             # speck far away (table scratch)
    a[360:364, 250:290] = 1.0         # another stray mark
    return a


class CleanMask(unittest.TestCase):
    def test_drops_specks_and_keeps_the_device(self):
        keep = clean_mask(scene())
        self.assertFalse(keep[22, 22])
        self.assertFalse(keep[361, 270])
        self.assertTrue(keep[200, 150])

    def test_fills_small_holes_inside_the_device(self):
        keep = clean_mask(scene())
        self.assertTrue(keep[190, 130])

    def test_keeps_big_holes_open(self):
        a = np.zeros((400, 400), dtype=np.float32)
        a[50:350, 50:350] = 1.0
        a[120:280, 120:280] = 0.0     # a strap-like opening, far bigger than 2% of the object
        keep = clean_mask(a)
        self.assertFalse(keep[200, 200])

    def test_multi_object_keeps_other_big_objects(self):
        a = np.zeros((300, 600), dtype=np.float32)
        a[50:250, 40:240] = 1.0
        a[80:220, 360:540] = 1.0
        self.assertFalse(clean_mask(a)[150, 450])
        self.assertTrue(clean_mask(a, multi_object=True)[150, 450])

    def test_final_alpha_is_clean_outside_and_solid_inside(self):
        a = scene()
        out = final_alpha(a, clean_mask(a))
        self.assertEqual(out[22, 22], 0.0)
        self.assertEqual(out[250, 150], 1.0)


if __name__ == "__main__":
    unittest.main()
