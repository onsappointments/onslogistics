"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  ChevronDown, Info, ArrowRight, Copy, Check,
  Shield, TrendingUp, Clock, Users, AlertTriangle,
  Ship, Plane, ShieldCheck, Zap, BadgeCheck, FileText,
  Calculator, Globe, CheckCircle, Percent, Package,
  BarChart3, BookOpen
} from "lucide-react";

/* ═══════════════════════════════════════════
   DESIGN TOKENS — shared with CBM page
═══════════════════════════════════════════ */
const T = {
  pageBg:   "#f0f4fa",
  card:     "#ffffff",
  cardAlt:  "#f8fafd",
  border:   "#dde4f0",
  navy:     "#1a3560",
  navyDk:   "#0f2040",
  navyMd:   "#243d72",
  navyLt:   "#e8eef8",
  orange:   "#e07b10",
  orangeLt: "#fff4e6",
  orangeBr: "#f59a3a",
  blue:     "#2563eb",
  blueLt:   "#eff6ff",
  green:    "#16a34a",
  greenLt:  "#f0fdf4",
  red:      "#dc2626",
  redLt:    "#fef2f2",
  amber:    "#d97706",
  amberLt:  "#fffbeb",
  purple:   "#7c3aed",
  teal:     "#0d9488",
  text:     "#0f1e35",
  textMid:  "#4a5f7a",
  textDim:  "#8898b2",
  textFnt:  "#b8c8dc",
  fontSans: "'Plus Jakarta Sans', sans-serif",
  fontMono: "'Fira Code', monospace",
  radius:   16,
  radiusSm: 10,
  shadow:   "0 1px 4px rgba(15,32,64,0.07), 0 4px 16px rgba(15,32,64,0.05)",
  shadowMd: "0 4px 24px rgba(15,32,64,0.12)",
};

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const LAST_UPDATED = "May 21, 2026";

const CURRENCIES = [
  { code: "USD", label: "USD ($)",    symbol: "$",   rate: 96.26  },
  { code: "EUR", label: "EUR (€)",    symbol: "€",   rate: 112.32 },
  { code: "GBP", label: "GBP (£)",    symbol: "£",   rate: 130.10 },
  { code: "JPY", label: "JPY (¥)",    symbol: "¥",   rate: 0.61   },
  { code: "AED", label: "AED (د.إ)", symbol: "د.إ", rate: 25.17  },
  { code: "CNY", label: "CNY (¥)",    symbol: "¥",   rate: 14.15  },
  { code: "INR", label: "INR (₹)",    symbol: "₹",   rate: 1      },
];

const FTA_COUNTRIES = {
  none:  { label: "No FTA / Standard Rate" },
  asean: { label: "ASEAN" },
  japan: { label: "Japan CEPA" },
  korea: { label: "South Korea CEPA" },
  uae:   { label: "UAE CEPA" },
};

const PRODUCTS = [
  { id:"mobile",     label:"Mobile Phones & Smartphones",   hs:"8517.12.00", bcd:20, igst:18, aidc:0,   cess:0,  swsExempt:false, antiDumpingRisk:false, ftaRates:{asean:20,japan:20,korea:20,uae:20},   confidence:"High",     note:"BCD of 20% applies uniformly; no FTA concessions available for most origins." },
  { id:"laptop",     label:"Laptops & Computers",           hs:"8471.30.10", bcd:0,  igst:18, aidc:0,   cess:0,  swsExempt:true,  antiDumpingRisk:false, ftaRates:{asean:0,japan:0,korea:0,uae:0},       confidence:"Very High", note:"BCD nil under WTO ITA. IGST @ 18% still applies on assessable value." },
  { id:"electronics",label:"Electronic Components & PCBs",  hs:"8534/8541",  bcd:10, igst:18, aidc:0,   cess:0,  swsExempt:false, antiDumpingRisk:false, ftaRates:{asean:7.5,japan:5,korea:5,uae:10},    confidence:"High",     note:"Exact BCD varies by sub-heading. Verify HS at ICEGATE before filing." },
  { id:"solar",      label:"Solar Panels & Modules",        hs:"8541.43.00", bcd:40, igst:12, aidc:0,   cess:0,  swsExempt:false, antiDumpingRisk:true,  ftaRates:{asean:40,japan:40,korea:40,uae:40},   confidence:"Medium",   note:"Anti-dumping and safeguard duties apply in addition to BCD. Verify before ordering." },
  { id:"auto-parts", label:"Automobile Parts",              hs:"8708",       bcd:15, igst:28, aidc:0,   cess:15, swsExempt:false, antiDumpingRisk:false, ftaRates:{asean:10,japan:10,korea:5,uae:15},    confidence:"Medium",   note:"Cess of 15% applies on assessable value. Premium/luxury parts may attract more." },
  { id:"gold",       label:"Gold & Precious Metals",        hs:"7108.12.00", bcd:15, igst:3,  aidc:2.5, cess:0,  swsExempt:false, antiDumpingRisk:false, ftaRates:{asean:15,japan:15,korea:15,uae:14},   confidence:"Medium",   note:"Gold duty is Budget-sensitive and changes frequently. Always verify with CBIC." },
];

