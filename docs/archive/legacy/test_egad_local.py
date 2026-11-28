import io,json,unittest
from egad_local import assess,validate_result
class EGADLocalTests(unittest.TestCase):
 def output(self):return {'label':'incomplete','concepts':[{'id':'chloride-core','label':'incomplete','reason':'Thiếu giải thích ion.','evidence':['AgCl trắng']}],'feedback':'Ion nào tạo chất rắn?'}
 def test_valid_output(self):self.assertFalse(validate_result(self.output(),'AgCl trắng',['chloride-core'])['teacher_verified'])
 def test_fabricated_quote_rejected(self):
  with self.assertRaises(ValueError):validate_result(self.output(),'không biết',['chloride-core'])
 def test_inconsistent_label_rejected(self):
  out=self.output();out['label']='correct'
  with self.assertRaises(ValueError):validate_result(out,'AgCl trắng',['chloride-core'])
 def test_wrong_concept_rejected(self):
  with self.assertRaises(ValueError):validate_result(self.output(),'AgCl trắng',['other'])
 def test_consent_required(self):
  with self.assertRaises(ValueError):assess({'lesson':'chloride','answer':'AgCl trắng'})
 def test_local_protocol_with_mock(self):
  output=self.output()
  class Client:
   def open(self,request,timeout):
    assert request.full_url=='http://127.0.0.1:8080/v1/chat/completions'
    assert timeout==25
    body=json.loads(request.data);assert len(body['messages'])==2
    return io.BytesIO(json.dumps({'choices':[{'message':{'content':json.dumps(output)}}]}).encode())
  self.assertEqual(assess({'consent':True,'lesson':'chloride','answer':'AgCl trắng'},Client())['source'],'local-llama.cpp')
