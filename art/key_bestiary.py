# Chroma-keys the "bestiary" painted sources (green-screen 2x2 sheets, one creature per quadrant) into individual
# game sprites, replacing the old pixel / palette-recolor enemies. Same key as key_ch*.py (greenness -> alpha, despill,
# 3px erode); per-sprite threshold for green-ish subjects. Each quadrant keeps only its significant blobs, cropped and
# scaled to height h. Battle enemies are painted facing left and flipped to face right; sky enemies stay facing left.
# usage: python3 art/key_bestiary.py [sheetNN ...]
from PIL import Image, ImageFilter
import numpy as np, os, sys
from scipy import ndimage
D=os.path.dirname(os.path.abspath(__file__))
B,BB,S=130,300,150   # regular enemy / boss / sky heights (3x logical)
# sheet: [(cell, file, height, flip, thr)] cells numbered TL,TR,BL,BR (grid given by 'g')
SHEETS={
 'sheet01':[(0,'mire_slime',B-10,1,90),(1,'dusk_bat',B,1,30),(2,'thorn_imp',B,1,80),(3,'grave_wisp',B,1,30)],
 'sheet02':[(0,'ash_bat',B,1,30),(1,'slag_slime',B-10,1,30),(2,'ember_wisp',B,1,30),(3,'storm_bat',B,1,30)],
 'sheet03':[(0,'rime_slime',B-10,1,30),(1,'frost_wisp',B,1,30),(2,'tundra_yeti',B+20,1,30),(3,'glacier_sentry',B+10,1,30)],
 'sheet04':[(0,'mire_moth',B,1,40),(1,'bog_slime',B-10,1,40),(2,'fen_lizardman',B+10,1,40),(3,'drowned_knight',B+10,1,40)],
 'sheet06':[(0,'umbral_knight',B+20,1,30),(1,'mirror_wraith',B+10,1,30),(2,'varra_kade',BB-40,1,30),(3,'crown_bat',B,1,30)],
 'sheet07':[(0,'void_ooze',B-10,1,30),(1,'hollow_hound',B,1,30),(2,'shardling',B,1,30)],
 'sheet08':[(0,'oathbound_keeper',B+20,1,30),(1,'heartfire_wisp',B,1,30),(2,'crown_knight',B+20,1,30),(3,'hollow_seraph',B+20,1,30)],
 'sheet09':[(0,'ember_maw',B,1,30),(1,'kings_shade',B+20,1,30),(2,'reef_crab',B-10,1,30),(3,'tide_wisp',B,1,30)],
 'sheet10':[(0,'brine_slime',B-10,1,30),(1,'cog_bat',B,1,30),(2,'gear_knight',B+10,1,30),(3,'sparkling',B-10,1,110)],
 'sheet11':[(0,'lamp_ghost',B,1,40),(1,'ossuary_knight',B+20,1,30),(2,'grave_moth',B,1,30),(3,'star_moth',B,1,30)],
 'sheet12':[(0,'voidling',B-10,1,30),(1,'astral_eye',B-20,1,30),(2,'throne_guard',B+20,1,30)],
 # sky enemies (face left, not flipped)
 'sheet13':[(0,'sky_crownwing',S,0,30),(1,'sky_heartwyrm',S,0,30),(2,'sky_skiff',S-20,0,30),(3,'sky_stormbreaker',S,0,30)],
 'sheet14':[(0,'sky_corsair',S,0,30),(1,'sky_tempest',S,0,30),(2,'sky_nightfall',S,0,30)],
 'sheet05':[(0,'hollow_shade',B,1,30),(1,'veil_bat',B,1,30),(2,'gloomling',B-15,1,30),(3,'dusk_stalker',B,1,30)],
}
GRID={}
def key(a,thr):
    r,g,b=a[...,0],a[...,1],a[...,2]
    k=g-np.maximum(r,b)
    al=np.clip(255-(k-thr)*4,0,255)
    g2=np.minimum(g,np.maximum(r,b)+10+max(0,thr-30))
    return np.dstack([r,g2,b,al])
for sh in (sys.argv[1:] or SHEETS):
    im=np.asarray(Image.open(f'{D}/painted/{sh}_src.jpg').convert('RGB')).astype(float);H,W=im.shape[:2];gx,gy=GRID.get(sh,(2,2))
    for cell,name,h,flip,thr in SHEETS[sh]:
        cx,cy=cell%gx,cell//gx;sub=im[cy*H//gy:(cy+1)*H//gy,cx*W//gx:(cx+1)*W//gx]
        o=key(sub,thr);m=o[...,3]>40;lab,n=ndimage.label(ndimage.binary_dilation(m,iterations=6))
        if n:
            sz=ndimage.sum(m,lab,range(1,n+1));keep=np.isin(lab,1+np.where(sz>=sz.max()*0.04)[0]);o[...,3]*=keep
        o=Image.fromarray(o.clip(0,255).astype('uint8'),'RGBA');o.putalpha(o.getchannel('A').filter(ImageFilter.MinFilter(3)))
        o=o.crop(o.getbbox());o=o.resize((round(o.width*h/o.height),h),Image.LANCZOS)
        if flip:o=o.transpose(Image.FLIP_LEFT_RIGHT)
        o.save(f'{D}/game/{name}.png',optimize=True);print(sh,cell,name,o.size)
