# Chroma-keys the expansion painted sources (green screen) into game sprites: the four optional-dungeon bosses
# (Brine Colossus, Brass Sentinel, Lantern Queen, Starfall Seer) and the Valorgate Colosseum champion, Vasska.
# Per-image threshold: the Lantern Queen carries pale green lanterns, so her key only removes strongly saturated green.
from PIL import Image, ImageFilter
import numpy as np, os
D=os.path.dirname(os.path.abspath(__file__))
for src,name,h,flip,thr in [('brine_colossus_src.jpg','brine_colossus',300,True,30),('brass_sentinel_src.jpg','brass_sentinel',330,True,30),
                            ('lantern_queen_src.jpg','lantern_queen',340,True,70),('starfall_seer_src.jpg','starfall_seer',340,True,30),
                            ('champion_vasska_src.jpg','champion_vasska',320,True,30)]:
    a=np.asarray(Image.open(f'{D}/painted/{src}').convert('RGB')).astype(float)
    r,g,b=a[...,0],a[...,1],a[...,2]
    key=g-np.maximum(r,b)                       # greenness
    al=np.clip(255-(key-thr)*4,0,255)
    g2=np.minimum(g,np.maximum(r,b)+10+thr-30)   # despill (gentler where the threshold is higher)
    o=Image.fromarray(np.dstack([r,g2,b,al]).clip(0,255).astype('uint8'),'RGBA')
    A=o.getchannel('A').filter(ImageFilter.MinFilter(3));o.putalpha(A)
    o.save(f'{D}/painted/{name}.png',optimize=True)
    o=o.crop(o.getbbox());o=o.resize((round(o.width*h/o.height),h),Image.LANCZOS)
    if flip: o=o.transpose(Image.FLIP_LEFT_RIGHT)  # battle enemies face right
    o.save(f'{D}/game/{name}.png',optimize=True);print(name,o.size)
