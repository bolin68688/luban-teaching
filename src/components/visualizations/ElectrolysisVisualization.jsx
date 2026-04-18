import { useEffect, useRef } from 'react'

const C = {
  water: 'rgba(64,164,223,0.25)', waterDeep: 'rgba(30,100,180,0.4)',
  pos: '#E74C3C', neg: '#3498DB',
  h2: '#7FDBFF', o2: '#FF6B6B',
  tubeH2: 'rgba(127,219,255,0.15)', tubeO2: 'rgba(255,107,107,0.15)',
  gasH2: '#4FC3F7', gasO2: '#EF5350',
  electron: '#FFD700', bg: '#080818', gold: '#D4AF37'
}

export default function ElectrolysisVisualization({ params = {}, actions = {} }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const timerRef = useRef(null)

  // 所有状态用 ref
  const sRef = useRef({
    running: false, h2Vol: 0, o2Vol: 0,
    voltage: 6, conc: 15, electrolyte: 'Na₂SO₄(中性)',
    showMol: true, showE: false,
    time: 0
  })
  const bubs = useRef([])

  // 参数同步
  useEffect(() => {
    const s = sRef.current
    s.voltage = params['电压'] ?? 6
    s.conc = params['电解质浓度'] ?? 15
    s.electrolyte = params['电解质类型'] ?? 'Na₂SO₄(中性)'
    s.showMol = params['显示分子式'] !== false
    s.showE = params['显示电子流向'] === true || params['显示电子流向'] === true
  }, [params])

  // 按钮
  useEffect(() => {
    actions['通电开始'] = () => { sRef.current.running = true }
    actions['暂停'] = () => { sRef.current.running = false; stopTimer() }
    actions['重置'] = () => {
      sRef.current.running = false; sRef.current.time = 0
      sRef.current.h2Vol = 0; sRef.current.o2Vol = 0
      bubs.current = []; stopTimer()
    }
    return stopTimer
  }, [actions])

  function stopTimer() { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null } }

  // ===== 主渲染循环 =====
  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    function resize() {
      const w = cvs.clientWidth || cvs.parentElement?.clientWidth || 800
      const h = cvs.clientHeight || cvs.parentElement?.clientHeight || 600
      cvs.width = w * dpr
      cvs.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      return { w, h }
    }

    function rr(x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.arcTo(x+w,y,x+w,y+r,r)
      ctx.lineTo(x+w,y+h-r); ctx.arcTo(x+w,y+h,x+r,y+h,r)
      ctx.lineTo(x+r,y+h); ctx.arcTo(x,y+h,x,y+h-r,r)
      ctx.lineTo(x,y+r); ctx.arcTo(x,y,x+r,y,r); ctx.closePath()
    }

    // 状态更新定时器
    timerRef.current = setInterval(() => {
      const s = sRef.current
      if (!s.running) return
      s.time += 0.05
      const rate = Math.max(0, (s.voltage - 1.23)) * (s.conc / 15) * 0.08
      if (rate > 0) {
        s.h2Vol += rate * 2; s.o2Vol += rate
        if (Math.random() < rate * 1.5) bubs.current.push({ x:0,y:0,r:0,vx:0,vy:0, side:'neg',age:0,type:'h2' })
        if (Math.random() < rate * 0.75) bubs.current.push({ x:0,y:0,r:0,vx:0,vy:0, side:'pos',age:0,type:'o2' })
        if (bubs.current.length > 120) bubs.current = bubs.current.slice(-80)
      }
    }, 50)

    function drawPS(ctx, x, y, v, on) {
      const bw=70,bh=36
      ctx.fillStyle=on?'rgba(212,175,55,0.15)':'rgba(80,80,80,0.3)'
      ctx.strokeStyle=on?C.gold:'#555'; ctx.lineWidth=1.5
      rr(x-bw/2,y-bh/2,bw,bh,6); ctx.fill(); ctx.stroke()
      ctx.strokeStyle=on?'#fff':'#666'; ctx.lineWidth=2
      ctx.beginPath();ctx.moveTo(x-12,y);ctx.lineTo(x-4,y);ctx.stroke()
      ctx.beginPath();ctx.moveTo(x+4,y);ctx.lineTo(x+12,y);ctx.stroke()
      ctx.fillStyle=on?C.pos:'#666';ctx.font='bold 11px serif';ctx.fillText('+',x-16,y-8)
      ctx.fillStyle=on?C.neg:'#666';ctx.fillText('−',x+10,y-8)
      ctx.fillStyle=on?C.gold:'#555';ctx.font='bold 12px monospace'
      ctx.textAlign='center';ctx.fillText(v.toFixed(1)+'V',x,y+14);ctx.textAlign='left'
    }

    function drawTube(ctx,x,y,w,h,vol,maxV,gCol,bgCol,label) {
      ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=2
      rr(x,y,w,h,4);ctx.stroke()
      ctx.fillStyle=bgCol;rr(x+2,y+2,w-4,h-4,3);ctx.fill()
      const fr=Math.min(vol/maxV,1),gH=(h-4)*fr
      if(gH>1){
        const gg=ctx.createLinearGradient(x,y+h-4-gH,x,y+h-4)
        gg.addColorStop(0,gCol+'44');gg.addColorStop(1,gCol+'aa')
        ctx.fillStyle=gg;rr(x+3,y+h-4-gH,w-6,gH,2);ctx.fill()
      }
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px monospace'
      for(let i=0;i<=4;i++){const ky=y+h-4-(h-4)*i/4;ctx.fillRect(x+w-5,ky,3,1);if(i>0)ctx.fillText(maxV*i/4,x+w+4,ky+3)}
      ctx.fillStyle=gCol;ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.fillText(label,x+w/2,y-8);ctx.textAlign='left'
      if(vol>0.5){ctx.font='bold 11px monospace';ctx.fillStyle='#fff';ctx.fillText(vol.toFixed(1)+'mL',x+w/2-18,y+h-8)}
    }

    function drawLoop() {
      const {w:Ht,h}=resize()
      if(Ht===0||h===0){rafRef.current=requestAnimationFrame(drawLoop);return}
      const cx=Ht/2,s=sRef.current

      ctx.fillStyle=C.bg;ctx.fillRect(0,0,Ht,h)

      // 布局
      const tW=Math.min(Ht*0.48,280),tH=h*0.40,tX=cx-tW/2,tY=h*0.34,wL=tY+10
      const eGap=tW*0.52,pX=cx-eGap/2,nX=cx+eGap/2
      const tw=tW*0.17,th=h*0.26,pTx=pX-tw/2-tw*0.35,nTx=nX-tw/2+tw*0.35,tBot=wL-5
      const eTop=tY+22,eBot=tY+tH-14,eW=5

      // 电源
      drawPS(ctx,cx,42,s.voltage,s.running)

      // 导线
      ctx.strokeStyle=s.running?C.electron:'#444';ctx.lineWidth=2
      ctx.setLineDash(s.showE?[]:[6,4])
      ctx.beginPath();ctx.moveTo(cx,67);ctx.lineTo(cx,85);ctx.lineTo(pX,85);ctx.lineTo(pX,eTop);ctx.stroke()
      ctx.beginPath();ctx.moveTo(cx,67);ctx.lineTo(nX,85);ctx.lineTo(nX,eTop);ctx.stroke()
      ctx.setLineDash([])

      // 电子流动
      if(s.showE&&s.running){const dt=Date.now()/200;for(let i=0;i<5;i++){
        const et=((dt+i*0.3)%3)/3,ex=nX+(cx-nX)*et,ey=85-20*Math.sin(et*Math.PI)
        ctx.fillStyle=C.electron;ctx.beginPath();ctx.arc(ex,ey,3,0,Math.PI*2);ctx.fill()
        ctx.font='9px sans-serif';ctx.fillText('e⁻',ex-5,ey-6)}}

      // 收集管
      drawTube(ctx,pTx,tBot-th,tw,th,s.o2Vol,40,C.gasO2,C.tubeO2,'O₂')
      drawTube(ctx,nTx,tBot-th,tw,th,s.h2Vol,80,C.gasH2,C.tubeH2,'H₂')

      // 连接管
      ctx.strokeStyle='rgba(255,255,255,0.25)';ctx.lineWidth=2
      ctx.beginPath();ctx.moveTo(pTx+tw*0.3,tBot);ctx.quadraticCurveTo(pTx+tw*0.3,wL-18,pX,wL-23);ctx.stroke()
      ctx.beginPath();ctx.moveTo(nTx+tw*0.7,tBot);ctx.quadraticCurveTo(nTx+tw*0.7,wL-18,nX,wL-23);ctx.stroke()

      // 水槽
      ctx.strokeStyle='rgba(255,255,255,0.35)';ctx.lineWidth=2
      ctx.beginPath();ctx.moveTo(tX,tY);ctx.lineTo(tX,tY+tH);ctx.lineTo(tX+tW,tY+tH);ctx.lineTo(tX+tW,tY);ctx.stroke()
      ctx.beginPath();ctx.arc(tX+tW/2,tY+tH,tW/2,0,Math.PI,false);ctx.stroke()

      // 水
      const wg=ctx.createLinearGradient(tX,wL,tX,tY+tH)
      wg.addColorStop(0,C.water);wg.addColorStop(1,C.waterDeep);ctx.fillStyle=wg
      ctx.beginPath();ctx.moveTo(tX+2,wL);ctx.lineTo(tX+2,tY+tH-2)
      ctx.arc(tX+tW/2,tY+tH,tW/2-2,Math.PI,0,true);ctx.closePath();ctx.fill()

      // 波纹
      if(s.running){ctx.strokeStyle='rgba(150,210,255,0.2)';ctx.lineWidth=1;const wt=Date.now()/500
      ctx.beginPath();for(let xx=tX+5;xx<tX+tW-5;xx++){
        const wy=wL+Math.sin((xx-tX)*0.06+wt)*1.5;if(xx===tX+5)ctx.moveTo(xx,wy);else ctx.lineTo(xx,wy)}
      ctx.stroke()}

      // 电极
      const pg=ctx.createLinearGradient(pX-eW/2,0,pX+eW/2,0)
      pg.addColorStop(0,'#c0392b');pg.addColorStop(0.5,C.pos);pg.addColorStop(1,'#c0392b');ctx.fillStyle=pg
      rr(pX-eW/2,eTop,eW,eBot-eTop,3);ctx.fill()
      const ng=ctx.createLinearGradient(nX-eW/2,0,nX+eW/2,0)
      ng.addColorStop(0,'#2980b9');ng.addColorStop(0.5,C.neg);ng.addColorStop(1,'#2980b9');ctx.fillStyle=ng
      rr(nX-eW/2,eTop,eW,eBot-eTop,3);ctx.fill()

      // 电极标签
      ctx.fillStyle=C.pos;ctx.font='bold 13px serif';ctx.fillText('(+)',pX-8,eTop-8)
      ctx.fillStyle=C.neg;ctx.fillText('(−)',nX-8,eTop-8)

      // 气泡
      const arr=bubs.current
      for(let i=arr.length-1;i>=0;i--){
        const b=arr[i];b.age++
        if(b.y===0){
          b.x=b.side==='pos'?pX:nX;b.y=eBot-Math.random()*(eBot-wL)*0.6
          b.r=(b.type==='h2'?2.5:2)+Math.random()*2;b.vx=(Math.random()-0.5)*0.6
          b.vy=-(0.6+Math.random()*0.8)*(s.voltage/6)
        }
        b.x+=b.vx;b.y+=b.vy;b.vy*=0.995;b.vx+=(Math.random()-0.5)*0.15
        if(b.y<wL-15){arr.splice(i,1);continue}
        const a=Math.max(0.2,1-b.age/120),col=b.type==='h2'?C.h2:C.o2
        const bgg=ctx.createRadialGradient(b.x-b.r*0.3,b.y-b.r*0.3,0,b.x,b.y,b.r)
        const alphaStr = String(a)
        bgg.addColorStop(0,"rgba(255,255,255,"+alphaStr+")")
        const colRgba = col==="rgb(127, 219, 255)"?"rgba(127,219,255,"+alphaStr+")":col==="rgb(255, 107, 107)"?"rgba(255,107,107,"+alphaStr+")":col
        bgg.addColorStop(0.4,colRgba)
        bgg.addColorStop(1,col+"00")
        ctx.fillStyle=bgg;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill()
      }

      // 分子式
      if(s.showMol){
        ctx.font='bold 11px monospace'
        ctx.fillStyle=C.pos
        ctx.fillText('4OH-4e->2H2O+O2',pX-56,eBot+16)
        ctx.fillStyle=C.neg
        ctx.fillText('2H++2e->H2',nX-34,eBot+16)
        ctx.fillStyle=C.gold;ctx.font='bold 14px serif';ctx.textAlign='center'
        ctx.fillText('2H2O -> 2H2 + O2',cx,h-32);ctx.textAlign='left'
      }

      // 数据面板
      const dpX=Ht-120,dpY=h*0.10
      ctx.fillStyle='rgba(0,0,0,0.5)';rr(dpX-10,dpY-10,115,88,8);ctx.fill()
      ctx.strokeStyle='rgba(212,175,55,0.3)';ctx.lineWidth=1;ctx.stroke()
      ctx.fillStyle=C.gold;ctx.font='bold 12px serif';ctx.fillText('⚡ 实验数据',dpX,dpY+6)
      ctx.font='11px monospace';ctx.fillStyle=C.gasH2;ctx.fillText(`H₂:${s.h2Vol.toFixed(1)}mL`,dpX,dpY+24)
      ctx.fillStyle=C.gasO2;ctx.fillText(`O₂:${s.o2Vol.toFixed(1)}mL`,dpX,dpY+42)
      ctx.fillStyle='#ccc';const ratio=s.o2Vol>0.5?(s.h2Vol/s.o2Vol).toFixed(2):'--'
      ctx.fillText(`体积比(H₂/O₂):${ratio}`,dpX,dpY+60)
      const cur=s.running?Math.max(0,(s.voltage-1.23))*(s.conc/15)*0.5:0
      ctx.fillStyle=s.running?'#4CAF50':'#666';ctx.fillText(`${s.running?'▶':'⏸'}I=${cur.toFixed(2)}A`,dpX,dpY+78)

      // 电解质信息
      ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='11px monospace'
      ctx.fillText(`电解液:${s.electrolyte.split('(')[0]}(${s.conc}%)`,tX,tY+tH+20)

      rafRef.current=requestAnimationFrame(drawLoop)
    }

    rafRef.current=requestAnimationFrame(drawLoop)

    return ()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);stopTimer()}
  }, [])

  return (
    <div style={{ width:'100%',height:'100%',background:C.bg,borderRadius:'var(--radius-lg)',overflow:'hidden',position:'relative' }}>
      <canvas ref={canvasRef} style={{width:'100%',height:'100%',display:'block'}} />
    </div>
  )
}
