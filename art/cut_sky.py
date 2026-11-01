# Cut out light-gray backgrounds of painted sky sprites, save painted PNG + in-game sizes (3x logical).
from PIL import Image, ImageDraw, ImageFilter
import numpy as np, os
D=os.path.dirname(os.path.abspath(__file__))
JOBS=[('airship_cinderwing.png','cinderwing',150,False),('gloomray_src.jpg','gloomray',180,False),('rotwing_roc_src.jpg','rotwing_roc',190,False)]
for src,name,h,_ in JOBS:
    im=Image.open(f'{D}/painted/{src}').convert('RGB'); w,hh=im.size
    k=im.copy()
    seeds=[(x,0) for x in range(0,w,16)]+[(x,hh-1) for x in range(0,w,16)]+[(0,y) for y in range(0,hh,16)]+[(w-1,y) for y in range(0,hh,16)]
    for s in seeds:
        if k.getpixel(s)!=(255,0,255): ImageDraw.floodfill(k,s,(255,0,255),thresh=38)
    a=np.asarray(k); mask=~((a[...,0]==255)&(a[...,1]==0)&(a[...,2]==255))
    al=Image.fromarray((mask*255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    o=im.convert('RGBA'); o.putalpha(al); o=o.crop(o.getbbox())
    o.save(f'{D}/painted/{name}_cut.png',optimize=True)
    g=o.resize((round(o.width*h/o.height),h),Image.LANCZOS); g.save(f'{D}/game/{name}.png',optimize=True); print(name,g.size)
