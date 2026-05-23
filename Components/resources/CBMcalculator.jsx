"use client"

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Plus, Trash2, Copy, Check, Package, Info,
  ChevronDown, Plane, Ship, ArrowRight, Scale,
  AlertCircle, BadgeCheck, Ruler, Calculator,
  FileText, Globe, Zap, BarChart3, Menu, X,
  TrendingUp, Clock, Shield, Users, CheckCircle,
  Box, Weight, Container, Layers
} from "lucide-react";

/* ═══════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════ */
const T = {
  pageBg:  "#f0f4fa",
  card:    "#ffffff",
  cardAlt: "#f8fafd",
  border:  "#dde4f0",
  navy:    "#1a3560",
  navyDk:  "#0f2040",
  navyMd:  "#243d72",
  navyLt:  "#e8eef8",
  orange:  "#e07b10",
  orangeLt:"#fff4e6",
  orangeBr:"#f59a3a",
  orangeDk:"#b85e08",
  blue:    "#2563eb",
  blueLt:  "#eff6ff",
  green:   "#16a34a",
  greenLt: "#f0fdf4",
  red:     "#dc2626",
  redLt:   "#fef2f2",
  amber:   "#d97706",
  amberLt: "#fffbeb",
  purple:  "#7c3aed",
  teal:    "#0d9488",
  text:    "#0f1e35",
  textMid: "#4a5f7a",
  textDim: "#8898b2",
  textFnt: "#b8c8dc",
  fontSans:"'Plus Jakarta Sans', sans-serif",
  fontMono:"'Fira Code', monospace",
  radius:  16,
  radiusSm:10,
  shadow:  "0 1px 4px rgba(15,32,64,0.07), 0 4px 16px rgba(15,32,64,0.05)",
  shadowMd:"0 4px 24px rgba(15,32,64,0.12)",
  shadowLg:"0 8px 40px rgba(15,32,64,0.16)",
};

/* ═══════════════════════════════════════
   CALCULATOR CONSTANTS
═══════════════════════════════════════ */
const UNIT_TO_M  = { cm: 0.01, mm: 0.001, m: 1, in: 0.0254, ft: 0.3048 };
const UNITS      = ["cm", "mm", "m", "in", "ft"];
const CONTAINERS = [
  { id: "20gp", name: "20ft GP", cbm: 25.0, maxKg: 21700, color: T.blue   },
  { id: "40gp", name: "40ft GP", cbm: 60.0, maxKg: 27400, color: T.green  },
  { id: "40hc", name: "40ft HC", cbm: 72.0, maxKg: 27600, color: T.purple },
];
let _uid = 1;
const newItem = () => ({ id: _uid++, name:"", l:"", w:"", h:"", unit:"cm", qty:"1", wt:"" });

function calcItem(item) {
  const f = UNIT_TO_M[item.unit] || 0.01;
  const l = (parseFloat(item.l)||0)*f, w=(parseFloat(item.w)||0)*f, h=(parseFloat(item.h)||0)*f;
  const cbmEach = l*w*h, qty=Math.max(parseInt(item.qty)||0,0), wt=Math.max(parseFloat(item.wt)||0,0);
  return { cbmEach, cbmTotal:cbmEach*qty, wtTotal:wt*qty, qty };
}
const fmtC  = n => n.toFixed(4).replace(/\.?0+$/,"")||"0";
const fmtC3 = n => n.toFixed(3);
const fmtKg = n => new Intl.NumberFormat("en-IN",{maximumFractionDigits:2}).format(n);
const fmtN  = n => new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(Math.round(n));

function useCountUp(target, ms=480) {
  const [val, setVal]=useState(target);
  const frame=useRef(null), from=useRef(target);
  useEffect(()=>{
    const start=from.current, t0=performance.now();
    const tick=now=>{ const p=Math.min((now-t0)/ms,1),e=1-Math.pow(1-p,3); setVal(start+(target-start)*e); if(p<1) frame.current=requestAnimationFrame(tick); else from.current=target; };
    frame.current=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(frame.current);
  },[target]);
  return val;
}

