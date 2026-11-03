# Painted world: turns the painted texture sheets / green-screen prop sheets / backdrops in art/painted/world/*_src.jpg into
#  - art/game/world/tiles.jpg  : one opaque atlas row per map tile char; 9 variants (3x3 world-position tiling) x N anim frames,
#                                 each cell 48x48 (= one 16px logical tile at SC=3). Textures are made seamless (two-pass
#                                 half-roll cross-fade) so neighbouring cells of the same char join without seams.
#  - art/game/world/tiles.json : {char:{row,frames}}
#  - art/game/world/isle_*.png, cloud_*.png : keyed sky-map islands / clouds;  sky_sea.jpg : tileable cloud sea
#  - art/game/world/bd_*.jpg    : battle backdrops, 768x456 (= 256x152 logical)
# Props are keyed with the same green key as key_field.py and composited (with a soft contact shadow) onto the painted
# ground of their biome, so every tile stays exactly one 16x16 cell and collision / doors / NPC placement are untouched.
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
import numpy as np, os, json
from scipy import ndimage
D=os.path.dirname(os.path.abspath(__file__));S=f'{D}/painted/world';O=f'{D}/game/world';os.makedirs(O,exist_ok=True)
T=48;N=3;TS=T*N
def src(n):return Image.open(f'{S}/{n}_src.jpg').convert('RGB')
def seamless(im):
    a=np.asarray(im).astype(float);H,W=a.shape[:2]
    def ramp(n):x=np.arange(n);return np.clip(np.minimum(x,n-1-x)/(n*0.22),0,1)
    wx=ramp(W)[None,:,None];a=a*wx+np.roll(a,W//2,1)*(1-wx)
    wy=ramp(H)[:,None,None];a=a*wy+np.roll(a,H//2,0)*(1-wy)
    return a
_tex={}
def tex(sheet,q,bright=1.0,sat=1.0,scale=1.0):
    k=(sheet,q,bright,sat,scale)
    if k in _tex:return _tex[k]
    im=src(sheet);W,H=im.size;c,r=q%2,q//2;w=W//2;i=int(w*0.05)
    sub=im.crop((c*w+i,r*w+i,(c+1)*w-i,(r+1)*w-i))
    if scale!=1.0:s=int(sub.width/scale);o=(sub.width-s)//2;sub=sub.crop((o,o,o+s,o+s))
    sub=sub.resize((TS,TS),Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.2,60,2))
    if bright!=1:sub=ImageEnhance.Brightness(sub).enhance(bright)
    if sat!=1:sub=ImageEnhance.Color(sub).enhance(sat)
    a=seamless(sub);_tex[k]=a;return a
def key(a,thr=30):
    r,g,b=a[...,0],a[...,1],a[...,2];k=g-np.maximum(r,b)
    al=np.clip(255-(k-thr)*4,0,255);g2=np.minimum(g,np.maximum(r,b)+10+max(0,thr-30));return np.dstack([r,g2,b,al])
_obj={}
def obj(sheet,c,r,thr=30):
    k=(sheet,c,r)
    if k in _obj:return _obj[k]
    im=np.asarray(src(sheet)).astype(float);H,W=im.shape[:2];sub=im[r*H//3:(r+1)*H//3,c*W//3:(c+1)*W//3]
    kk=key(sub,thr);m=kk[...,3]>40;lab,n=ndimage.label(ndimage.binary_dilation(m,iterations=4))
    if n:
        sz=ndimage.sum(m,lab,range(1,n+1));keep=[i+1 for i in range(n) if sz[i]>=sz.max()*0.08];kk[...,3]*=np.isin(lab,keep)
    o=Image.fromarray(kk.clip(0,255).astype('uint8'),'RGBA');o.putalpha(o.getchannel('A').filter(ImageFilter.MinFilter(3)));o=o.crop(o.getbbox());_obj[k]=o;return o
def fit(o,w,h,lanczos=True):
    s=min(w/o.width,h/o.height);o=o.resize((max(1,round(o.width*s)),max(1,round(o.height*s))),Image.LANCZOS).filter(ImageFilter.UnsharpMask(1,70,2))
    rim=Image.new('RGBA',o.size,(18,12,22,0));rim.putalpha(o.getchannel('A').filter(ImageFilter.MaxFilter(3)));out=Image.new('RGBA',o.size);out.alpha_composite(rim);out.alpha_composite(o);return out
# ---------- textures: name -> (sheet, quadrant, kwargs) ----------
TX={'grass':('tex_green',0,{}),'dirt':('tex_green',1,{}),'water':('tex_green',2,{}),'cobble':('tex_green',3,{}),
 'roof':('tex_town',0,{}),'plaster':('tex_town',1,{}),'planks':('tex_town',2,{}),'cavefl':('tex_town',3,{'bright':1.45}),
 'cavewall':('tex_dungeon',0,{'bright':0.7}),'grotfl':('tex_dungeon',1,{'bright':1.2}),'grotwall':('tex_dungeon',2,{'bright':0.7}),'vaultfl':('tex_dungeon',3,{}),
 'ash':('tex_ash',0,{}),'lava':('tex_ash',1,{}),'forgewall':('tex_ash',2,{'bright':0.7}),'forgefl':('tex_ash',3,{'bright':1.3}),
 'snow':('tex_frost',0,{}),'snowpath':('tex_frost',1,{}),'icewater':('tex_frost',2,{}),'icefl':('tex_frost',3,{}),
 'slate':('tex_frostmire',0,{}),'glacier':('tex_frostmire',1,{}),'moss':('tex_frostmire',2,{'bright':1.25}),'board':('tex_frostmire',3,{}),
 'swamp':('tex_mire',0,{'bright':0.85}),'thatch':('tex_mire',1,{}),'sunkwall':('tex_mire',2,{'bright':0.7}),'wetfl':('tex_mire',3,{'bright':1.35}),
 'dusk':('tex_veil',0,{'bright':1.15}),'duskpath':('tex_veil',1,{}),'void':('tex_veil',2,{}),'vroof':('tex_veil',3,{}),
 'veilwall':('tex_reach',0,{'bright':0.7}),'veilfl':('tex_reach',1,{'bright':1.3}),'reach':('tex_reach',2,{}),'flag':('tex_reach',3,{}),
 'stars':('tex_throne',0,{}),'thwall':('tex_throne',1,{'bright':0.7}),'thfl':('tex_throne',2,{'bright':1.5}),'gold':('tex_throne',3,{}),
 'sand':('tex_misc',0,{}),'cryptfl':('tex_misc',1,{'bright':1.3}),'cryptwall':('tex_misc',2,{'bright':0.7}),'obsfl':('tex_misc',3,{'bright':1.35}),
 'obswall':('tex_misc2',0,{'bright':0.7}),'vaultwall':('tex_misc2',1,{}),'cliff':('tex_misc2',2,{}),'sandwall':('tex_misc2',3,{})}
def T_(n):s,q,kw=TX[n];return tex(s,q,**kw)
# ---------- props: name -> (sheet, col, row) ----------
PR={'oak':('obj_a',0,0),'flowers':('obj_a',1,0),'mountain':('obj_a',2,0),'fence':('obj_a',0,1),'village':('obj_a',1,1),'cavearch':('obj_a',2,1),
 'chest':('obj_a',0,2),'chesto':('obj_a',1,2),'hut':('obj_a',2,2),'window':('obj_b',0,0),'door':('obj_b',1,0),'ashrock':('obj_b',2,0),
 'deadtree':('obj_b',0,1),'pine':('obj_b',1,1),'iceberg':('obj_b',2,1),'miretree':('obj_b',0,2),'mossstone':('obj_b',1,2),'dusktree':('obj_b',2,2),
 'gravecrystal':('obj_c',0,0),'spire':('obj_c',1,0),'brazier':('obj_c',2,0),'block':('obj_c',0,1),'switch':('obj_c',1,1),'bars':('obj_c',2,1),
 'leveroff':('obj_c',0,2),'leveron':('obj_c',1,2),'urn':('obj_c',2,2),
 'telescope':('obj_d',0,0),'armillary':('obj_d',1,0),'lectern':('obj_d',2,0),'crates':('obj_d',0,1),'barrel':('obj_d',1,1),'well':('obj_d',2,1),'lamp':('obj_d',0,2),'sign':('obj_d',1,2),'bush':('obj_d',2,2)}
def P_(n,w=46,h=46):s,c,r=PR[n];return fit(obj(s,c,r),w,h)
def put(cell,p,ax=0.5,ay=1.0,shadow=True,dy=0):
    x=round((T-p.width)*ax);y=round((T-p.height)*ay)-1+dy
    if shadow:
        sh=Image.new('RGBA',(T,T));d=ImageDraw.Draw(sh);cw=p.width*0.42;d.ellipse((T/2-cw,T-9+dy,T/2+cw,T-2+dy),fill=(10,8,16,110));cell.alpha_composite(sh.filter(ImageFilter.GaussianBlur(1.5)))
    cell.alpha_composite(p,(x,y))
def band(base,top,y0,y1,edge=(30,20,14,255),vert=False):
    # bridge: a band of `top` texture across `base`, with dark edge rails
    b=base.copy()
    for i in range(N):
        o=i*T;b[o+y0:o+y1]=top[o+y0:o+y1];b[o+y0:o+y0+2]*=0.35;b[o+y1-2:o+y1]*=0.35;b[o+y1:o+y1+3]*=0.6
    return b
def cells(a):return [Image.fromarray(a[(i//N)*T:(i//N+1)*T,(i%N)*T:(i%N+1)*T].clip(0,255).astype('uint8')).convert('RGBA') for i in range(N*N)]
def roll(a,dx,dy):return np.roll(np.roll(a,dy,0),dx,1)
def shimmer(a,f):return roll(a,6*f,3*f)*(1+0.06*f)
# ---------- every tile char: ground texture (+ prop) (+ frames) ----------
def G(n,anim=False):return {'g':n,'anim':anim}
def Pp(g,p,**k):return {'g':g,'p':p,**k}
TILES={'.':G('grass'),'f':Pp('grass','flowers',w=34,h=26,ay=0.75,shadow=False),',':G('dirt'),'T':Pp('grass','oak'),'~':G('water',1),
 'B':{'bridge':('water','planks')},'m':Pp('grass','mountain'),'R':G('roof'),'W':Pp('plaster','window',w=34,h=34,ay=0.5,shadow=False),
 'D':Pp('plaster','door',w=30,h=44,shadow=False,dy=1),'F':Pp('grass','fence',w=48,h=34,ay=0.85),'V':Pp('grass','village'),'O':Pp('cavewall','cavearch',w=48,h=48,shadow=False,dy=1),
 ':':G('cavefl'),'X':G('cavewall'),'c':Pp('cavefl','chest',w=36,h=34,ay=0.8),'o':Pp('cavefl','chesto',w=36,h=36,ay=0.8),'S':G('cobble'),
 'q':{'cliff':1},'k':G('void',1),'H':Pp('grass','hut'),
 'a':G('ash'),'r':Pp('ash','ashrock',w=44,h=42),'g':Pp('ash','deadtree'),'L':G('lava',1),'b':{'bridge':('lava','planks',0.55)},'Z':G('forgewall'),';':G('forgefl'),
 's':G('snow'),'j':G('snowpath'),'P':Pp('snow','pine'),'I':Pp('snow','iceberg',w=42,h=42),'K':G('icewater',1),'n':{'bridge':('icewater','icefl')},'U':G('slate'),'Y':G('glacier'),'e':G('icefl'),
 'h':G('moss'),'p':G('board'),'t':Pp('moss','miretree'),'i':Pp('moss','mossstone',w=36,h=44),'l':G('swamp',1),'y':{'bridge':('swamp','board')},'u':G('thatch'),'z':G('sunkwall'),'x':G('wetfl'),
 'd':G('dusk'),'w':G('duskpath'),'A':Pp('dusk','dusktree'),'G':Pp('dusk','gravecrystal',w=40,h=42),'v':{'bridge':('void','duskpath')},'C':G('vroof'),'E':G('veilwall'),'J':G('veilfl'),
 'M':G('reach'),'N':G('flag'),'Q':Pp('reach','spire',w=40,h=46),'#':G('stars',1),'=':{'bridge':('stars','gold')},'%':G('thwall'),'+':G('thfl'),
 '^':G('gold'),'*':Pp('thfl','brazier',w=38,h=44,flick=1),
 '<':G('sand'),'>':{'pier':1},'(':{'facade':1},'1':G('grotfl'),'2':G('grotwall'),'3':Pp('grotfl','block',w=44,h=44),'4':Pp('grotfl','switch',w=40,h=34,ay=0.7,shadow=False),
 '5':Pp('cryptfl','bars',w=48,h=44,shadow=False),'6':Pp('vaultwall','leveroff',w=34,h=44),'7':Pp('vaultwall','leveron',w=34,h=44),'8':G('vaultfl'),'9':G('vaultwall'),'0':G('cryptfl'),'!':G('cryptwall'),
 '$':Pp('cryptfl','urn',w=34,h=44),'&':Pp('cryptfl','brazier',w=38,h=44,flick=1),'?':G('obsfl'),'|':G('obswall'),'@':Pp('obsfl','telescope',w=40,h=44)}
def build(spec):
    if 'bridge' in spec:
        b=spec['bridge'];base,top=T_(b[0]),T_(b[1]);
        if len(b)>2:top=top*b[2]
        frames=[band(shimmer(base,f),top,6,42) for f in (0,1)]
    elif 'pier' in spec:
        w=T_('water');pl=np.rot90(T_('planks')).copy();fr=[]
        for f in (0,1):
            a=shimmer(w,f).copy()
            for i in range(N):x0=i*T;a[:,x0+3:x0+45]=pl[:,x0+3:x0+45];a[:,x0+3:x0+5]*=0.4;a[:,x0+43:x0+45]*=0.4
            fr.append(a)
        frames=fr
    elif 'cliff' in spec:
        a=T_('cliff').copy();g=T_('grass')
        for i in range(N):y0=i*T;a[y0:y0+10]=g[y0:y0+10];a[y0+10:y0+13]*=0.45;a[y0+40:y0+48]*=0.7
        frames=[a]
    elif 'facade' in spec:
        a=T_('sandwall');cs=cells(a);d=P_('door',16,26)
        for c in cs:c.alpha_composite(d,(6,21));c.alpha_composite(d,(26,21))
        return [cs]
    else:
        g=T_(spec['g']);frames=[shimmer(g,f) for f in (0,1)] if spec.get('anim') else [g]
        if 'p' in spec:
            out=[]
            nf=2 if spec.get('flick') else 1
            for f in range(nf):
                cs=cells(g);p=P_(spec['p'],spec.get('w',46),spec.get('h',46))
                if f:p=ImageEnhance.Brightness(p).enhance(1.18)
                for c in cs:put(c,p,ay=spec.get('ay',1.0),shadow=spec.get('shadow',True),dy=spec.get('dy',0))
                out.append(cs)
            return out
    return [cells(a) for a in frames]
if __name__=='__main__':
    rows=[];man={}
    for ch,spec in TILES.items():
        if spec is None:continue
        fr=build(spec);man[ch]={'row':len(rows),'frames':len(fr)};rows+=fr
    atlas=Image.new('RGB',(T*N*N,T*len(rows)))
    for r,cs in enumerate(rows):
        for i,c in enumerate(cs):atlas.paste(c.convert('RGB'),(i*T,r*T))
    atlas.save(f'{O}/tiles.jpg',quality=88,subsampling=0);json.dump(man,open(f'{O}/tiles.json','w'),separators=(',',':'));open(f'{O}/tiles_man.js','w').write('// generated by art/key_world.py\nwindow.PTILE_MAN='+json.dumps(man,separators=(',',':'))+';\n')
    # sky map
    ISL={'isle_plain':('isles_a',0,0),'isle_trees':('isles_a',1,0),'isle_dock':('isles_a',2,0),'isle_wreck':('isles_a',0,1),'isle_ruin':('isles_a',1,1),'isle_hide':('isles_a',2,1),
         'isle_ash':('isles_a',0,2),'isle_frost':('isles_a',1,2),'isle_mire':('isles_a',2,2),'isle_veil':('isles_b',0,0),'isle_throne':('isles_b',1,0),'isle_storm':('isles_b',2,0),
         'cloud_white':('isles_b',0,1),'cloud_storm':('isles_b',1,1),'cloud_wisp':('isles_b',2,1),'isle_rock':('isles_b',0,2),'isle_tree':('isles_b',1,2),'isle_light':('isles_b',2,2)}
    for n,(s,c,r) in ISL.items():
        o=obj(s,c,r);s_=min(150/o.width,150/o.height);o=o.resize((round(o.width*s_),round(o.height*s_)),Image.LANCZOS).filter(ImageFilter.UnsharpMask(1,60,2));o.save(f'{O}/{n}.png',optimize=True)
    sea=src('sky_sea').resize((384,384),Image.LANCZOS);Image.fromarray(seamless(sea).clip(0,255).astype('uint8')).save(f'{O}/sky_sea.jpg',quality=86)
    for b in ['field','cave','ash','forge','snow','glacier','jungle','sunken','twilight','throne','heart']:
        im=src('bd_'+b);W,H=im.size;tw=round(H*768/456);x=(W-tw)//2;im.crop((x,0,x+tw,H)).resize((768,456),Image.LANCZOS).save(f'{O}/bd_{b}.jpg',quality=85)
    print('tiles',len(man),'rows',len(rows),'atlas',atlas.size)
