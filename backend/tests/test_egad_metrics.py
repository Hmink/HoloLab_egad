import unittest
from tools.evaluate_egad import evaluate
class EvaluationTests(unittest.TestCase):
 def test_perfect_four_classes(self):
  rows=[dict(student_id=str(i),concept_id='x',teacher_label=l,predicted_label=l) for i,l in enumerate(['correct','incomplete','misconception','insufficient'])]
  r=evaluate(rows);self.assertEqual(r['macro_f1'],1);self.assertEqual(r['balanced_accuracy'],1)
 def test_absent_classes_disclosed(self):
  r=evaluate([dict(student_id='1',concept_id='x',teacher_label='correct',predicted_label='correct')]);self.assertFalse(r['all_four_classes_present']);self.assertEqual(r['macro_f1'],.25)
 def test_empty_rejected(self):
  with self.assertRaises(ValueError):evaluate([])
