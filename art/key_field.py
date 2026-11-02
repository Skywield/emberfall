# Chroma-keys the painted field / overworld sprites (green-screen 3x3 sheets) into small map sprites.
# Same key as key_ch*.py. Every sprite is bottom-centred on a fixed 48x64 canvas (16x21 logical at SC=3, 3:4 like the
# old 12x16 pixel frames) with a light unsharp pass + 1px dark rim so it stays readable at 1x on a 16px tile.
# Heroes: stand + mid-stride sheets, columns front / back / side; side views are normalised to face RIGHT.
from PIL import Image, ImageFilter
import numpy as np, os
from scipy import ndimage
D=os.path.dirname(os.path.abspath(__file__));O=f'{D}/game/field';os.makedirs(O,exist_ok=True)
CW,CH=48,64
def key(a,thr):
    r,g,b=a[...,0],a[...,1],a[...,2];k=g-np.maximum(r,b)
    al=np.clip(255-(k-thr)*4,0,255);g2=np.minimum(g,np.maximum(r,b)+10+max(0,thr-30));return np.dstack([r,g2,b,al])
def cell(im,c,r,thr=30,flip=False):
    H,W=im.shape[:2];sub=im[r*H//3:(r+1)*H//3,c*W//3:(c+1)*W//3]
    k=key(sub,thr);m=k[...,3]>40;lab,n=ndimage.label(ndimage.binary_dilation(m,iterations=4))
    if n:  # keep the main figure: drop specks and bits of neighbours poking in from the cell edges
        sz=ndimage.sum(m,lab,range(1,n+1));big=sz.argmax()+1;edge=set(np.unique(np.r_[lab[0],lab[-1],lab[:,0],lab[:,-1]]))-{0,big}
        keep=[i+1 for i in range(n) if sz[i]>=sz.max()*0.15 and i+1 not in edge];k[...,3]*=np.isin(lab,keep)
    o=Image.fromarray(k.clip(0,255).astype('uint8'),'RGBA');o.putalpha(o.getchannel('A').filter(ImageFilter.MinFilter(3)))
    o=o.crop(o.getbbox());s=min((CH-2)/o.height,(CW-2)/o.width);o=o.resize((max(1,round(o.width*s)),max(1,round(o.height*s))),Image.LANCZOS)
    o=o.filter(ImageFilter.UnsharpMask(1,80,2))
    if flip:o=o.transpose(Image.FLIP_LEFT_RIGHT)
    a=np.asarray(o.getchannel('A'));rim=Image.new('RGBA',o.size,(20,12,24,0));rim.putalpha(Image.fromarray(np.asarray(o.getchannel('A').filter(ImageFilter.MaxFilter(3)))).point(lambda v:min(255,v)))
    out=Image.new('RGBA',(CW,CH));x,y=(CW-o.width)//2,CH-1-o.height;out.alpha_composite(rim,(x,y));out.alpha_composite(o,(x,y));return out
def load(n):return np.asarray(Image.open(f'{D}/painted/{n}_src.jpg').convert('RGB')).astype(float)
SIDE_FACES_LEFT=True   # the hero sheets paint side views facing left
for src,tag in [('field_heroes_stand','s'),('field_heroes_walk','w')]:
    im=load(src)
    for r,h in enumerate(['kael','lyra','mira']):
        for c,d in enumerate(['down','up','side']):
            cell(im,c,r,60 if h=='mira' else 30,flip=(d=='side' and SIDE_FACES_LEFT)).save(f'{O}/{h}_{d}_{tag}.png',optimize=True)
NPC=[['elder','kid','guard','merch','inn','orrin','saffa','dagny','hale'],['sola','brann','rook','isolde','torvald','yrsa','nils','sefa','brannoc'],
     ['wren','odo','seren','varra','hask','lune','tib','aldwin','marrow'],['wick','posy','elowen','bess','cael','gorrim','fen','dill','bly'],
     ['senna','sable','nell','tobin','quill','mara','dov','herald','rusk'],['ada','oriel','pell','marg','ivo','shade']]
THR={'dill':100,'shade':60,'marg':50}
for i,names in enumerate(NPC):
    im=load(f'field_npc{i+1}')
    for j,n in enumerate(names):cell(im,j%3,j//3,THR.get(n,30)).save(f'{O}/{n}.png',optimize=True)
print('ok')