const FAQS = [
  { q:"What is the customs duty on importing mobile phones into India?",   a:"Mobile phones (HS 8517.12) attract BCD of 20% on CIF value, plus 10% Social Welfare Surcharge on BCD, and 18% IGST on total assessable value. The effective total duty works out to approximately 42–44% on CIF. There are currently no FTA concessions from major origins." },
  { q:"How do I calculate import duty on laptops in India?",               a:"Laptops (HS 8471) attract nil BCD under India's WTO ITA commitments. However, 18% IGST applies on the assessable value. Effective duty is around 18–20% inclusive of handling. Note: BCD exemptions are subject to annual budget notifications." },
  { q:"What is IGST on imports and is it refundable?",                     a:"IGST (Integrated GST) is levied on all imports at the rate applicable to domestic supply of the same goods. GST-registered importers can claim IGST paid at customs as full Input Tax Credit (ITC), making it a cash-flow cost rather than a final expense." },
  { q:"Which countries have FTA agreements with India?",                   a:"India has active FTAs and CEPAs with ASEAN nations, Japan, South Korea, UAE, Mauritius, Australia, and Sri Lanka. Reduced or nil BCD rates apply, subject to Rules of Origin compliance and a valid Certificate of Origin from the exporting country." },
  { q:"What is CIF value and how is it different from FOB?",               a:"CIF (Cost, Insurance, Freight) is the landed value at the Indian port — including cost of goods, insurance, and international freight. Indian Customs uses CIF as the basis for duty calculation. If you only have the FOB value, add actual freight + insurance (typically 1.5–3% for sea cargo)." },
  { q:"Does import duty apply under the EPCG scheme?",                    a:"Under EPCG, capital goods can be imported at 0% BCD subject to an export obligation of 6× the duty saved within 6 years. The scheme is administered by DGFT and requires a pre-import EPCG licence. IGST exemption under EPCG requires separate notification." },
];

/* ═══════════════════════════════════════════
   ENGINE
═══════════════════════════════════════════ */
function fmt(n) { return new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(Math.round(n)); }
function pct(n) { return n.toFixed(2)+"%"; }

function estimateHandling({cifINR,shipmentType,containerType}) {
  let p=0.015;
  if(shipmentType==="air") p+=0.01;
  if(containerType==="lcl") p+=0.0075;
  return cifINR*p;
}

function calculate({product,cifValue,currency,ftaKey,shipmentType,containerType,includeHandling}) {
  const curr=CURRENCIES.find(c=>c.code===currency);
  const cifINR=cifValue*curr.rate;
  let eBCD=product.bcd;
  if(ftaKey!=="none"&&product.ftaRates?.[ftaKey]!==undefined) eBCD=product.ftaRates[ftaKey];
  const bcd   =(cifINR*eBCD)/100;
  const aidc  =(cifINR*product.aidc)/100;
  const sws   =product.swsExempt?0:(bcd+aidc)*0.1;
  const av    =cifINR+bcd+aidc+sws;
  const igst  =(av*product.igst)/100;
  const cess  =(av*product.cess)/100;
  const hdl   =includeHandling?estimateHandling({cifINR,shipmentType,containerType}):0;
  const add   =product.antiDumpingRisk?cifINR*0.05:0;
  const duty  =bcd+aidc+sws+igst+cess;
  const landed=cifINR+duty+hdl+add;
  const effR  =cifINR>0?(duty/cifINR)*100:0;
  const acc   =product.confidence==="Medium"||product.antiDumpingRisk?"Medium":"High";
  return {cifINR,eBCD,bcd,aidc,sws,av,igst,cess,hdl,add,duty,landed,effR,acc};
}

/* ═══════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════ */
function useCountUp(target,ms=500) {
  const [val,setVal]=useState(target);
  const frame=useRef(null),from=useRef(target);
  useEffect(()=>{
    const start=from.current,t0=performance.now();
    const tick=now=>{const p=Math.min((now-t0)/ms,1),e=1-Math.pow(1-p,3);setVal(Math.round(start+(target-start)*e));if(p<1)frame.current=requestAnimationFrame(tick);else from.current=target;};
    frame.current=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(frame.current);
  },[target]);
  return val;
}

