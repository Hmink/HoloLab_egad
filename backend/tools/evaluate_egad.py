"""Evaluate independent teacher labels, never use EGAD's own labels as truth.
Input CSV: student_id, concept_id, teacher_label, predicted_label.
No example fabricated outcomes. Hold out STUDENTS when constructing the CSV.
"""
import argparse,csv,json
LABELS=('correct','incomplete','misconception','insufficient')
def evaluate(rows):
    matrix=[[0]*4 for _ in LABELS]
    for row in rows:
        if not row.get('student_id') or not row.get('concept_id'):raise ValueError('Missing anonymous student/concept ID')
        a,b=LABELS.index(row['teacher_label']),LABELS.index(row['predicted_label']);matrix[a][b]+=1
    if not sum(map(sum,matrix)):raise ValueError('Empty data')
    metrics=[]
    for i,label in enumerate(LABELS):
        tp=matrix[i][i];support=sum(matrix[i]);pred=sum(row[i] for row in matrix)
        precision=tp/pred if pred else 0;recall=tp/support if support else None
        f1=2*tp/(support+pred) if support+pred else 0
        metrics.append(dict(label=label,support=support,precision=precision,recall=recall,f1=f1))
    observed=[m['recall'] for m in metrics if m['recall'] is not None]
    return dict(labels=LABELS,confusion_matrix_rows_teacher=matrix,per_class=metrics,macro_f1=sum(m['f1'] for m in metrics)/4,balanced_accuracy=sum(observed)/len(observed),all_four_classes_present=len(observed)==4,warning='Teacher labels must be independent; do not evaluate on model-generated labels or training students.')
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('csv');args=parser.parse_args()
    with open(args.csv,encoding='utf-8-sig',newline='') as f:print(json.dumps(evaluate(list(csv.DictReader(f))),ensure_ascii=False,indent=2))
