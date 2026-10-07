from pathlib import Path
import zipfile, os
root=Path(__file__).resolve().parents[1]
skip={'node_modules','.next','.next-dev','.tools','.git','.sites-runtime','out'}
target=root.parent/'sakthiram-portfolio-source.zip'
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
    for folder,dirs,files in os.walk(root):
        dirs[:]=[d for d in dirs if d not in skip]
        for filename in files:
            p=Path(folder)/filename;relative=p.relative_to(root)
            if p.name not in {'frame.png','tsconfig.tsbuildinfo'}:
                z.write(p,Path('sakthiram-portfolio')/relative)
print(target, target.stat().st_size)
