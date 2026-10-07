"""Build a phase-aligned circular crossfade. Requires numpy, Pillow and FFmpeg.
Usage: python scripts/build-hero-assets.py INPUT --ffmpeg PATH [--crop W:H:X:Y]
"""
import argparse, subprocess, tempfile, wave, re
from pathlib import Path
import numpy as np
from PIL import Image, ImageOps
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('input');p.add_argument('--ffmpeg',default='ffmpeg');p.add_argument('--crop');p.add_argument('--seconds',type=float,default=10);a=p.parse_args()
def run(args,**kw):return subprocess.run([a.ffmpeg,'-hide_banner','-loglevel','error','-y',*map(str,args)],check=True,**kw)
info=subprocess.run([a.ffmpeg,'-i',a.input],capture_output=True,text=True).stderr
m=re.search(r'Duration: (\d+):(\d+):([\d.]+)',info)
duration=min(a.seconds,int(m[1])*3600+int(m[2])*60+float(m[3])); fade=.5
if duration<2:raise ValueError('Video must be at least two seconds.')
out=ROOT/'public';(out/'hero').mkdir(parents=True,exist_ok=True)
with tempfile.TemporaryDirectory() as tmp:
    tmp=Path(tmp)
    # Detect the dark silhouette against the supplied plain light backdrop.
    run(['-ss','1','-i',a.input,'-frames:v','1',tmp/'still.png'])
    still=Image.open(tmp/'still.png').convert('RGB');rgb=np.asarray(still)
    mask=rgb.mean(axis=2)<150;ys,xs=np.where(mask)
    if len(xs)<100:raise ValueError('Person detection uncertain. Supply --crop W:H:X:Y.')
    height=still.height; width=int(height*.8)//2*2
    center=int(np.median(xs));x=max(0,min(still.width-width,center-width//2))//2*2
    crop=a.crop or f'{width}:{height}:{x}:0'; print('Crop:',crop,flush=True)
    # Choose a crisp portrait from candidate frames using edge energy.
    candidates=[]
    for t in [0,1,2,3,4]:
        run(['-ss',t,'-i',a.input,'-frames:v','1',tmp/f'p{t}.png'])
        im=Image.open(tmp/f'p{t}.png').convert('RGB');box=(center-160,15,center+160,415);im=im.crop(box)
        gray=np.asarray(im.convert('L'),dtype=float);score=np.abs(np.diff(gray,axis=0)).mean();candidates.append((score,im))
    portrait=max(candidates,key=lambda c:c[0])[1];portrait.resize((480,600),Image.Resampling.LANCZOS).save(out/'portrait-bust.webp',quality=88)
    og=Image.new('RGB',(1200,630),'#f4f2ee');person=ImageOps.contain(still.crop((x,0,x+width,height)),(600,630));og.paste(person,((1200-person.width)//2,0));og.save(out/'og.jpg',quality=90)
    # Decode audio once; crossfade in numpy, preserving the same phase as xfade.
    raw=run(['-i',a.input,'-t',duration,'-vn','-ar','48000','-ac','2','-f','f32le','pipe:1'],capture_output=True).stdout
    samples=np.frombuffer(raw,dtype='<f4').reshape(-1,2);n=int(fade*48000);end=int(duration*48000);samples=samples[:end]
    if len(samples)<end:samples=np.pad(samples,((0,end-len(samples)),(0,0)))
    w=np.linspace(0,1,n,endpoint=False)[:,None]
    audio=np.concatenate([samples[n:end-n],samples[end-n:end]*(1-w)+samples[:n]*w])
    with wave.open(str(tmp/'loop.wav'),'wb') as wav:
        wav.setnchannels(2);wav.setsampwidth(2);wav.setframerate(48000);wav.writeframes((np.clip(audio,-1,1)*32767).astype('<i2').tobytes())
    filters=f'[0:v]trim=start={fade}:end={duration},setpts=PTS-STARTPTS,crop={crop},scale=768:-2,colorlevels=rimax=0.98:gimax=0.98:bimax=0.98,colorlevels=rimax=0.96:gimax=0.96:bimax=0.96,setsar=1,format=yuv420p,fps=24,settb=1/24[body];[0:v]trim=start=0:end={fade+1/24},setpts=PTS-STARTPTS,crop={crop},scale=768:-2,colorlevels=rimax=0.98:gimax=0.98:bimax=0.98,colorlevels=rimax=0.96:gimax=0.96:bimax=0.96,setsar=1,format=yuv420p,fps=24,settb=1/24[head];[body][head]xfade=transition=fade:duration={fade}:offset={duration-2*fade}[v]'
    common=['-i',a.input,'-i',tmp/'loop.wav','-filter_complex',filters,'-map','[v]','-map','1:a','-t',duration-fade,'-r','24']
    run([*common,'-c:v','libx264','-pix_fmt','yuv420p','-crf','24','-preset','slow','-c:a','aac','-b:a','96k','-movflags','+faststart',out/'hero/hero.mp4'])
    run([*common,'-c:v','libvpx-vp9','-crf','36','-b:v','0','-row-mt','1','-c:a','libopus','-b:a','80k',out/'hero/hero.webm'])
    print(f'Built {duration-fade:.2f}s loop. Audio samples: {len(audio)}. Portrait and OG ready.')