/* ═══════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════ */
function AnimRupees({amount}){const v=useCountUp(Math.round(amount));return <>₹{fmt(v)}</>;}
function AnimPct({value}){const v=useCountUp(Math.round(value*100));return <>{(v/100).toFixed(2)}%</>;}

function Toggle({checked,onChange}){
  return(
    <button role="switch" aria-checked={checked} onClick={onChange}
      style={{width:46,height:26,borderRadius:99,background:checked?T.orange:T.border,border:"none",cursor:"pointer",position:"relative",transition:"background 0.22s",flexShrink:0,outline:"none",boxShadow:checked?`0 0 0 3px ${T.orangeLt}`:"none"}}>
      <div style={{position:"absolute",top:3,left:checked?23:3,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.22s cubic-bezier(.4,0,.2,1)",boxShadow:"0 1px 4px rgba(0,0,0,0.18)"}}/>
    </button>
  );
}

function Field({label,value,onChange,children}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      <label style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:T.textDim,fontFamily:T.fontSans}}>{label}</label>
      <div style={{position:"relative"}}>
        <select value={value} onChange={e=>onChange(e.target.value)}
          style={{width:"100%",appearance:"none",background:T.card,border:`1.5px solid ${T.border}`,borderRadius:T.radiusSm,padding:"11px 38px 11px 14px",fontSize:14,color:T.text,outline:"none",cursor:"pointer",fontFamily:T.fontSans,transition:"border-color 0.18s"}}>
          {children}
        </select>
        <ChevronDown style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",width:16,height:16,color:T.textDim,pointerEvents:"none"}}/>
      </div>
    </div>
  );
}

function Step({n,title}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
      <div style={{width:28,height:28,borderRadius:"50%",background:T.navy,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <span style={{fontSize:12,fontWeight:700,color:"#fff",fontFamily:T.fontSans}}>{n}</span>
      </div>
      <h2 style={{fontSize:15,fontWeight:700,color:T.navyDk,fontFamily:T.fontSans}}>{title}</h2>
    </div>
  );
}

function Card({children,style={}}){
  return(
    <div style={{background:T.card,border:`1.5px solid ${T.border}`,borderRadius:T.radius,padding:24,marginBottom:16,boxShadow:T.shadow,...style}}>
      {children}
    </div>
  );
}

function DutyBar({result}){
  const segs=[
    {key:"BCD", val:result.bcd,  color:T.navy},
    {key:"SWS", val:result.sws,  color:"#5b7ab8"},
    {key:"IGST",val:result.igst, color:T.orange},
    ...(result.cess>0?[{key:"Cess",val:result.cess,color:T.red}]:[]),
    ...(result.aidc>0?[{key:"AIDC",val:result.aidc,color:T.purple}]:[]),
  ].filter(s=>s.val>0);
  const total=segs.reduce((s,x)=>s+x.val,0);
  if(!total) return null;
  return(
    <div style={{marginTop:20}}>
      <p style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:T.textDim,marginBottom:9,fontFamily:T.fontSans}}>Duty composition</p>
      <div style={{display:"flex",height:8,borderRadius:99,overflow:"hidden",gap:2}}>
        {segs.map((s,i)=>(
          <div key={s.key} title={`${s.key}: ₹${fmt(s.val)}`}
            style={{flex:s.val/total,background:s.color,borderRadius:i===0?"99px 0 0 99px":i===segs.length-1?"0 99px 99px 0":0,transition:"flex 0.5s cubic-bezier(.4,0,.2,1)"}}/>
        ))}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:"5px 16px",marginTop:9}}>
        {segs.map(s=>(
          <div key={s.key} style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:8,height:8,borderRadius:2,background:s.color}}/>
            <span style={{fontSize:11,color:T.textMid,fontFamily:T.fontSans}}>
              {s.key} <span style={{color:T.text,fontFamily:T.fontMono,fontWeight:600}}>{((s.val/total)*100).toFixed(1)}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({label,sub,value,dim=false}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:dim?"none":`1px solid ${T.border}`}}>
      <div>
        <p style={{fontSize:13,color:dim?T.textFnt:T.textMid,fontFamily:T.fontSans}}>{label}</p>
        {sub&&<p style={{fontSize:11,color:T.textFnt,marginTop:1,fontFamily:T.fontSans}}>{sub}</p>}
      </div>
      <span style={{fontSize:13,fontWeight:700,color:dim?T.textFnt:T.text,fontFamily:T.fontMono}}>{value}</span>
    </div>
  );
}

