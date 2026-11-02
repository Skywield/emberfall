# Chroma-keys the Chapter 6 painted sources (green screen) into game sprites.
from PIL import Image, ImageFilter
import numpy as np, os
D=os.path.dirname(os.path.abspath(__file__))
for src,name,h in [('eclipse_warden_src.jpg','eclipse_warden',320),('gloam_leviathan_src.jpg','gloam_leviathan',130)]:
    a=np.asarray(Image.open(f'{D}/painted/{src}').convert('RGB')).astype(float)
    r,g,b=a[...,0],a[...,1],a[...,2]
    key=g-np.maximum(r,b)                       # greenness
    al=np.clip(255-(key-30)*4,0,255)
    g2=np.minimum(g,np.maximum(r,b)+10)          # despill
    o=Image.fromarray(np.dstack([r,g2,b,al]).clip(0,255).astype('uint8'),'RGBA')
    A=o.getchannel('A').filter(ImageFilter.MinFilter(3));o.putalpha(A)
    o.save(f'{D}/painted/{name}.png',optimize=True)
    o=o.crop(o.getbbox());o=o.resize((round(o.width*h/o.height),h),Image.LANCZOS)
    if False: o=o.transpose(Image.FLIP_LEFT_RIGHT)  # battle enemies face right
    o.save(f'{D}/game/{name}.png',optimize=True);print(name,o.size)
