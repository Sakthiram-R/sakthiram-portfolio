from pathlib import Path
from urllib.request import urlopen, Request
import shutil, re
ROOT=Path(__file__).resolve().parents[1]
def fetch(url,path):
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_bytes(urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=60).read())
fonts=[('inter-tight','intertight','https://cdn.jsdelivr.net/npm/@fontsource-variable/inter-tight@5.2.7/files/inter-tight-latin-wght-normal.woff2'),('jetbrains-mono','jetbrainsmono','https://cdn.jsdelivr.net/npm/@fontsource-variable/jetbrains-mono@5.2.8/files/jetbrains-mono-latin-wght-normal.woff2')]
for name,folder,url in fonts:
    fetch(url,ROOT/'src/fonts'/f'{name}.woff2')
    fetch(f'https://raw.githubusercontent.com/google/fonts/main/ofl/{folder}/OFL.txt',ROOT/'src/fonts'/f'{name}-LICENSE.txt')
for style in ['normal','italic']:
    fetch(f'https://cdn.jsdelivr.net/npm/@fontsource/instrument-serif@5.2.6/files/instrument-serif-latin-400-{style}.woff2',ROOT/'src/fonts'/f'instrument-serif-{style}.woff2')
fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/instrumentserif/OFL.txt',ROOT/'src/fonts/instrument-serif-LICENSE.txt')
for logo in ['html5','css3','javascript','react','bootstrap','nodejs','express','django','mongodb','mysql','python','java','git']:
    suffix='plain' if logo=='django' else 'original'
    fetch(f'https://raw.githubusercontent.com/devicons/devicon/master/icons/{logo}/{logo}-{suffix}.svg',ROOT/'public/logos'/f'{logo}.svg')
fetch('https://raw.githubusercontent.com/devicons/devicon/master/LICENSE',ROOT/'public/logos/LICENSE')
source=Path(r'C:\Users\Admin\OneDrive\Desktop\3D portfolio agent')
shutil.copy2(source/'Resume.pdf',ROOT/'public/Resume.pdf')
print('Fonts, licenses, logos and resume ready.')
