"""HTTP smoke check. Does not substitute for browser/physical webcam tests."""
from pathlib import Path
import json, subprocess, time, urllib.request, socket, sys
root=Path(__file__).resolve().parents[1]
with socket.socket() as sock:
    sock.bind(('127.0.0.1',0)); port=sock.getsockname()[1]
p=subprocess.Popen([sys.executable,'server.py','--no-browser','--browser-tracking','--port',str(port)],cwd=root,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
try:
    for i in range(50):
        try:
            with urllib.request.urlopen(f'http://127.0.0.1:{port}/',timeout=1) as resp: assert resp.status==200
            break
        except OSError: time.sleep(.1)
    else: raise RuntimeError('Server failed to start')
    for path in ['/', '/ui/shell.js','/ui/hololab-ar-v3.css','/egad-pilot.html','/data/egad-model.json','/data/egad-questions.json','/data/egad-examples.json','/src/mouse-motion.js','/vendor/rapier/rapier.mjs']:
        with urllib.request.urlopen(f'http://127.0.0.1:{port}{path}') as resp:
            body=resp.read(); assert resp.status==200 and len(body)>0
            if path.endswith('.json'):json.loads(body)
        print('PASS HTTP',path)
    html=(root/'web/egad-pilot.html').read_text()
    script=html.split('<script type="module">')[1].split('</script>')[0]
    result=subprocess.run(['node','--input-type=module','--check'],input=script,text=True,capture_output=True)
    assert result.returncode==0,result.stderr
    print('PASS pilot inline module syntax')
    questions={x['id'] for x in json.loads((root/'web/data/egad-questions.json').read_text())}
    examples=json.loads((root/'web/data/egad-examples.json').read_text())
    assert len(examples)==45 and {x['question_id'] for x in examples}==questions
    assert all(x['source']=='AI_SIMULATED_TRAINING_EXAMPLE' for x in examples)
    print('PASS 45 examples cover 9 questions with synthetic provenance')
finally:
    p.terminate()
    try:p.wait(timeout=5)
    except subprocess.TimeoutExpired:p.kill()
