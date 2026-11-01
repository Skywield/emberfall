from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
A="/cursor/stores/store-047b8dba-e8b2-4b4b-8cb9-afb4b4221878/grok-bot/agents/4d873f4f-c3ce-4b62-96cf-f12e3272e09c/assets"
src={'kael':('3671c33b','g'),'lyra':('e36d0eae','g'),'mira':('02281301','g'),'bone_sentry':('47c321f7','m'),'cave_beast':('3e5e1371','m'),'gravemaw':('7550d4a9','g')}
import glob
for n,(h,k) in src.items():
  f=glob.glob(A+'/'+h+'*')[0];im=np.asarray(Image.open(f).convert('RGB')).astype(float);r,g,b=im[...,0],im[...,1],im[...,2]
  d=(g-np.maximum(r,b)) if k=='g' else (np.minimum(r,b)-g)
  a=np.clip(255-(d-40)*4,0,255)
  if k=='g': im[...,1]=np.minimum(g,np.maximum(r,b)+10)
  else: m=np.maximum(r,b);im[...,0]=np.minimum(r,g+(m-g)*0.5+20);im[...,2]=np.minimum(b,g+(m-g)*0.5+20)
  o=Image.fromarray(np.dstack([im,a]).astype('uint8'),'RGBA');o=o.crop(o.getbbox());o.thumbnail((360 if n!='gravemaw' else 512,)*2,Image.LANCZOS);o.save(n+'.png',optimize=True)
W,H=780,1688;bg=Image.new('RGB',(W,H),'#05060c');d=ImageDraw.Draw(bg)
sw,sh=780,682;sc=Image.new('RGB',(sw,sh))
for y in range(sh):
  t=y/sh;ImageDraw.Draw(sc).line([(0,y),(sw,y)],fill=(int(10+40*t),int(8+32*t),int(20+60*t)))
sd=ImageDraw.Draw(sc)
for i in range(14): x=i*58;sd.polygon([(x,0),(x+30,0),(x+15,40+(i*23)%60)],fill=(18,14,28))
sd.ellipse([20,330,420,380],fill=(20,16,30))
def put(n,h,x,y,flip=False):
  im=Image.open(n+'.png');im=im.resize((int(im.width*h/im.height),h),Image.LANCZOS)
  if flip: im=im.transpose(Image.FLIP_LEFT_RIGHT)
  sd.ellipse([x+im.width*0.15,y+h-14,x+im.width*0.85,y+h+8],fill=(16,12,24));sc.paste(im,(int(x),int(y)),im)
put('gravemaw',330,30,30)
put('kael',170,545,60);put('lyra',165,610,215);put('mira',165,520,380) if False else put('mira',160,640,400-40)
sc2=sc
bg.paste(sc2,(0,180))
f=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',s)
def win(x,y,w,h):
  for i in range(h): d.line([(x,y+i),(x+w,y+i)],fill=(int(48-36*i/h),int(72-50*i/h),int(200-104*i/h)))
  d.rounded_rectangle([x,y,x+w,y+h],6,outline=(232,236,255),width=3)
win(250,200,280,48);d.text((390,212),'Frost Lance',font=f(26),fill='white',anchor='mt')
d.text((220,250),'WEAK',font=f(22),fill=(255,128,64));d.text((220,276),'184',font=f(36),fill=(255,224,64))
y0=180+sh-10;win(0,y0,300,210);win(300,y0,480,210)
for i,o in enumerate(['Attack','Magic','Item','Defend']): d.text((60,y0+22+i*44),o,font=f(26),fill='white')
d.polygon([(22,y0+70),(42,y0+80),(22,y0+90)],fill='white')
for i,(n,hp,mh,mp,atb) in enumerate([('Kael',268,300,40,1),('Lyra',201,233,61,.6),('Mira',240,253,72,.3)]):
  yy=y0+18+i*62;d.text((330,yy),n,font=f(24),fill='white');d.text((610,yy),f'{hp}/{mh}',font=f(22),fill='white',anchor='ra');d.text((630,yy+2),f'MP{mp}',font=f(18),fill=(150,200,255))
  d.rectangle([330,yy+34,600,yy+40],fill=(30,30,50));d.rectangle([330,yy+34,330+270*hp/mh,yy+40],fill=(60,200,100))
  d.rectangle([620,yy+34,750,yy+40],fill=(30,30,50));d.rectangle([620,yy+34,620+130*atb,yy+40],fill=(255,224,64) if atb==1 else (220,120,40))
d.text((390,1400),'Painted sprite mockup — Emberfall',font=f(22),fill=(140,140,170),anchor='mt')
bg.save('mockup_battle_phone.png',optimize=True)
