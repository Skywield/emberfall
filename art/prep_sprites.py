# Cleans fringes and downsizes painted sprites for in-game use (3x logical size).
from PIL import Image, ImageFilter
import numpy as np, os
D=os.path.dirname(os.path.abspath(__file__))
SIZES={'kael':114,'lyra':114,'mira':114,'bone_sentry':138,'cave_beast':120,'gravemaw':306}
for n,h in SIZES.items():
    im=Image.open(f'{D}/painted/{n}.png').convert('RGBA');a=np.asarray(im).astype(float)
    r,g,b,al=a[...,0],a[...,1],a[...,2],a[...,3]
    g2=np.minimum(g,(r+b)/2+25)                 # green despill
    m=(r+b)/2; spill=(np.minimum(r,b)>g+40)       # magenta despill
    r2=np.where(spill,np.minimum(r,g+60),r); b2=np.where(spill,np.minimum(b,g+60),b)
    al2=np.where(al<200,al*0.6,al)               # soften semi-transparent halo
    o=Image.fromarray(np.dstack([r2,g2,b2,al2]).clip(0,255).astype('uint8'),'RGBA')
    A=o.getchannel('A').filter(ImageFilter.MinFilter(3)); o.putalpha(A)  # erode 1px edge
    o=o.crop(o.getbbox()); o=o.resize((round(o.width*h/o.height),h),Image.LANCZOS)
    o.save(f'{D}/game/{n}.png',optimize=True); print(n,o.size)