function Faq({q,a,open,onToggle}){
  return(
    <div style={{borderRadius:12,border:`1.5px solid ${open?T.navy:T.border}`,background:open?T.navyLt:T.card,overflow:"hidden",transition:"border-color .2s,background .2s"}}>
      <button onClick={onToggle} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"17px 20px",background:"none",border:"none",cursor:"pointer",textAlign:"left",gap:12}}>
        <span style={{fontSize:14,fontWeight:600,color:open?T.navy:T.text,fontFamily:T.fontSans,lineHeight:1.5}}>{q}</span>
        <ChevronDown style={{width:16,height:16,color:open?T.navy:T.textDim,flexShrink:0,marginTop:2,transform:open?"rotate(180deg)":"none",transition:"transform .25s"}}/>
      </button>
      <div className={open?"acc-body open":"acc-body"}>
        <div className="acc-inner">
          <div style={{borderTop:`1px solid ${T.border}`,padding:"0 20px 17px"}}>
            <p style={{fontSize:13,color:T.textMid,lineHeight:1.85,fontFamily:T.fontSans,marginTop:13}}>{a}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HERO  —  same layout as CBM hero
═══════════════════════════════════════════ */
function Hero() {
  const stats = [
    { icon:<Package style={{width:15,height:15}}/>,   label:"6 Product Classes",  sub:"HS-code mapped" },
    { icon:<Globe style={{width:15,height:15}}/>,      label:"7 Currencies",       sub:"Live FX rates" },
    { icon:<BookOpen style={{width:15,height:15}}/>,   label:"5 FTA Agreements",   sub:"ASEAN · JP · KR · UAE" },
    { icon:<Zap style={{width:15,height:15}}/>,        label:"Real-time Results",  sub:"Instant calculation" },
  ];

  /* Preview card values — static illustrative */
  const preview = [
    { label:"BCD",           value:"20.00%",    sub:"basic customs duty",  color:T.orangeBr },
    { label:"IGST",          value:"18.00%",    sub:"on assessable value", color:"#7dd3fc"  },
    { label:"Effective Rate",value:"42.85%",    sub:"on CIF value",        color:"#86efac"  },
    { label:"Landed Cost",   value:"₹9,62,600", sub:"per USD 10,000 CIF",  color:"#c4b5fd"  },
  ];

  return (
    <div style={{
      background:`linear-gradient(90deg,rgba(30,58,138,0.92) 0%,rgba(30,58,138,0.65) 50%,rgba(30,58,138,0.28) 100%),url('/duty-hero.png')`,
      backgroundSize:"cover", backgroundPosition:"center", backgroundRepeat:"no-repeat",
      position:"relative", overflow:"hidden",
    }}>
      {/* Grid pattern */}
       <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)`,backgroundSize:"48px 48px",pointerEvents:"none",opacity:0.5}}/>
      {/* Right fade */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,rgba(30,58,138,0.15),rgba(30,58,138,0.55))",pointerEvents:"none"}}/>
      {/* Glow */}
      <div style={{position:"absolute",top:"-20%",right:"10%",width:500,height:500,borderRadius:"50%",background:"rgba(240,123,16,0.10)",filter:"blur(90px)",pointerEvents:"none"}}/>
      <div style={{maxWidth:1180,margin:"0 auto",padding:"72px 24px 56px",position:"relative",zIndex:2}}>
        {/* Badge */}
        <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(245,154,58,0.18)",border:"1px solid rgba(245,154,58,0.35)",borderRadius:99,padding:"6px 16px",fontSize:12,color:T.orangeBr,fontWeight:700,marginBottom:22,letterSpacing:"0.05em",backdropFilter:"blur(8px)"}}>
          <Calculator style={{width:13,height:13}}/>India Import Duty Calculator · FY 2025–26
        </div>

        {/* 2-column grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center"}} className="hero-grid">
          {/* Left: headline + CTAs */}
          <div>
            <h1 style={{fontSize:"clamp(28px,4vw,50px)",fontWeight:800,color:"#fff",lineHeight:1.08,letterSpacing:"-0.04em",marginBottom:18}}>
              Know your customs<br/>duty <span style={{color:T.orangeBr}}>before your<br/>shipment arrives.</span>
            </h1>
            <p style={{fontSize:16,color:"rgba(255,255,255,0.68)",lineHeight:1.8,marginBottom:30,maxWidth:480}}>
              Estimate BCD, SWS, IGST, AIDC, compensation cess, and total landed cost for goods imported into India — with FTA concessions and live exchange rates.
            </p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <a href="#calculator" style={{display:"inline-flex",alignItems:"center",gap:8,background:T.blue,color:"#fff",borderRadius:11,padding:"13px 26px",fontSize:14,fontWeight:700,textDecoration:"none",fontFamily:T.fontSans,boxShadow:"0 4px 20px rgba(16, 155, 224, 0.4)"}}>
                <Calculator style={{width:16,height:16}}/>Calculate Now
              </a>
              <a href="/contact" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.18)",color:"#fff",borderRadius:11,padding:"13px 26px",fontSize:14,fontWeight:700,textDecoration:"none",fontFamily:T.fontSans,backdropFilter:"blur(10px)"}}>
                Talk to a CHA Expert
              </a>
            </div>
          </div>

          {/* Right: glassmorphism preview card */}
          <div className="hero-visual" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:28,backdropFilter:"blur(8px)"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {preview.map(x=>(
                <div key={x.label} style={{background:"rgba(255,255,255,0.06)",borderRadius:12,padding:"14px 16px",border:"1px solid rgba(255,255,255,0.08)"}}>
                  <p style={{fontSize:10,color:"rgba(255,255,255,0.45)",fontFamily:T.fontSans,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{x.label}</p>
                  <p style={{fontSize:22,fontWeight:800,color:x.color,fontFamily:T.fontMono,letterSpacing:"-0.03em"}}>{x.value}</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",fontFamily:T.fontSans,marginTop:4}}>{x.sub}</p>
                </div>
              ))}
            </div>
            {/* Caution strip */}
            <div style={{marginTop:12,background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
              <CheckCircle style={{width:14,height:14,color:T.green,flexShrink:0}}/>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.55)",fontFamily:T.fontSans}}>For mobile phones · No FTA concessions apply · CBIC FY2025–26</span>
            </div>
            <div style={{marginTop:8,background:"rgba(245,154,58,0.08)",borderRadius:10,padding:"9px 14px",display:"flex",alignItems:"center",gap:8,border:"1px solid rgba(245,154,58,0.2)"}}>
              <AlertTriangle style={{width:13,height:13,color:T.orangeBr,flexShrink:0}}/>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontFamily:T.fontSans}}>Rates are estimates. Verify exact duty with ICEGATE before filing.</span>
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

/* ═══════════════════════════════════════════
   MAIN CALCULATOR
═══════════════════════════════════════════ */
export default function ImportDutyCalculator() {
  const [productId,        setProductId]        = useState("mobile");
  const [cifValue,         setCifValue]         = useState(10000);
  const [currency,         setCurrency]         = useState("USD");
  const [ftaKey,           setFtaKey]           = useState("none");
  const [shipmentType,     setShipmentType]     = useState("sea");
  const [containerType,    setContainerType]    = useState("fcl");
  const [includeHandling,  setIncludeHandling]  = useState(true);
  const [copied,           setCopied]           = useState(false);
  const [openFaq,          setOpenFaq]          = useState(null);

  const product = PRODUCTS.find(p=>p.id===productId);
  const currObj = CURRENCIES.find(c=>c.code===currency);
  const altMode = shipmentType==="sea"?"air":"sea";

  const result    = useMemo(()=>calculate({product,cifValue,currency,ftaKey,shipmentType,containerType,includeHandling}),[product,cifValue,currency,ftaKey,shipmentType,containerType,includeHandling]);
  const altResult = useMemo(()=>calculate({product,cifValue,currency,ftaKey,shipmentType:altMode,containerType,includeHandling}),[product,cifValue,currency,ftaKey,altMode,containerType,includeHandling]);

  const handleCopy=()=>{
    const lines=["Customs Duty Estimate — FY2025-26","Powered by ONS Logistics","",`Product : ${product.label}`,`HS Code : ${product.hs}`,`CIF     : ₹${fmt(result.cifINR)}`,``,`BCD (${pct(result.eBCD)})      : ₹${fmt(result.bcd)}`,`SWS (10% of BCD) : ₹${fmt(result.sws)}`,`IGST (${pct(product.igst)})   : ₹${fmt(result.igst)}`,result.cess>0?`Cess             : ₹${fmt(result.cess)}`:null,result.hdl>0?`Handling         : ₹${fmt(result.hdl)}`:null,``,`Total Duty     : ₹${fmt(result.duty)}`,`Effective Rate : ${pct(result.effR)}`,`Total Landed   : ₹${fmt(result.landed)}`].filter(l=>l!==null).join("\n");
    navigator.clipboard.writeText(lines).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});
  };

  return (
    <div style={{minHeight:"100vh",background:T.pageBg,fontFamily:T.fontSans,color:T.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        select:focus,input:focus{border-color:${T.navy}!important;box-shadow:0 0 0 3px ${T.navyLt}!important;outline:none;}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
        .acc-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows 0.28s ease,opacity 0.28s ease;opacity:0;}
        .acc-body.open{grid-template-rows:1fr;opacity:1;}
        .acc-inner{overflow:hidden;}
        a{text-decoration:none;}
        a:hover{opacity:0.88;}
        @media(max-width:900px){
          .hero-grid{grid-template-columns:1fr!important;}
          .hero-visual{display:none!important;}
          .stats-strip{grid-template-columns:1fr 1fr!important;}
          #main-grid{grid-template-columns:1fr!important;}
          #sticky-col{position:static!important;}
        }
      `}</style>

      <Hero/>

      {/* Calculator */}
      <div id="calculator" style={{maxWidth:1180,margin:"0 auto",padding:"40px 24px 72px"}}>
        <div style={{marginBottom:28}}>
          <p style={{fontSize:12,fontWeight:700,color:T.orange,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:T.fontSans,marginBottom:8}}>Live Calculator</p>
          <h2 style={{fontSize:"clamp(20px,2.5vw,28px)",fontWeight:800,color:T.navyDk,letterSpacing:"-0.02em",fontFamily:T.fontSans}}>Enter your shipment details below</h2>
          <p style={{fontSize:14,color:T.textMid,marginTop:6,fontFamily:T.fontSans}}>All results update in real time as you type.</p>
        </div>

        <div id="main-grid" style={{display:"grid",gridTemplateColumns:"1fr 420px",gap:24,alignItems:"start"}}>
          {/* LEFT */}
          <div>
            <Card>
              <Step n="1" title="Product & Classification"/>
              <Field label="Product Category" value={productId} onChange={setProductId}>
                {PRODUCTS.map(p=><option key={p.id} value={p.id}>{p.label} — HS {p.hs}</option>)}
              </Field>
              <div style={{display:"flex",gap:10,background:T.blueLt,border:`1.5px solid #bfdbfe`,borderRadius:10,padding:"11px 14px",marginTop:14}}>
                <Info style={{width:15,height:15,color:T.blue,flexShrink:0,marginTop:1}}/>
                <p style={{fontSize:12.5,color:"#1e40af",lineHeight:1.65,fontFamily:T.fontSans}}>{product.note}</p>
              </div>
            </Card>

            <Card>
              <Step n="2" title="Commercial Value"/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 160px",gap:14}}>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <label style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:T.textDim,fontFamily:T.fontSans}}>CIF Value</label>
                  <input type="number" min={0} value={cifValue} onChange={e=>setCifValue(Math.max(0,Number(e.target.value)))}
                    style={{width:"100%",background:T.card,border:`1.5px solid ${T.border}`,borderRadius:T.radiusSm,padding:"11px 14px",fontSize:15,color:T.text,fontFamily:T.fontMono,fontWeight:600,transition:"border-color 0.18s",outline:"none"}}/>
                </div>
                <Field label="Currency" value={currency} onChange={setCurrency}>
                  {CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.label}</option>)}
                </Field>
              </div>
              {currency!=="INR"&&cifValue>0&&(
                <div style={{marginTop:10,display:"flex",alignItems:"center",gap:6,padding:"7px 12px",background:T.cardAlt,borderRadius:8,border:`1px solid ${T.border}`}}>
                  <TrendingUp style={{width:13,height:13,color:T.orange}}/>
                  <p style={{fontSize:12,color:T.textMid,fontFamily:T.fontSans}}>
                    ≈ <strong style={{color:T.text,fontFamily:T.fontMono}}>₹{fmt(cifValue*currObj.rate)}</strong>
                    <span style={{color:T.textDim}}> · indicative rate as of {LAST_UPDATED}</span>
                  </p>
                </div>
              )}
            </Card>

            <Card>
              <Step n="3" title="Shipment Variables"/>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <Field label="Trade Agreement (FTA)" value={ftaKey} onChange={setFtaKey}>
                  {Object.entries(FTA_COUNTRIES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                </Field>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <Field label="Freight Mode" value={shipmentType} onChange={setShipmentType}>
                    <option value="sea">Sea Freight</option>
                    <option value="air">Air Freight</option>
                  </Field>
                  <Field label="Container" value={containerType} onChange={setContainerType}>
                    <option value="fcl">FCL (Full)</option>
                    <option value="lcl">LCL (Shared)</option>
                  </Field>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:T.cardAlt,border:`1.5px solid ${T.border}`,borderRadius:T.radiusSm,padding:"13px 16px"}}>
                  <div>
                    <p style={{fontSize:14,fontWeight:600,color:T.text,fontFamily:T.fontSans,marginBottom:3}}>Include Port & Handling Charges</p>
                    <p style={{fontSize:11,color:T.textDim,fontFamily:T.fontSans}}>Adds ~1.5–2.5% to total landed cost</p>
                  </div>
                  <Toggle checked={includeHandling} onChange={()=>setIncludeHandling(v=>!v)}/>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT — sticky */}
          <div id="sticky-col" style={{position:"sticky",top:24}}>
            <div style={{background:T.card,borderRadius:T.radius,boxShadow:T.shadowMd,overflow:"hidden",marginBottom:16,border:`1.5px solid ${T.border}`}}>
              <div style={{height:4,background:`linear-gradient(90deg,${T.navy},${T.orange})`}}/>
              <div style={{padding:22}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
                  <div>
                    <p style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:"0.09em",textTransform:"uppercase",fontFamily:T.fontSans}}>Estimate Details</p>
                    <span style={{fontSize:11,color:T.textDim,fontFamily:T.fontMono,marginTop:3,display:"block"}}>HS {product.hs}</span>
                  </div>
                  <button onClick={handleCopy} style={{display:"flex",alignItems:"center",gap:6,background:copied?T.greenLt:T.cardAlt,border:`1.5px solid ${copied?"#bbf7d0":T.border}`,borderRadius:9,padding:"7px 12px",color:copied?T.green:T.textMid,fontSize:12,cursor:"pointer",fontFamily:T.fontSans,fontWeight:600,transition:"all .2s"}}>
                    {copied?<Check style={{width:13,height:13}}/>:<FileText style={{width:13,height:13}}/>}{copied?"Copied!":"Export"}
                  </button>
                </div>

                <div>
                  <Row label="CIF Value"                value={`₹${fmt(result.cifINR)}`}/>
                  <Row label="Basic Customs Duty"       sub={`@ ${pct(result.eBCD)}`}           value={`₹${fmt(result.bcd)}`}/>
                  {result.aidc>0&&<Row label="AIDC"     value={`₹${fmt(result.aidc)}`}/>}
                  <Row label="Social Welfare Surcharge" sub="10% of BCD"                         value={`₹${fmt(result.sws)}`}/>
                  <Row label="IGST"                     sub={`@ ${pct(product.igst)}`}           value={`₹${fmt(result.igst)}`}/>
                  {result.cess>0&&<Row label="Compensation Cess"                                  value={`₹${fmt(result.cess)}`}/>}
                  {result.hdl >0&&<Row label="Port & Handling"                                    value={`₹${fmt(result.hdl)}`}/>}
                  {result.add >0&&<Row label="Estimated ADD Risk" sub="Potential anti-dumping"   value={`₹${fmt(result.add)}`}/>}
                </div>

                {/* Total */}
                <div style={{background:`linear-gradient(135deg,${T.navyDk},${T.navy})`,borderRadius:13,padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
                  <div>
                    <p style={{fontSize:10,color:"rgba(255,255,255,0.55)",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:T.fontSans}}>Total Duty Payable</p>
                    <p style={{fontSize:26,fontWeight:800,color:"#fff",fontFamily:T.fontMono,marginTop:5,letterSpacing:"-0.03em"}}>
                      <AnimRupees amount={result.duty}/>
                    </p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <p style={{fontSize:10,color:"rgba(255,255,255,0.45)",fontFamily:T.fontSans,marginBottom:5}}>Effective rate</p>
                    <p style={{fontSize:22,fontWeight:700,color:T.orangeBr,fontFamily:T.fontMono}}>
                      <AnimPct value={result.effR}/>
                    </p>
                  </div>
                </div>

                <DutyBar result={result}/>

                {/* Metric tiles */}
                <div style={{display:"flex",gap:11,marginTop:18}}>
                  <div style={{flex:1,background:T.cardAlt,border:`1.5px solid ${T.border}`,borderRadius:12,padding:14,textAlign:"center"}}>
                    <p style={{fontSize:10,color:T.textDim,fontFamily:T.fontSans,marginBottom:6,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase"}}>Landed Cost</p>
                    <p style={{fontSize:14,fontWeight:700,color:T.text,fontFamily:T.fontMono}}><AnimRupees amount={result.landed}/></p>
                    <p style={{fontSize:10,color:T.textFnt,fontFamily:T.fontSans,marginTop:4}}>{includeHandling?"Incl. handling":"Excl. handling"}</p>
                  </div>
                  <div style={{flex:1,background:result.acc==="High"?T.greenLt:T.amberLt,border:`1.5px solid ${result.acc==="High"?"#bbf7d0":"#fde68a"}`,borderRadius:12,padding:14,textAlign:"center"}}>
                    <p style={{fontSize:10,color:T.textDim,fontFamily:T.fontSans,marginBottom:6,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase"}}>Accuracy</p>
                    <p style={{fontSize:14,fontWeight:700,color:result.acc==="High"?T.green:T.amber,fontFamily:T.fontMono}}>{result.acc}</p>
                  </div>
                </div>

                {/* Scenario */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:T.cardAlt,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"11px 15px",marginTop:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {altMode==="air"?<Plane style={{width:14,height:14,color:T.textDim}}/>:<Ship style={{width:14,height:14,color:T.textDim}}/>}
                    <span style={{fontSize:12,color:T.textMid,fontFamily:T.fontSans}}>
                      If shipped by <span style={{fontWeight:600,color:T.text,textTransform:"capitalize"}}>{altMode}</span>:
                    </span>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:T.text,fontFamily:T.fontMono}}>₹{fmt(altResult.landed)}</span>
                </div>
              </div>
            </div>

            {result.add>0&&(
              <div style={{background:T.redLt,border:`1.5px solid #fca5a5`,borderRadius:13,padding:"12px 16px",marginBottom:16,display:"flex",gap:10,alignItems:"flex-start"}}>
                <AlertTriangle style={{width:16,height:16,color:T.red,flexShrink:0,marginTop:1}}/>
                <p style={{fontSize:12.5,color:"#991b1b",lineHeight:1.65,fontFamily:T.fontSans}}>
                  <strong>Anti-dumping risk detected.</strong> Actual ADD can be substantially higher than the 5% estimate. Consult a CHA before placing the order.
                </p>
              </div>
            )}

            <div style={{background:T.card,border:`1.5px solid ${T.border}`,borderRadius:T.radius,padding:22,boxShadow:T.shadow}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:T.navyLt,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Shield style={{width:16,height:16,color:T.navy}}/>
                </div>
                <p style={{fontSize:14,fontWeight:700,color:T.navyDk,fontFamily:T.fontSans}}>Need accurate customs clearance?</p>
              </div>
              <p style={{fontSize:13,color:T.textMid,lineHeight:1.7,marginBottom:16,fontFamily:T.fontSans}}>
                Our licensed CHA experts handle documentation, clearance, and import compliance across all major Indian ports.
              </p>
              <a href="/contact" style={{display:"inline-flex",alignItems:"center",gap:8,background:T.navy,color:"#fff",borderRadius:10,padding:"12px 22px",fontSize:13,fontWeight:700,fontFamily:T.fontSans,boxShadow:"0 2px 8px rgba(15,32,64,0.25)"}}>
                Talk to an Expert <ArrowRight style={{width:15,height:15}}/>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{background:"#fff",padding:"56px 24px 72px"}}>
        <div style={{maxWidth:760,margin:"0 auto"}}>
          <p style={{fontSize:11,fontWeight:700,color:T.orange,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:T.fontSans,marginBottom:10}}>Common questions</p>
          <h2 style={{fontSize:"clamp(22px,2.8vw,30px)",fontWeight:800,color:T.navyDk,letterSpacing:"-0.02em",marginBottom:24,fontFamily:T.fontSans}}>Everything about India customs duty</h2>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {FAQS.map((item,i)=>(
              <Faq key={i} q={item.q} a={item.a} open={openFaq===i} onToggle={()=>setOpenFaq(openFaq===i?null:i)}/>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{maxWidth:760,margin:"0 auto 60px",padding:"0 24px"}}>
        <div style={{background:T.amberLt,border:`1.5px solid #fde68a`,borderRadius:13,padding:"14px 18px"}}>
          <p style={{fontSize:12,color:"#92400e",lineHeight:1.8,fontFamily:T.fontSans}}>
            <strong style={{color:"#78350f"}}>Legal Disclaimer:</strong> This calculator provides estimates based on standard duty rates as of FY2025–26. Actual duty may vary based on your specific HS code, CBIC notifications, exemption schemes (EPCG, Advance Authorisation, EOU), anti-dumping duties, safeguard duties, and customs valuation. Always consult a licensed Customs House Agent (CHA) or verify with ICEGATE before making commercial import decisions. ONS Logistics is not liable for errors arising from the use of this tool.
          </p>
        </div>
      </div>
    </div>
  );
}