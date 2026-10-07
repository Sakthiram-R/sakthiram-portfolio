from pathlib import Path
import subprocess,json
import numpy as np
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parents[1];exe=root/'.tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe'
if not exe.exists():exe='ffmpeg'
def decode(path,kind):
    args=['-i',str(path),'-vf','scale=192:240','-f','rawvideo','-pix_fmt','rgb24','pipe:1'] if kind=='video' else ['-i',str(path),'-vn','-ar','48000','-ac','2','-f','f32le','pipe:1']
    return subprocess.run([str(exe),'-v','error',*args],capture_output=True,check=True).stdout
results=[]
for format in ['mp4','webm']:
    path=root/f'public/hero/hero.{format}';raw=decode(path,'video');frames=np.frombuffer(raw,dtype=np.uint8).reshape(-1,240,192,3);audio=np.frombuffer(decode(path,'audio'),dtype='<f4').reshape(-1,2)
    join=float(np.abs(frames[0].astype(float)-frames[-1]).mean());typical=float(np.abs(np.diff(frames.astype(float),axis=0)).mean())
    strip=Image.new('RGB',(192*4,265),'white');d=ImageDraw.Draw(strip)
    for j,index in enumerate([-2,-1,0,1]):strip.paste(Image.fromarray(frames[index]),(192*j,25));d.text((192*j+10,7),f'Frame {index}',fill='black')
    strip.save(root/f'qa/loop-{format}.png')
    results.append({'format':format,'frames':len(frames),'duration':len(frames)/24,'audioSamples':len(audio),'boundaryMeanPixelDifference':join,'typicalFrameDifference':typical,'audioBoundaryStep':float(np.max(np.abs(audio[0]-audio[-1]))),'size':path.stat().st_size})
(root/'qa/media.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
