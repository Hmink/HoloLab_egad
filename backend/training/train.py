"""Experimental synthetic-data classifier. Never treat provisional labels as teacher gold."""
import json, re, unicodedata, pathlib, hashlib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import LeaveOneGroupOut
from sklearn.metrics import classification_report, confusion_matrix
ROOT=pathlib.Path(__file__).resolve().parents[1]
def normalize(s):
 s=unicodedata.normalize('NFD',s.lower().replace('đ','d'))
 s=''.join(c for c in s if not unicodedata.combining(c))
 return re.sub('[^a-z0-9]+',' ',s).strip()
def fit(rows):
 v=TfidfVectorizer(preprocessor=normalize,analyzer='char',ngram_range=(2,4),max_features=6000,sublinear_tf=False)
 X=v.fit_transform([r['answer'] for r in rows]);m=LogisticRegression(C=2,class_weight='balanced',max_iter=2000,random_state=42).fit(X,[r['label'] for r in rows]);return v,m
if __name__=='__main__':
 rows=json.loads((ROOT/'training/data.json').read_text(encoding='utf-8')); y=[r['label'] for r in rows];pred=['']*len(rows)
 for tr,te in LeaveOneGroupOut().split(rows,y,[r['question_id'] for r in rows]):
  v,m=fit([rows[i] for i in tr]);p=m.predict(v.transform([rows[i]['answer'] for i in te]))
  for i,a in zip(te,p):pred[i]=a
 v,m=fit(rows)
 model={'version':'synthetic-pilot-1','status':'EXPERIMENTAL_NOT_TEACHER_VALIDATED','classes':m.classes_.tolist(),'vocabulary':{k:int(x) for k,x in v.vocabulary_.items()},'idf':v.idf_.tolist(),'weights':m.coef_.tolist(),'bias':m.intercept_.tolist(),'ngrams':[2,4]}
 (ROOT/'web/data/egad-model.json').write_text(json.dumps(model,ensure_ascii=False),encoding='utf8')
 report={'data_source':'45 AI-simulated answers; labels assigned provisionally by assistant, NOT teacher gold','validation':'Leave one question out (9 folds); synthetic data only; not student-generalization evidence','report':classification_report(y,pred,output_dict=True,zero_division=0),'classes':m.classes_.tolist(),'confusion_matrix':confusion_matrix(y,pred,labels=m.classes_).tolist(),'predictions':[{'id':r['id'],'expected_provisional':r['label'],'predicted':p} for r,p in zip(rows,pred)]}
 (ROOT/'training/metrics.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
 parity=[{'answer':r['answer'],'scores':s.tolist()} for r,s in zip(rows,m.decision_function(v.transform([r['answer'] for r in rows])))]
 (ROOT/'training/parity.json').write_text(json.dumps(parity,ensure_ascii=False),encoding='utf8')
 print(json.dumps(report['report'],indent=2))