/* ═══════════════════════════════════════
   CALCULATOR PRIMITIVES
═══════════════════════════════════════ */
function Lbl({children}) {
  return <label style={{fontSize:10,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",color:T.textDim,fontFamily:T.fontSans,display:"block",marginBottom:5}}>{children}</label>;
}
function NumIn({value,onChange,placeholder,style={}}) {
  return <input type="number" min={0} value={value} placeholder={placeholder||"0"} onChange={e=>onChange(e.target.value)}
    style={{width:"100%",background:T.card,border:`1.5px solid ${T.border}`,borderRadius:9,padding:"9px 10px",fontSize:13,color:T.text,fontFamily:T.fontMono,fontWeight:600,outline:"none",transition:"border-color .18s",boxSizing:"border-box",...style}}/>;
}
function UnitSel({value,onChange}) {
  return <div style={{position:"relative"}}>
    <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",appearance:"none",background:T.navyLt,border:`1.5px solid ${T.border}`,borderRadius:9,padding:"9px 26px 9px 10px",fontSize:12,color:T.navy,fontFamily:T.fontSans,fontWeight:700,outline:"none",cursor:"pointer"}}>
      {UNITS.map(u=><option key={u} value={u}>{u}</option>)}
    </select>
    <ChevronDown style={{position:"absolute",right:7,top:"50%",transform:"translateY(-50%)",width:13,height:13,color:T.navy,pointerEvents:"none"}}/>
  </div>;
}

function ContainerBar({container,totalCBM,totalKg}) {
  const cp=Math.min((totalCBM/container.cbm)*100,100), kp=Math.min((totalKg/container.maxKg)*100,100);
  const fits=totalCBM<=container.cbm&&totalKg<=container.maxKg;
  const lp=Math.max(cp,kp);
  const bc=lp<70?T.green:lp<90?T.orange:lp>=100?T.red:T.blue;
  return (
    <div style={{background:T.cardAlt,border:`1.5px solid ${fits?T.border:"#fca5a5"}`,borderRadius:12,padding:"13px 15px",marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:10,height:10,borderRadius:2,background:container.color}}/>
          <span style={{fontSize:13,fontWeight:700,color:T.text,fontFamily:T.fontSans}}>{container.name}</span>
        </div>
        <span style={{fontSize:12,fontWeight:700,color:fits?T.green:T.red,fontFamily:T.fontSans,background:fits?T.greenLt:T.redLt,padding:"3px 10px",borderRadius:99}}>{fits?"✓ Fits":"✗ Oversize"}</span>
      </div>
      {[{label:"Volume",pct:cp,fmt:`${fmtC3(totalCBM)} / ${container.cbm} CBM`},{label:"Weight",pct:kp,fmt:`${fmtN(totalKg)} / ${fmtN(container.maxKg)} kg`}].map(row=>(
        <div key={row.label} style={{marginBottom:6}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
            <span style={{fontSize:10,color:T.textDim,fontFamily:T.fontSans,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em"}}>{row.label}</span>
            <span style={{fontSize:11,fontFamily:T.fontMono,color:T.textMid}}>{row.fmt}</span>
          </div>
          <div style={{height:7,background:T.border,borderRadius:99,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${row.pct}%`,background:bc,borderRadius:99,transition:"width 0.5s cubic-bezier(.4,0,.2,1)"}}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChargeBar({actual,volumetric,unit}) {
  const max=Math.max(actual,volumetric,0.001);
  const ap=(actual/max)*100, vp=(volumetric/max)*100, vh=volumetric>actual;
  return (
    <div style={{marginBottom:12}}>
      {[{label:"Gross wt.",pct:ap,hi:!vh},{label:"Vol. wt.",pct:vp,hi:vh}].map(r=>(
        <div key={r.label} style={{display:"flex",alignItems:"center",gap:9,marginBottom:5}}>
          <span style={{fontSize:10,color:T.textDim,fontFamily:T.fontSans,width:70,flexShrink:0,textAlign:"right"}}>{r.label}</span>
          <div style={{flex:1,height:8,background:T.border,borderRadius:99,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${r.pct}%`,background:r.hi?(r.label==="Vol. wt."?T.orange:T.navy):T.textFnt,borderRadius:99,transition:"width 0.5s"}}/>
          </div>
          <span style={{fontSize:11,fontFamily:T.fontMono,color:T.textMid,width:90}}>{fmtKg(r.label==="Gross wt."?actual:volumetric)} {unit}</span>
        </div>
      ))}
      <p style={{fontSize:11,color:vh?T.orange:T.navy,fontFamily:T.fontSans,fontWeight:600,marginTop:4}}>
        {vh?"⚑ Volumetric weight is higher — freight charged on volume.":"✓ Gross weight governs — freight charged on actual weight."}
      </p>
    </div>
  );
}

function ItemCard({item,idx,onChange,onDelete,canDelete,calc}) {
  return (
    <div style={{background:T.card,border:`1.5px solid ${T.border}`,borderRadius:T.radius,padding:20,marginBottom:14,boxShadow:T.shadow}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:26,height:26,borderRadius:7,background:T.navyLt,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Package style={{width:13,height:13,color:T.navy}}/>
          </div>
          <span style={{fontSize:13,fontWeight:700,color:T.textMid,fontFamily:T.fontSans}}>Package {idx+1}</span>
        </div>
        <button onClick={onDelete} disabled={!canDelete}
          style={{display:"flex",alignItems:"center",gap:5,background:canDelete?T.redLt:T.cardAlt,border:`1px solid ${canDelete?"#fca5a5":T.border}`,borderRadius:8,padding:"5px 10px",color:canDelete?T.red:T.textFnt,cursor:canDelete?"pointer":"not-allowed",fontSize:12,fontFamily:T.fontSans}}>
          <Trash2 style={{width:12,height:12}}/>Remove
        </button>
      </div>
      <div style={{marginBottom:12}}>
        <Lbl>Item Description (optional)</Lbl>
        <input type="text" value={item.name} placeholder="e.g. Carton box, Wooden crate…" onChange={e=>onChange("name",e.target.value)}
          style={{width:"100%",background:T.cardAlt,border:`1.5px solid ${T.border}`,borderRadius:9,padding:"9px 12px",fontSize:13,color:T.text,fontFamily:T.fontSans,outline:"none",boxSizing:"border-box"}}/>
      </div>
      <div style={{marginBottom:12}}>
        <Lbl>Dimensions (L × W × H) + Unit</Lbl>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 76px",gap:8}}>
          <NumIn value={item.l} onChange={v=>onChange("l",v)} placeholder="Length"/>
          <NumIn value={item.w} onChange={v=>onChange("w",v)} placeholder="Width"/>
          <NumIn value={item.h} onChange={v=>onChange("h",v)} placeholder="Height"/>
          <UnitSel value={item.unit} onChange={v=>onChange("unit",v)}/>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        <div><Lbl>Quantity (pcs)</Lbl><NumIn value={item.qty} onChange={v=>onChange("qty",v)} placeholder="1"/></div>
        <div><Lbl>Gross Weight / pc (kg)</Lbl><NumIn value={item.wt} onChange={v=>onChange("wt",v)} placeholder="0.00"/></div>
      </div>
      <div style={{display:"flex",gap:16,background:T.navyLt,borderRadius:10,padding:"10px 14px",border:`1px solid ${T.border}`}}>
        {[{l:"CBM / pc",v:fmtC(calc.cbmEach)},{l:"Total CBM",v:fmtC(calc.cbmTotal)},{l:"Total Wt",v:`${fmtKg(calc.wtTotal)} kg`}].map((x,i)=>(
          <div key={x.l} style={{display:"flex",gap:i>0?16:0}}>
            {i>0&&<div style={{width:1,background:T.border}}/>}
            <div style={{paddingLeft:i>0?16:0}}>
              <p style={{fontSize:9,color:T.textDim,fontFamily:T.fontSans,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{x.l}</p>
              <p style={{fontSize:14,fontWeight:700,color:T.navy,fontFamily:T.fontMono}}>{x.v}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   CBM CALCULATOR COMPONENT
═══════════════════════════════════════ */
function CBMCalculator() {
  const [items, setItems]   = useState([newItem()]);
  const [copied, setCopied] = useState(false);

  const addItem    = () => setItems(p=>[...p,newItem()]);
  const removeItem = id => setItems(p=>p.filter(i=>i.id!==id));
  const updateItem = (id,f,v) => setItems(p=>p.map(i=>i.id===id?{...i,[f]:v}:i));

  const calcs = useMemo(()=>{ const m={}; items.forEach(i=>{m[i.id]=calcItem(i);}); return m; },[items]);

  const totals = useMemo(()=>{
    const all      = items.map(i=>calcs[i.id]);
    const totalCBM = all.reduce((s,c)=>s+c.cbmTotal,0);
    const totalKg  = all.reduce((s,c)=>s+c.wtTotal,0);
    const totalQty = all.reduce((s,c)=>s+c.qty,0);
    const volAir   = totalCBM*167;
    return { totalCBM, totalKg, totalQty, volAir, volSea:totalCBM, chargeAir:Math.max(totalKg,volAir), chargeSea:Math.max(totalKg/1000,totalCBM) };
  },[items,calcs]);

  const animCBM = useCountUp(totals.totalCBM*1000);
  const animKg  = useCountUp(Math.round(totals.totalKg));

  const handleCopy = () => {
    const txt=[
      "CBM Calculation — ONS Logistics","",
      ...items.map((item,i)=>{
        const c=calcs[item.id];
        return [`Package ${i+1}${item.name?` — ${item.name}`:""}`,`  ${item.l||0}×${item.w||0}×${item.h||0} ${item.unit}  ×${item.qty||0} pcs  ${item.wt||0} kg/pc`,`  CBM/pc: ${fmtC(c.cbmEach)}  Total CBM: ${fmtC(c.cbmTotal)}  Total Wt: ${fmtKg(c.wtTotal)} kg`].join("\n");
      }),
      "","─────────────────────────────",
      `Total CBM      : ${fmtC3(totals.totalCBM)} CBM`,
      `Total Gross Wt : ${fmtKg(totals.totalKg)} kg`,
      `Total Pieces   : ${totals.totalQty} pcs`,
      "",
      `Vol. Wt (Air)  : ${fmtKg(totals.volAir)} kg  (1 CBM=167 kg)`,
      `Chargeable Air : ${fmtKg(totals.chargeAir)} kg`,
      `Chargeable Sea : ${fmtC3(totals.chargeSea)} RT`,
    ].join("\n");
    navigator.clipboard.writeText(txt).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2500); });
  };

  return (
    <div id="calculator" style={{display:"grid",gridTemplateColumns:"1fr 400px",gap:24,maxWidth:1180,margin:"0 auto",padding:"0 24px",alignItems:"start"}} className="cbm-grid">
      {/* LEFT */}
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div>
            <h3 style={{fontSize:16,fontWeight:700,color:T.navyDk,fontFamily:T.fontSans}}>Package Details</h3>
            <p style={{fontSize:12,color:T.textDim,marginTop:2,fontFamily:T.fontSans}}>{items.length} package type{items.length!==1?"s":""} · {totals.totalQty} total pieces</p>
          </div>
          <button onClick={addItem} style={{display:"flex",alignItems:"center",gap:7,background:T.navy,border:"none",borderRadius:10,padding:"10px 18px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:T.fontSans,boxShadow:"0 2px 8px rgba(15,32,64,0.2)"}}>
            <Plus style={{width:15,height:15}}/>Add Package
          </button>
        </div>

        {items.map((item,idx)=>(
          <ItemCard key={item.id} item={item} idx={idx} calc={calcs[item.id]} canDelete={items.length>1}
            onChange={(f,v)=>updateItem(item.id,f,v)} onDelete={()=>removeItem(item.id)}/>
        ))}

        {items.length>1&&(
          <div style={{background:T.navy,borderRadius:T.radius,padding:"18px 22px",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:16,boxShadow:T.shadowMd}}>
            {[{l:"Total Pieces",v:`${totals.totalQty} pcs`},{l:"Total CBM",v:`${fmtC3(totals.totalCBM)} CBM`},{l:"Total Gross Wt",v:`${fmtKg(totals.totalKg)} kg`}].map(x=>(
              <div key={x.l} style={{textAlign:"center"}}>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.5)",fontFamily:T.fontSans,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>{x.l}</p>
                <p style={{fontSize:18,fontWeight:800,color:"#fff",fontFamily:T.fontMono}}>{x.v}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{display:"flex",gap:10,background:T.blueLt,border:`1.5px solid #bfdbfe`,borderRadius:12,padding:"13px 16px",marginTop:16}}>
          <Info style={{width:15,height:15,color:T.blue,flexShrink:0,marginTop:1}}/>
          <p style={{fontSize:12,color:"#3b82f6",fontFamily:T.fontMono,lineHeight:1.7}}>
            CBM = L(m) × W(m) × H(m) × Qty &nbsp;·&nbsp; All units converted to metres automatically.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{position:"sticky",top:88}} className="cbm-sticky">
        <div style={{background:T.card,borderRadius:T.radius,boxShadow:T.shadowMd,overflow:"hidden",marginBottom:16,border:`1.5px solid ${T.border}`}}>
          <div style={{height:4,background:`linear-gradient(90deg,${T.navy},${T.orange})`}}/>
          <div style={{padding:22}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
              <p style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:"0.09em",textTransform:"uppercase",fontFamily:T.fontSans}}>Volume Summary</p>
              <button onClick={handleCopy} style={{display:"flex",alignItems:"center",gap:6,background:copied?T.greenLt:T.cardAlt,border:`1.5px solid ${copied?"#bbf7d0":T.border}`,borderRadius:9,padding:"7px 12px",color:copied?T.green:T.textMid,fontSize:12,cursor:"pointer",fontFamily:T.fontSans,fontWeight:600,transition:"all .2s"}}>
                {copied?<Check style={{width:13,height:13}}/>:<Copy style={{width:13,height:13}}/>}{copied?"Copied!":"Export"}
              </button>
            </div>

            <div style={{background:`linear-gradient(135deg,${T.navyDk},${T.navy})`,borderRadius:14,padding:"18px 20px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.5)",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:T.fontSans}}>Total Volume</p>
                <p style={{fontSize:32,fontWeight:800,color:"#fff",fontFamily:T.fontMono,marginTop:4,letterSpacing:"-0.04em"}}>{fmtC3(animCBM/1000)}</p>
                <p style={{fontSize:13,color:T.orangeBr,fontFamily:T.fontSans,fontWeight:600,marginTop:2}}>CBM (cubic metres)</p>
              </div>
              <div style={{textAlign:"right"}}>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.45)",fontFamily:T.fontSans,marginBottom:4}}>Gross weight</p>
                <p style={{fontSize:20,fontWeight:700,color:T.orangeBr,fontFamily:T.fontMono}}>{fmtKg(animKg)} kg</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.35)",fontFamily:T.fontSans,marginTop:2}}>{totals.totalQty} pieces</p>
              </div>
            </div>

            <p style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:"0.09em",textTransform:"uppercase",fontFamily:T.fontSans,marginBottom:12}}>Chargeable Weight Analysis</p>

            {[{icon:<Plane style={{width:14,height:14,color:T.navy}}/>,label:"Air Freight",sub:"1 CBM = 167 kg (IATA)",actual:totals.totalKg,vol:totals.volAir,charge:totals.chargeAir,unit:"kg"},
              {icon:<Ship style={{width:14,height:14,color:T.navy}}/>,label:"Sea LCL",sub:"1 RT = 1 CBM or 1,000 kg",actual:totals.totalKg/1000,vol:totals.volSea,charge:totals.chargeSea,unit:"RT"}].map(m=>(
              <div key={m.label} style={{background:T.cardAlt,border:`1.5px solid ${T.border}`,borderRadius:12,padding:"14px 16px",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
                  {m.icon}
                  <span style={{fontSize:12,fontWeight:700,color:T.navy,fontFamily:T.fontSans}}>{m.label} <span style={{color:T.textDim,fontWeight:500}}>· {m.sub}</span></span>
                </div>
                <ChargeBar actual={m.actual} volumetric={m.vol} unit={m.unit}/>
                <div style={{background:T.navyLt,borderRadius:9,padding:"9px 12px",display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:12,color:T.navy,fontFamily:T.fontSans,fontWeight:600}}>Chargeable</span>
                  <span style={{fontSize:14,color:T.navy,fontFamily:T.fontMono,fontWeight:700}}>{fmtKg(m.charge)} {m.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:T.card,border:`1.5px solid ${T.border}`,borderRadius:T.radius,padding:22,boxShadow:T.shadow,marginBottom:16}}>
          <p style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:"0.09em",textTransform:"uppercase",fontFamily:T.fontSans,marginBottom:14}}>FCL Container Fit</p>
          {CONTAINERS.map(c=><ContainerBar key={c.id} container={c} totalCBM={totals.totalCBM} totalKg={totals.totalKg}/>)}
          <div style={{display:"flex",gap:8,background:T.amberLt,border:`1px solid #fde68a`,borderRadius:10,padding:"10px 13px",marginTop:4}}>
            <AlertCircle style={{width:14,height:14,color:T.amber,flexShrink:0,marginTop:1}}/>
            <p style={{fontSize:11,color:"#92400e",lineHeight:1.65,fontFamily:T.fontSans}}>Usable capacities shown. Actual fill depends on stackability, packing, and carrier rules.</p>
          </div>
        </div>

        <div style={{background:T.card,border:`1.5px solid ${T.border}`,borderRadius:T.radius,padding:22,boxShadow:T.shadow}}>
          <p style={{fontSize:14,fontWeight:700,color:T.navyDk,fontFamily:T.fontSans,marginBottom:8}}>Ready for a freight quote?</p>
          <p style={{fontSize:13,color:T.textMid,lineHeight:1.7,marginBottom:16,fontFamily:T.fontSans}}>Share your CBM estimate with our team for an accurate sea or air freight quote with door-to-door options.</p>
          <a href="/request-quote" style={{display:"inline-flex",alignItems:"center",gap:8,background:T.navy,color:"#fff",borderRadius:10,padding:"12px 22px",fontSize:13,fontWeight:700,textDecoration:"none",fontFamily:T.fontSans,boxShadow:"0 2px 8px rgba(15,32,64,0.25)"}}>
            Get a Freight Quote <ArrowRight style={{width:15,height:15}}/>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   PAGE SECTIONS
═══════════════════════════════════════ */

/* Hero */
function Hero() {
  const stats = [
    { icon:<Ruler style={{width:15,height:15}}/>,    label:"5 Unit Types",      sub:"cm · mm · m · in · ft" },
    { icon:<Calculator style={{width:15,height:15}}/>,label:"IATA Standard",     sub:"Certified formula" },
    { icon:<Ship style={{width:15,height:15}}/>,      label:"3 Container Types", sub:"20ft · 40ft · 40HC" },
    { icon:<Zap style={{width:15,height:15}}/>,       label:"Real-time Results", sub:"Instant calculation" },
  ];
  return (
    <div style={{background:`linear-gradient(90deg,rgba(30,58,138,0.92) 0%,rgba(30,58,138,0.65) 50%,rgba(30,58,138,0.28) 100%),url("/cbm-hero.png")`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",position:"relative",overflow:"hidden"}}>
      {/* Grid pattern */}
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)`,backgroundSize:"48px 48px",pointerEvents:"none",opacity:0.5}}/>
      {/* Right fade */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,rgba(30,58,138,0.15),rgba(30,58,138,0.55))",pointerEvents:"none"}}/>
      {/* Glow */}
      <div style={{position:"absolute",top:"-20%",right:"10%",width:500,height:500,borderRadius:"50%",background:"rgba(240,123,16,0.10)",filter:"blur(90px)",pointerEvents:"none"}}/>

      <div style={{maxWidth:1180,margin:"0 auto",padding:"72px 24px 56px",position:"relative"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(245,154,58,0.18)",border:"1px solid rgba(245,154,58,0.35)",borderRadius:99,padding:"6px 16px",fontSize:12,color:T.orangeBr,fontWeight:700,marginBottom:22,letterSpacing:"0.05em"}}>
          <Package style={{width:13,height:13}}/> Free Online CBM Calculator
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center"}} className="hero-grid">
          <div>
            <h1 style={{fontSize:"clamp(28px,4vw,50px)",fontWeight:800,color:"#fff",lineHeight:1.1,letterSpacing:"-0.03em",marginBottom:18}}>
              Calculate CBM &<br/><span style={{color:T.orangeBr}}>Chargeable Weight</span><br/>Instantly.
            </h1>
            <p style={{fontSize:16,color:"rgba(255,255,255,0.6)",lineHeight:1.8,marginBottom:30,maxWidth:460}}>
              Enter your cargo dimensions in any unit. Get total cubic metres, volumetric weight for air & sea freight, and container fit analysis — in real time, with zero guesswork.
            </p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <a href="#calculator" style={{display:"inline-flex",alignItems:"center",gap:8,background:T.orange,color:"#fff",borderRadius:11,padding:"13px 26px",fontSize:14,fontWeight:700,textDecoration:"none",fontFamily:T.fontSans,boxShadow:`0 4px 20px rgba(224,123,16,0.4)`}}>
                <Calculator style={{width:16,height:16}}/> Calculate Now
              </a>
              <a href="/contact" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",borderRadius:11,padding:"13px 26px",fontSize:14,fontWeight:700,textDecoration:"none",fontFamily:T.fontSans}}>
                Get a Freight Quote
              </a>
            </div>
          </div>

          {/* Visual card */}
          <div className="hero-visual" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:28,backdropFilter:"blur(8px)"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[
                {label:"Total CBM",value:"12.480",sub:"cubic metres",color:T.orangeBr},
                {label:"Gross Weight",value:"3,240",sub:"kilograms",color:"#7dd3fc"},
                {label:"Vol. Wt (Air)",value:"2,084",sub:"kg chargeable",color:"#86efac"},
                {label:"Container",value:"20ft GP",sub:"68% utilised",color:"#c4b5fd"},
              ].map(x=>(
                <div key={x.label} style={{background:"rgba(255,255,255,0.06)",borderRadius:12,padding:"14px 16px",border:"1px solid rgba(255,255,255,0.08)"}}>
                  <p style={{fontSize:10,color:"rgba(255,255,255,0.45)",fontFamily:T.fontSans,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{x.label}</p>
                  <p style={{fontSize:22,fontWeight:800,color:x.color,fontFamily:T.fontMono,letterSpacing:"-0.03em"}}>{x.value}</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",fontFamily:T.fontSans,marginTop:4}}>{x.sub}</p>
                </div>
              ))}
            </div>
            <div style={{marginTop:12,background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
              <CheckCircle style={{width:14,height:14,color:T.green}}/>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.55)",fontFamily:T.fontSans}}>Fits in 20ft GP container · 68% volume utilised</span>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{marginTop:48,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"rgba(255,255,255,0.08)",borderRadius:14,overflow:"hidden"}} className="stats-strip">
          {stats.map((s,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.05)",padding:"18px 20px",textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",color:T.orangeBr,marginBottom:8}}>{s.icon}</div>
              <p style={{fontSize:13,fontWeight:700,color:"#fff",fontFamily:T.fontSans}}>{s.label}</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontFamily:T.fontSans,marginTop:3}}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* How it works */
function HowItWorks() {
  const steps = [
    { n:"01", icon:<Package style={{width:22,height:22}}/>, title:"Enter Dimensions", body:"Type in your cargo length, width, and height. Switch between cm, mm, metres, inches, or feet — the calculator converts everything automatically." },
    { n:"02", icon:<Layers style={{width:22,height:22}}/>,  title:"Add All Package Types", body:"Click 'Add Package' for each different SKU or box size. Mix units and quantities freely. Each row shows CBM per piece and totals instantly." },
    { n:"03", icon:<BarChart3 style={{width:22,height:22}}/>,title:"Analyse Results",  body:"Get total CBM, chargeable weight for air and sea, and a container fit analysis with utilisation bars for 20ft GP, 40ft GP, and 40ft HC." },
  ];
  return (
    <div style={{background:"#fff",padding:"72px 24px"}}>
      <div style={{maxWidth:1180,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <p style={{fontSize:12,fontWeight:700,color:T.orange,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:T.fontSans,marginBottom:10}}>How It Works</p>
          <h2 style={{fontSize:"clamp(24px,3vw,36px)",fontWeight:800,color:T.navyDk,letterSpacing:"-0.025em",fontFamily:T.fontSans}}>Three steps to your CBM figure</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}} className="three-col">
          {steps.map((s,i)=>(
            <div key={i} style={{background:T.pageBg,border:`1.5px solid ${T.border}`,borderRadius:T.radius,padding:28,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:16,right:20,fontSize:48,fontWeight:800,color:T.navyLt,fontFamily:T.fontMono,lineHeight:1}}>{s.n}</div>
              <div style={{width:46,height:46,borderRadius:12,background:T.navyLt,display:"flex",alignItems:"center",justifyContent:"center",color:T.navy,marginBottom:18,position:"relative"}}>{s.icon}</div>
              <h3 style={{fontSize:16,fontWeight:700,color:T.navyDk,fontFamily:T.fontSans,marginBottom:10}}>{s.title}</h3>
              <p style={{fontSize:13.5,color:T.textMid,lineHeight:1.75,fontFamily:T.fontSans}}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Why it matters */
function WhyMatters() {
  const features = [
    { icon:<TrendingUp style={{width:18,height:18}}/>, color:T.blue, title:"Avoid Freight Overcharges", body:"Carriers bill whichever is higher — actual weight or volumetric weight. Knowing this upfront lets you negotiate rates and re-pack efficiently." },
    { icon:<Ship style={{width:18,height:18}}/>,       color:T.green, title:"Choose the Right Container", body:"Booking a 40ft for cargo that fits in a 20ft wastes money. Our container fit bars show utilisation for all standard sizes at a glance." },
    { icon:<FileText style={{width:18,height:18}}/>,   color:T.orange, title:"Accurate Freight Quotes", body:"LCL sea freight is priced per Revenue Ton (CBM or 1,000 kg). Submit precise CBM figures and avoid quote revisions at the last minute." },
    { icon:<Globe style={{width:18,height:18}}/>,      color:T.purple, title:"Multi-origin Consolidations", body:"Consolidating from multiple suppliers? Add each vendor's cargo as a separate package type to get your total shipment volume instantly." },
    { icon:<Ruler style={{width:18,height:18}}/>,      color:T.teal, title:"Any Unit, Any Origin", body:"Suppliers in China quote cm. US warehouses quote inches. Our unit converter handles all five units without any manual maths on your end." },
    { icon:<BadgeCheck style={{width:18,height:18}}/>, color:T.navyMd, title:"IATA-Standard Calculations", body:"Air volumetric weight uses the IATA divisor of 6,000 cm³/kg (= 167 kg/CBM). Sea LCL uses the international Revenue Ton standard." },
  ];
  return (
    <div style={{background:T.pageBg,padding:"72px 24px"}}>
      <div style={{maxWidth:1180,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <p style={{fontSize:12,fontWeight:700,color:T.orange,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:T.fontSans,marginBottom:10}}>Why Accuracy Matters</p>
          <h2 style={{fontSize:"clamp(24px,3vw,36px)",fontWeight:800,color:T.navyDk,letterSpacing:"-0.025em",fontFamily:T.fontSans}}>Built for importers who move real cargo</h2>
          <p style={{fontSize:15,color:T.textMid,lineHeight:1.75,maxWidth:560,margin:"14px auto 0",fontFamily:T.fontSans}}>Every kilogram and every cubic centimetre counts in freight. Here's why professionals rely on precise CBM calculation.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}} className="three-col">
          {features.map((f,i)=>(
            <div key={i} style={{background:T.card,border:`1.5px solid ${T.border}`,borderRadius:T.radius,padding:24,boxShadow:T.shadow}}>
              <div style={{width:40,height:40,borderRadius:10,background:`${f.color}15`,display:"flex",alignItems:"center",justifyContent:"center",color:f.color,marginBottom:16}}>{f.icon}</div>
              <h3 style={{fontSize:15,fontWeight:700,color:T.navyDk,fontFamily:T.fontSans,marginBottom:8}}>{f.title}</h3>
              <p style={{fontSize:13,color:T.textMid,lineHeight:1.75,fontFamily:T.fontSans}}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* FAQ */
function FAQSection() {
  const [open, setOpen] = useState(0);
  const items = [
    { q:"What is CBM (Cubic Metre) in shipping?", a:"CBM stands for Cubic Metre — the standard unit for measuring cargo volume in international freight. It is calculated as Length × Width × Height, with all dimensions in metres. Freight charges for sea LCL and air cargo are based on CBM (or weight, whichever yields the higher revenue for the carrier)." },
    { q:"How is volumetric weight calculated for air freight?", a:"Air volumetric weight uses the IATA standard divisor of 6,000 cm³ per kilogram. In CBM terms: 1 CBM = 1,000,000 cm³ ÷ 6,000 = 166.67 kg. Airlines charge whichever is higher — the actual gross weight or the volumetric weight. Light, bulky cargo almost always attracts volumetric charges." },
    { q:"What is a Revenue Ton (RT) in sea freight?", a:"A Revenue Ton is the billing unit for sea LCL shipments. One RT equals either 1 CBM (by volume) or 1,000 kg (by weight), whichever is greater. Shipping lines charge per RT, so if your cargo is 5 CBM and 3,000 kg, you pay for 5 RT (volume governs)." },
    { q:"Which container size should I choose for my cargo?", a:"For cargo up to approximately 25 CBM or 21,700 kg: a 20ft GP container. Up to 60 CBM or 27,400 kg: a 40ft GP. Up to 72 CBM or 27,600 kg: a 40ft HC (High Cube). If your cargo exceeds all three, you need LCL or multiple containers. Always leave 5–10% buffer for dunnage and blocking." },
    { q:"What is the difference between FCL and LCL?", a:"FCL (Full Container Load) means you book an entire container — typically 20ft or 40ft — regardless of how full it is. LCL (Less than Container Load) means your cargo is consolidated with other shippers' goods and you pay only for the CBM and weight you use. FCL is more cost-efficient above roughly 12–15 CBM; LCL suits smaller shipments." },
    { q:"Why does my freight quote differ from the CBM I calculated?", a:"Carriers may apply a minimum charge, a higher-than-standard volumetric divisor, or surcharges (fuel, port congestion, hazmat). Additionally, the shipping line will measure your actual cargo at origin — if dimensions differ from what you declared, rates adjust accordingly. Always verify with your freight forwarder before booking." },
  ];
  return (
    <div style={{background:"#fff",padding:"72px 24px"}}>
      <div style={{maxWidth:760,margin:"0 auto"}}>
        <p style={{fontSize:12,fontWeight:700,color:T.orange,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:T.fontSans,marginBottom:10}}>Common Questions</p>
        <h2 style={{fontSize:"clamp(22px,2.8vw,32px)",fontWeight:800,color:T.navyDk,letterSpacing:"-0.02em",marginBottom:28,fontFamily:T.fontSans}}>Everything about CBM & freight</h2>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {items.map((item,i)=>(
            <div key={i} style={{borderRadius:13,border:`1.5px solid ${open===i?T.navy:T.border}`,background:open===i?T.navyLt:T.card,overflow:"hidden",transition:"border-color .2s,background .2s"}}>
              <button onClick={()=>setOpen(open===i?null:i)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"17px 20px",background:"none",border:"none",cursor:"pointer",textAlign:"left",gap:12}}>
                <span style={{fontSize:14,fontWeight:600,color:open===i?T.navy:T.text,fontFamily:T.fontSans,lineHeight:1.5}}>{item.q}</span>
                <ChevronDown style={{width:16,height:16,color:open===i?T.navy:T.textDim,flexShrink:0,marginTop:2,transform:open===i?"rotate(180deg)":"none",transition:"transform .25s"}}/>
              </button>
              <div className={open===i?"acc-body open":"acc-body"}>
                <div className="acc-inner">
                  <div style={{borderTop:`1px solid ${T.border}`,padding:"0 20px 17px"}}>
                    <p style={{fontSize:13.5,color:T.textMid,lineHeight:1.85,fontFamily:T.fontSans,marginTop:13}}>{item.a}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════
   PAGE ROOT
═══════════════════════════════════════ */
export default function CBMPage() {
  return (
    <div style={{fontFamily:T.fontSans,color:T.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        input:focus,select:focus{border-color:${T.navy}!important;box-shadow:0 0 0 3px ${T.navyLt}!important;outline:none;}
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
        a:hover{opacity:0.88;}
        .acc-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows 0.28s ease,opacity 0.28s ease;opacity:0;}
        .acc-body.open{grid-template-rows:1fr;opacity:1;}
        .acc-inner{overflow:hidden;}
        @media(max-width:900px){
          .hero-grid,.cta-grid{grid-template-columns:1fr!important;}
          .hero-visual{display:none;}
          .three-col{grid-template-columns:1fr!important;}
          .stats-strip{grid-template-columns:1fr 1fr!important;}
          .cbm-grid{grid-template-columns:1fr!important;}
          .cbm-sticky{position:static!important;}
          .footer-grid{grid-template-columns:1fr 1fr!important;}
          .nav-links,.nav-cta{display:none!important;}
        }
      `}</style>

      <Hero />

      {/* Calculator section */}
      <div style={{background:T.pageBg,padding:"56px 0 72px"}}>
        <div style={{maxWidth:1180,margin:"0 auto",padding:"0 24px",marginBottom:32}}>
          <p style={{fontSize:12,fontWeight:700,color:T.orange,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:T.fontSans,marginBottom:10}}>Live Calculator</p>
          <h2 style={{fontSize:"clamp(22px,2.8vw,32px)",fontWeight:800,color:T.navyDk,letterSpacing:"-0.02em",fontFamily:T.fontSans}}>Enter your cargo details below</h2>
          <p style={{fontSize:14,color:T.textMid,marginTop:8,fontFamily:T.fontSans}}>Add one or more package types. All results update in real time.</p>
        </div>
        <CBMCalculator />
      </div>

      <HowItWorks />
      <WhyMatters />
      <FAQSection />
    </div>
  );
}