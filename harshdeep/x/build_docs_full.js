const docx = require("docx");
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, TableOfContents,
  Header, Footer, PageNumber, LevelFormat } = docx;
const fs = require("fs");

const NAVY="1F2A44", BLUE="2E5AAC", TEAL="0E7C7B", ORANGE="C05621", GREY="5A6270", PLUM="7A2E5B";
const FONT="Calibri";
const run = (t,o)=>{o=o||{}; return new TextRun({text:t, font:FONT, size:o.size||21, color:o.color||"222222", bold:o.bold, italics:o.italics});};
const P = (text,opts)=>{opts=opts||{}; return new Paragraph({ spacing:{after:opts.after==null?120:opts.after, before:opts.before||0, line:276}, alignment:opts.align,
  children:(Array.isArray(text)?text:[run(text,opts)]) });};
const H1 = (t)=> new Paragraph({ heading:HeadingLevel.HEADING_1, spacing:{before:300,after:120}, children:[new TextRun({text:t,font:FONT,size:30,bold:true,color:NAVY})] });
const H2 = (t)=> new Paragraph({ heading:HeadingLevel.HEADING_2, spacing:{before:220,after:90}, children:[new TextRun({text:t,font:FONT,size:24,bold:true,color:BLUE})] });
const H3 = (t,color)=> new Paragraph({ heading:HeadingLevel.HEADING_3, spacing:{before:160,after:70}, children:[new TextRun({text:t,font:FONT,size:22,bold:true,color:color||TEAL})] });
const bullet = (t,level)=> new Paragraph({ numbering:{reference:"bl",level:level||0}, spacing:{after:70,line:270}, children:Array.isArray(t)?t:[run(t)] });
const spacer = (h)=> new Paragraph({spacing:{after:h||80}, children:[run("")]});

function cellPara(text,size){ const kids=Array.isArray(text)?text.map(function(x){return new TextRun(Object.assign({font:FONT,size:x.size||size||19},x));}):[new TextRun({text:String(text),font:FONT,size:size||19})]; return new Paragraph({spacing:{after:0,line:250},children:kids}); }
function table(colW, rows){
  const total=colW.reduce(function(a,b){return a+b;},0);
  return new Table({ columnWidths:colW, width:{size:total,type:WidthType.DXA},
    borders:{ top:{style:BorderStyle.SINGLE,size:2,color:"C9CED6"}, bottom:{style:BorderStyle.SINGLE,size:2,color:"C9CED6"}, left:{style:BorderStyle.SINGLE,size:2,color:"C9CED6"}, right:{style:BorderStyle.SINGLE,size:2,color:"C9CED6"}, insideHorizontal:{style:BorderStyle.SINGLE,size:2,color:"D9DEE5"}, insideVertical:{style:BorderStyle.SINGLE,size:2,color:"D9DEE5"} },
    rows: rows.map(function(r,i){ return new TableRow({ tableHeader:i===0, children: r.map(function(c,ci){
      const bg = i===0?NAVY:(c.bg||(i%2===0?"F7F9FC":undefined));
      const col = i===0?"FFFFFF":(c.color||"222222");
      return new TableCell({ width:{size:colW[ci],type:WidthType.DXA}, shading: bg?{type:ShadingType.CLEAR,fill:bg,color:"auto"}:undefined, margins:{top:55,bottom:55,left:90,right:90},
        children:[cellPara(Array.isArray(c.t)?c.t:[{text:String(c.t),bold:i===0?true:c.bold,color:col}], c.size)] }); }) }); }) });
}
function docShell(title, kids){
  return new Document({ creator:"Harshdeep Group", title:title, features:{updateFields:true},
    numbering:{config:[{reference:"bl", levels:[
      {level:0,format:LevelFormat.BULLET,text:"•",alignment:AlignmentType.LEFT,style:{run:{color:ORANGE},paragraph:{indent:{left:360,hanging:220}}}},
      {level:1,format:LevelFormat.BULLET,text:"–",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:220}}}}]}]},
    styles:{default:{document:{run:{font:FONT,size:21,color:"222222"}}}},
    sections:[{ properties:{page:{margin:{top:1080,bottom:1080,left:1200,right:1200}}},
      headers:{default:new Header({children:[new Paragraph({alignment:AlignmentType.RIGHT,spacing:{after:0},children:[new TextRun({text:title,font:FONT,size:15,color:"9AA1AC"})]})]})},
      footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"Confidential  ·  ",font:FONT,size:15,color:"9AA1AC"}),new TextRun({children:["Page ",PageNumber.CURRENT," of ",PageNumber.TOTAL_PAGES],font:FONT,size:15,color:"9AA1AC"})]})]})},
      children:kids }] });
}
function cover(bigTitle, sub, tagline, subtitle){
  return [
    new Paragraph({spacing:{before:1300,after:0},alignment:AlignmentType.CENTER,children:[new TextRun({text:"HARSHDEEP GROUP",font:FONT,size:52,bold:true,color:NAVY})]}),
    new Paragraph({spacing:{after:60},alignment:AlignmentType.CENTER,border:{bottom:{style:BorderStyle.SINGLE,size:10,color:ORANGE}},children:[new TextRun({text:"",font:FONT})]}),
    new Paragraph({spacing:{before:170,after:40},alignment:AlignmentType.CENTER,children:[new TextRun({text:bigTitle,font:FONT,size:34,bold:true,color:BLUE})]}),
    new Paragraph({spacing:{after:300},alignment:AlignmentType.CENTER,children:[new TextRun({text:sub,font:FONT,size:22,italics:true,color:GREY})]}),
    new Paragraph({spacing:{after:40},alignment:AlignmentType.CENTER,children:[new TextRun({text:"Aurra Hype   ·   Designomics India   ·   Loop In Events   ·   Arihant Digital",font:FONT,size:20,bold:true,color:NAVY})]}),
    new Paragraph({spacing:{after:520},alignment:AlignmentType.CENTER,children:[new TextRun({text:tagline,font:FONT,size:20,italics:true,color:TEAL})]}),
    new Paragraph({spacing:{after:16},alignment:AlignmentType.CENTER,children:[new TextRun({text:subtitle,font:FONT,size:20,color:"444444"})]}),
    new Paragraph({spacing:{after:16},alignment:AlignmentType.CENTER,children:[new TextRun({text:"Founder: Harshdeep  |  Bengaluru, India  |  July 2026",font:FONT,size:20,color:"444444"})]}),
    new Paragraph({children:[new PageBreak()]})
  ];
}

/* =======================================================================================
   DOC 1 — EXPANDED GROWTH STRATEGY (ADVANCED, 4 BRANDS)
======================================================================================= */
let c1=[];
c1 = c1.concat(cover("Growth & Scale Blueprint (Full / Advanced)","World-class services, the 2026 AI engine, and the execution map for four brands","Powered in-house by Arihant Digital","The advanced companion to the master operating workbook"));
c1.push(H1("Contents"));
c1.push(new TableOfContents("Contents",{hyperlink:true, headingStyleRange:"1-2"}));
c1.push(new Paragraph({children:[new PageBreak()]}));

c1.push(H1("1.  Executive Summary"));
c1.push(P("This is the deep version of the plan. It benchmarks what world-class D2C, gifting, events and agency businesses run globally in 2026, then maps that best-in-class stack onto four brands you control. The four are Aurra Hype (streetwear apparel), Designomics India (personalised gifting and merch), Loop In Events (experiential), and Arihant Digital — your roughly ten-year-old agency, treated here as the fourth brand and the in-house engine that builds and markets the other three at cost, then sells that proven capability to outside clients."));
c1.push(P([run("The operating principle is simple and powerful: "),run("build the machine once, point it at your own brands, and let the results become the sales pitch. ",{bold:true}),run("Everything below — the AI creative engine, the automation backbone, the chat funnels, the retention systems, the Founder Operating System — is chosen because leading brands already prove it works, and because you can deploy it in-house cheaper and faster than a competitor renting it from agencies.")]));
c1.push(P([run("Two naming issues are addressed up front: ",{}),run("Loop In Events shares its exact name and .com with an established Canadian planner (rebrand + trademark required), ",{bold:true}),run("and “Aurra/Aura” is crowded in Indian apparel (distinctive, trademarked identity required). Both are Month-1, non-negotiable.")]));
c1.push(P("Read this document for the why, the sequence and the workflows. Use the companion workbook (Harshdeep_Group_Master_Stack_FULL.xlsx, 13 tabs) to execute, and the Founder Operating System playbook to run it all day-to-day."));

c1.push(H1("2.  The Group Thesis — One AI-Native Flywheel"));
c1.push(P("Each asset lowers the cost or raises the value of the others, and AI compresses the whole loop:"));
c1.push(bullet([run("Arihant Digital",{bold:true}),run(" builds the stores, runs paid + organic, sets up analytics and builds every automation — for all three brands, at internal cost.")]));
c1.push(bullet([run("Designomics",{bold:true}),run(" supplies design, print, packaging and merch to itself, Aurra Hype and Loop In.")]));
c1.push(bullet([run("Aurra Hype and Loop In",{bold:true}),run(" generate revenue, customers and content — which become Arihant's case studies.")]));
c1.push(bullet([run("AI (creative + agents)",{bold:true}),run(" multiplies output per person, so four brands run on a small core team.")]));
c1.push(bullet([run("External clients",{bold:true}),run(" fund more capability, which compounds back into the brands. That is the flywheel.")]));
c1.push(P([run("The structural edge: ",{bold:true}),run("work outsiders pay 3–5x agency margin for is delivered to your brands at cost, and AI cuts production time by roughly 70%. That is what makes a four-brand build rational for one founder rather than reckless.")]));

c1.push(new Paragraph({children:[new PageBreak()]}));
c1.push(H1("3.  Business Deep-Dives (Advanced)"));

c1.push(H2("3.1  Aurra Hype — Streetwear / Hype Apparel"));
c1.push(P("Win condition: desirable product, a drop/scarcity rhythm, community, and disciplined performance marketing with healthy unit economics. Copy the global streetwear playbook — limited drops, waitlists and early access, a VIP community channel, and resale-worthy hype — while running an Indian D2C engine underneath."));
c1.push(H3("Advanced moves"));
c1.push(P("Beyond the basics (fast Shopify store, catalog + reels, always-on Meta): add a drop calendar with waitlists and early-access; profit analytics (Triple Whale) and creative analytics (Motion) so you scale only true winners; an AI creative pipeline (Higgsfield UGC ads plus Runway/Veo hero films) to produce ad volume cheaply; server-side tracking (Meta CAPI via Stape) for accuracy post-iOS; on-site personalization and upsell (Rebuy/Nosto) to lift AOV; a VIP community on WhatsApp/Telegram and later Discord; and marketplace expansion to Amazon, Flipkart, then Myntra/Ajio once D2C is profitable. RTO/COD control (GoKwik) protects margin from day one."));

c1.push(H2("3.2  Designomics India — Gifting, Merch & Corporate"));
c1.push(P("The most naturally profitable brand: two demand engines (impulse/occasion D2C and contract corporate gifting) plus premium pricing from a strong customization experience. It doubles as the group's in-house design, print and packaging arm."));
c1.push(H3("Advanced moves"));
c1.push(P("Replatform off Wix onto Shopify with a real gift-box configurator (Kickflip/Zakeke); build a corporate-gifting sales motion (outbound, catalogs, quote-to-order, bulk GST invoicing, a HubSpot pipeline); use AI product imagery (Midjourney/Krea/Photoroom) to generate endless SKU visuals without shoots; run occasion-based automation (birthdays, festivals, anniversaries) that converts one-time gifters into recurring revenue; expand to Meesho (volume), Amazon gifting and optionally Etsy; and productise the workshops (DTF/patch kits) as both events and content. A Blinkit/Zepto pilot comes last, only on high-margin fast-movers."));

c1.push(H2("3.3  Loop In Events — Experiential  ⚠  Rebrand First"));
c1.push(P([run("Loop In Events is your experiential arm and, internally, the team that runs Aurra Hype launches and Designomics corporate experiences. Before scaling: ",{}),run("“Loop In Events” and loopinevents.com already belong to an established Canadian planner (Michelle Munro). ",{bold:true}),run("You are building equity on a name and web identity you do not own.")]));
c1.push(H3("Rebrand + trademark (Month 1)",ORANGE));
c1.push(P("Choose a distinctive name; run the free IP India public search (wordmark + phonetic) across Class 41 (events/entertainment) and Class 35 (advertising/business); secure the matching .com/.in and social handles before announcing; then file the trademark via an IP attorney. Budget roughly ₹45,000–₹60,000 across the group's marks."));
c1.push(H3("Advanced moves",TEAL));
c1.push(P("A lead-gen site with portfolio and packages; local + LinkedIn lead-gen; a sales CRM and quote system; an event project/vendor-management system (Monday.com + Aisle Planner); filming every event as reels, case studies and testimonials; post-event feedback + testimonial + upsell automation; and eventually a signature owned event/IP (e.g. a streetwear-x-music night) that markets all four brands at once."));

c1.push(H2("3.4  Arihant Digital — The Engine, Productised"));
c1.push(P("Your unfair advantage and the fourth brand. It delivers web, performance, SEO/GEO, automation and analytics to the three brands at cost — and those brands become its portfolio. The strategic move is to productise: package clear offers (“AI-native growth”, “store build + launch”, “automation setup”, “AI creative studio”), lead with the AI differentiators (Higgsfield creative, n8n/MCP automation) that most agencies can't match, and convert the brand wins into case studies with real before/after numbers. Then sell — outbound, inbound and referral — to D2C brands that look like your own, moving clients onto monthly retainers for predictable MRR. This is how the group funds and compounds itself."));

c1.push(new Paragraph({children:[new PageBreak()]}));
c1.push(H1("4.  In-House Engine & Cross-Sell Flywheel"));
c1.push(table([2300,3350,3350],[
  [{t:"Asset"},{t:"Supplies to the group"},{t:"Consumes from the group"}],
  [{t:"Arihant Digital",bold:true,bg:"EAF0FB"},{t:"Web, performance + organic marketing, SEO/GEO, analytics, all automations & AI"},{t:"Real brands to showcase → external clients + MRR"}],
  [{t:"Designomics",bold:true,bg:"EDF6EA"},{t:"Branding, design, print, packaging, merch, gifting, workshops"},{t:"Digital marketing, web, automation from Arihant"}],
  [{t:"Aurra Hype",bold:true,bg:"FDEDE3"},{t:"Streetwear product, drops, youth-culture content & audience"},{t:"Web, ads, packaging, events, automation"}],
  [{t:"Loop In Events",bold:true,bg:"F1EAF6"},{t:"Live activations, launches, pop-ups, corporate experiences"},{t:"Branding, web, marketing, merch/gifting"}],
]));
c1.push(spacer());
c1.push(P([run("Cross-sell engine: ",{bold:true}),run("a corporate client who books Loop In is offered Designomics gifting and Arihant digital; a Designomics corporate buyer is a warm events lead; Aurra Hype's audience is content fuel for all four. One relationship, multiple revenue lines, dramatically lower blended CAC.")]));

c1.push(new Paragraph({children:[new PageBreak()]}));
c1.push(H1("5.  The Full Operating Stack, by Domain"));
c1.push(P("The complete online-and-offline map, upgraded with the advanced tools leading brands use. The workbook lists vendor, priority, phase and cost for every line; this is the orientation."));
const dom=[
 ["Brand & Identity","In-house (Designomics) + IP attorney","Naming architecture, per-brand identities, trademark search & filing, brand-voice system used in AI prompts."],
 ["Website & E-commerce","In-house (Arihant)","Shopify (Aurra + Designomics off Wix, with a gift-box configurator), Loop In lead-gen site, landing-page builder (Replo), personalization (Rebuy/Nosto), A/B testing (VWO), CDN."],
 ["Content & Creative","Hybrid","Photography, a reels engine, a design subscription, and video repurposing (Opus/Descript) turning one shoot into 20 clips."],
 ["AI & Creative","In-house","The 2026 AI engine — see Section 6."],
 ["Performance Marketing","In-house (Arihant) + spend","Always-on Meta, Google Search/Shopping/PMax, LinkedIn for B2B, TikTok/Shorts/Pinterest later, with creative analytics (Motion) and profit analytics (Triple Whale)."],
 ["CRM & Retention","In-house (Arihant) + SaaS","Klaviyo email/SMS, WhatsApp API broadcasts, loyalty & referral, a B2B sales CRM (HubSpot), and LTV/cohort analytics (Peel/Lifetimely)."],
 ["Chat & Social Automation","In-house (Arihant)","IG comment-to-DM, WhatsApp bots, Telegram broadcasts, Facebook/Messenger, and an AI support chatbot — see Section 7."],
 ["AI & Automation","In-house (Arihant)","n8n/Make backbone, a Claude + MCP command layer, Gemini multimodal, and no-code agent builders (Gumloop/Lindy)."],
 ["Sourcing & Manufacturing","Buy + Hybrid","Apparel units, DTG/DTF print, a merch/gifting supplier network, print-on-demand fallback, QC + tech-packs, and a global-sourcing option."],
 ["Packaging & Unboxing","In-house (Designomics)","Custom boxes/mailers, gift-box engine, inserts/QR, and a premium/sustainable line."],
 ["Inventory & Warehouse","Buy","One inventory system (Zoho/Unicommerce), barcode/SKU, a stockroom + WMS-lite, multi-channel sync, and AI demand forecasting."],
 ["Order & Logistics","Buy","Shipping aggregator, RTO/COD control (GoKwik), an OMS, one-tap UPI checkout, returns automation, and Bengaluru same-day."],
 ["Quick Commerce & Marketplaces","In-house (Arihant) + fees","Amazon & Flipkart, then Myntra/Ajio for Aurra; Meesho + Amazon gifting + optional Etsy for Designomics; a Blinkit/Zepto pilot; marketplace ads."],
 ["Influencer & PR","In-house + spend","Micro/mid seeding, a creator CRM (GRIN/Aspire), an affiliate program, and PR/media outreach."],
 ["Retail / Offline","Hybrid","Store POS + ops, the 12 July launch amplified, pop-ups/exhibitions/activations, and selective offline/OOH ads."],
 ["Finance & Compliance","Buy","Zoho Books/Tally + GST, payment gateway & reconciliation, a CA retainer, entity structuring, spend/expense control (Volopay/Jify), a unit-economics dashboard, and revenue-based inventory financing later."],
 ["Legal & IP","Buy","Trademark portfolio, contracts & policies, and DPDP/data-privacy compliance."],
 ["HR & Team Ops","Hybrid","Phased hiring, payroll (RazorpayX/Keka), an SOP/training library, and contractor management."],
 ["Project & Internal Ops","In-house (Arihant)","One project system (Notion/ClickUp), an AI calendar (Motion), meeting-notes AI (Fathom/Fireflies), a DAM, and event project management."],
 ["Analytics & BI","In-house (Arihant)","GA4 + server-side, a group KPI dashboard, and session replay/heatmaps (Clarity/Hotjar)."],
];
c1.push(table([2350,2200,4450],[[{t:"Domain"},{t:"Owner"},{t:"What runs here"}]].concat(dom.map(function(r){return [{t:r[0],bold:true},{t:r[1]},{t:r[2]}];}))));

c1.push(new Paragraph({children:[new PageBreak()]}));
c1.push(H1("6.  The AI & Creative Engine (2026)"));
c1.push(P("This is the layer that lets four brands run on a small team and lets Arihant out-produce bigger agencies. The workbook's “AI & Creative Stack” tab lists pricing; here is how each layer earns its place."));
c1.push(H3("Video"));
c1.push(P([run("Higgsfield",{bold:true}),run(" is the workhorse for ad volume: its Hermes Agent takes a product URL and returns a ready UGC, CGI or cinematic ad for Meta/TikTok — testimonials, reviews and unboxings without filming. For premium brand and drop films, "),run("Google Flow (Veo 3.1)",{bold:true}),run(" leads on overall quality and native audio, "),run("Runway (Gen-4.5)",{bold:true}),run(" gives marketers the most control (keyframes, motion brush, character consistency), and "),run("Kling 3.0",{bold:true}),run(" is the cheapest premium model for high-volume iteration. "),run("Opus Clip / Descript",{bold:true}),run(" turn one long video into many captioned clips. (Note: Sora is being discontinued through 2026 — don't build on it.)")]));
c1.push(H3("Image"));
c1.push(P([run("Midjourney",{bold:true}),run(" for concept and campaign imagery, "),run("Krea/Leonardo",{bold:true}),run(" for fast real-time variations, "),run("Ideogram",{bold:true}),run(" for text-in-image (posters, packaging art), and "),run("Photoroom/Flair",{bold:true}),run(" for product backgrounds and on-model scenes — catalog-ready visuals without a full shoot.")]));
c1.push(H3("Voice, avatars & copy"));
c1.push(P([run("ElevenLabs",{bold:true}),run(" for realistic multilingual voiceover, "),run("HeyGen",{bold:true}),run(" for talking-avatar spokespeople and multilingual promos, and "),run("ChatGPT Team + Claude",{bold:true}),run(" as the copy-and-strategy brains for scripts, descriptions, briefs and research.")]));
c1.push(H3("Agents, MCP & Gemini"));
c1.push(P([run("The command layer is ",{}),run("Claude + MCP",{bold:true}),run(" (Model Context Protocol — by 2026 an open standard with 10,000+ servers and 75+ official connectors). Via MCP, you can ask questions directly across your Shopify, ad accounts, CRM and Sheets, and run agentic operations (lead qualification, reporting, research). "),run("Google Gemini",{bold:true}),run(" adds multimodal research and Workspace help, and "),run("Gumloop/Lindy/Relay",{bold:true}),run(" let you build ops agents without code. This is the backbone of the Founder Operating System in Section 10.")]));

c1.push(H1("7.  Chat & Social Automation"));
c1.push(P("India buys in chat. These funnels turn attention into orders automatically, across every surface:"));
c1.push(table([2500,6500],[
  [{t:"Channel"},{t:"What it automates"}],
  [{t:"Instagram (ManyChat)",bold:true},{t:"Comment-to-DM funnels (comment a keyword → auto-DM link/coupon), DM auto-reply + qualification with AI, and story-mention replies. Turns engagement into tracked sales."}],
  [{t:"WhatsApp (AiSensy + n8n)",bold:true},{t:"Catalog browsing, ordering and payment inside WhatsApp; order-status updates; broadcasts for drops and offers; AI FAQ/sizing bot. India's highest-converting channel."}],
  [{t:"Telegram (Bot API)",bold:true},{t:"VIP drop broadcasts and early-access for Aurra Hype's community; a low-cost owned hype channel."}],
  [{t:"Facebook / Messenger (ManyChat)",bold:true},{t:"Lead-ad capture → CRM → auto-reply + retargeting handoff for Loop In and corporate gifting."}],
  [{t:"Site + omni (Gorgias AI)",bold:true},{t:"One AI support agent across site chat, IG, WhatsApp and email — sizing, returns, order status — with human handoff."}],
]));

c1.push(H1("8.  Execution Map — Detailed Workflows"));
c1.push(P("The stack only matters if it runs as connected workflows. Four core ones, each mostly automated:"));
c1.push(H3("Workflow A — New product to live everywhere"));
c1.push(P("Add SKU in Shopify → AI generates product images (Photoroom/Krea) and copy (GPT/Claude) → Higgsfield drafts a UGC ad → inventory syncs to marketplaces (Unicommerce) with A+ copy → the drop is scheduled to WhatsApp/Telegram VIPs and the social calendar → ads go live and feed Motion/Triple Whale. One SKU, live across every channel, in minutes instead of days."));
c1.push(H3("Workflow B — Visitor to repeat customer"));
c1.push(P("Ad/organic → fast Shopify store (personalized, 1-tap UPI/COD) → abandoned-cart recovery on WhatsApp+email → order-status automations → post-delivery review + UGC request → loyalty/referral → win-back and occasion flows. RTO risk-flagging protects margin throughout."));
c1.push(H3("Workflow C — Lead to booked event / corporate deal"));
c1.push(P("Form/DM/ad lead → auto-logged in HubSpot with an instant intro + booking link → quote-to-order → event project + vendor management → delivery → post-event feedback, testimonial and upsell. Nothing dropped; every event becomes a case study."));
c1.push(H3("Workflow D — Brand win to external client"));
c1.push(P("Brand result → auto-built KPI report (Looker + GPT) → packaged as an Arihant case study → outbound/inbound → retainer. The three brands continuously manufacture Arihant's proof."));

c1.push(H1("9.  Founder Operating System (summary)"));
c1.push(P("You cannot run four brands from your inbox. The Founder OS is a single command center — detailed in its own playbook. In brief: a live dashboard of every number across all four brands; an automated 8am WhatsApp/Telegram digest; an AI “chief of staff” you query via Claude + MCP; one work system (Notion); AI time-management (Motion); auto meeting-notes (Fathom); a unified comms hub; a weekly auto-scorecard; and one-tap async approvals for creative, spend and hires. The goal: run the group in about an hour of focused review a day, with AI and automations doing the rest."));

c1.push(new Paragraph({children:[new PageBreak()]}));
c1.push(H1("10.  90-Day Roadmap"));
c1.push(H2("Month 1 — Foundation"));
c1.push(P("Fix legal + brand + tech. Clean entities/GST; trademark searches and filings for all brands; rebrand Loop In and lock its name/domain/handles. Stand up the backbone — Shopify, domains, WhatsApp API, payments, analytics, inventory, accounting, the n8n automation layer and the AI creative stack — all connected. Get the content pod shooting, order branded packaging, and turn the 12 July Aurra Hype launch into content and PR. Switch on Meta to set a ROAS baseline."));
c1.push(P([run("Proof: ",{bold:true}),run("trademarks filed, Loop In relaunched, all systems live, a strong store launch, first profitable campaigns.")]));
c1.push(H2("Month 2 — Engine"));
c1.push(P("Add Google/PMax and scale Aurra Hype's winners with creative + profit analytics; switch on retention flows; deploy 15+ automations including the chat funnels; launch Amazon + Flipkart; start Designomics corporate-gifting outbound; relaunch Loop In with lead-gen and a CRM and book its first events; stand up the Founder OS."));
c1.push(P([run("Proof: ",{bold:true}),run("ROAS ≥ ~2.5, retention recovering revenue, live on two marketplaces, a corporate pipeline forming, 2–3 events booked.")]));
c1.push(H2("Month 3 — Scale"));
c1.push(P("Run a full drop calendar with influencer seeding and scaled budgets; pilot Designomics on quick-commerce and POD; run pop-ups/activations and chase PR; systemise with SOPs, first hires and dashboards; and package Arihant to win external clients."));
c1.push(P([run("Proof: ",{bold:true}),run("a record revenue month, hero SKUs, a live q-comm pilot, offline activations and press, a documented growth curve with real CAC/AOV/ROAS/repeat numbers, and Arihant's first outside clients.")]));

c1.push(H1("11.  Budget (Aggressive Scenario)"));
c1.push(P("Indicative monthly ranges; the workbook computes exact totals live. Because most delivery is in-house, spend concentrates in media, production and the tool stack rather than agency fees."));
c1.push(table([3000,2500,3500],[
  [{t:"Bucket"},{t:"Indicative monthly (₹)"},{t:"Notes"}],
  [{t:"Paid media (all brands)",bold:true},{t:"₹3.5–5 L+"},{t:"Largest line; scales with ROAS."}],
  [{t:"Content, creative & AI tools",bold:true},{t:"₹80k–1.3 L"},{t:"Photo/video, UGC, design + the AI creative/agent stack."}],
  [{t:"SaaS & automation stack",bold:true},{t:"₹80k–1.2 L"},{t:"Shopify, Klaviyo, WhatsApp, inventory, shipping, analytics, n8n, chat automation."}],
  [{t:"Influencer / seeding",bold:true},{t:"₹1 L+"},{t:"Mostly Aurra Hype; product-gifting lowers cash cost."}],
  [{t:"Ops, finance, legal, HR",bold:true},{t:"₹40k–70k"},{t:"CA, legal/IP, payroll as team grows."}],
  [{t:"One-time setup",bold:true,bg:"FFF3C4"},{t:"₹5–7 L"},{t:"Trademarks, entity setup, replatforming, warehouse/POS, packaging tooling, launch."}],
]));

c1.push(H1("12.  World-Class Benchmarks"));
c1.push(P("Where possible, adopt the proven default instead of inventing one. The workbook's Benchmarks tab maps each function to the best-in-class stack and your move; the essentials: Shopify + Klaviyo + Triple Whale as the D2C core; Motion for creative analytics; Higgsfield/Runway/Veo for AI creative; ManyChat + WhatsApp for chat; Gorgias AI for support; GRIN/Aspire for influencers; n8n + Claude MCP for automation; Notion + Motion + Fathom for founder operations."));

c1.push(H1("13.  KPIs, Risks & Immediate Actions"));
c1.push(H3("The numbers that matter"));
c1.push(P("Track per brand on one dashboard: revenue and growth curve; ROAS and CAC (falling); AOV and contribution margin (true profit after COGS/ads/RTO); repeat-rate and LTV; RTO rate (falling); and pipeline proof (corporate deals, events booked, Arihant's first clients)."));
c1.push(P([run("On the target: ",{italics:true}),run("“crore-crore in three months” is the right ambition and direction, but from a thin base, ninety days is realistically about building the machine and proving a steep, documented growth curve with healthy unit economics — which is exactly what makes the group fundable and scalable.",{italics:true})]));
c1.push(H3("Key risks",ORANGE));
c1.push(table([2600,6400],[
  [{t:"Risk"},{t:"Mitigation"}],
  [{t:"Loop In name/domain clash",bold:true,bg:"FFF3C4"},{t:"Rebrand + trademark in Month 1, while change is cheap."}],
  [{t:"Founder over-extension (4 brands)",bold:true},{t:"The Founder OS, automations and phased roadmap remove manual load; hire in M2–M3."}],
  [{t:"Apparel RTO / COD losses",bold:true},{t:"Risk-flagging + COD verification; push prepaid incentives."}],
  [{t:"Thin quick-commerce margins",bold:true},{t:"Treat Blinkit/Zepto as an M3 pilot on high-margin SKUs only; D2C stays priority."}],
  [{t:"AI-tool sprawl / cost",bold:true},{t:"Adopt tools by phase; the workbook sequences P0→P3; review spend weekly in the Founder OS."}],
]));
c1.push(H3("This week"));
c1.push(bullet("Run IP India searches for a new Loop In name + Aurra/Designomics marks; lock the new Loop In name, domain and handles."));
c1.push(bullet("Engage a CA + IP attorney: confirm structure/GST and start filings."));
c1.push(bullet("Stand up the backbone: Shopify + WhatsApp API + payments + GA4 + n8n, connected; set up the AI creative accounts (Higgsfield, Midjourney, Claude, ElevenLabs)."));
c1.push(bullet("Brief the content pod; shoot Aurra Hype's catalog; plan the 12 July launch as a filmed, PR-able event (run by Loop In)."));
c1.push(bullet("Design + order branded packaging; finalise apparel/DTG and merch suppliers."));
c1.push(bullet("Switch on Meta for Aurra Hype to set the ROAS baseline; connect Motion + Triple Whale."));
c1.push(spacer(120));
c1.push(P([run("Companion files: ",{bold:true}),run("Harshdeep_Group_Master_Stack_FULL.xlsx (13 tabs — stack, per-brand playbooks, AI stack, automations, Founder OS, benchmarks, roadmap, budget) and the Founder Operating System playbook.",{italics:true})]));

/* =======================================================================================
   DOC 2 — FOUNDER OPERATING SYSTEM PLAYBOOK
======================================================================================= */
let c2=[];
c2 = c2.concat(cover("Founder Operating System","How to run four brands from one command center — in about an hour a day","AI copilots + automations do the rest","The founder's day-to-day playbook"));
c2.push(H1("Contents"));
c2.push(new TableOfContents("Contents",{hyperlink:true, headingStyleRange:"1-2"}));
c2.push(new Paragraph({children:[new PageBreak()]}));

c2.push(H1("1.  The Idea"));
c2.push(P("Four brands cannot be run from an inbox and a dozen open tabs. The Founder Operating System is one command center that pulls every number, task, message and approval into a single place, with AI and automations doing the heavy lifting so your time goes to decisions and taste — not data-gathering. The target is to run the whole group in roughly an hour of focused review a day, plus real work on whatever needs your judgment."));
c2.push(P("It has ten layers. You do not build them all at once — layers 1–4 are Month 1, 5–8 are Month 2, 9–10 are Month 3."));

c2.push(H1("2.  The Ten Layers"));
c2.push(table([1900,3550,3550],[
  [{t:"Layer"},{t:"What it is"},{t:"Tools"}],
  [{t:"1 · Command Center",bold:true},{t:"One dashboard: revenue, CAC, ROAS, AOV, cash, stock, pipeline — all four brands"},{t:"Looker Studio + Triple Whale + Sheets, fed by n8n"}],
  [{t:"2 · Daily Digest",bold:true},{t:"8am summary + anomalies + today's to-dos, pushed to you"},{t:"n8n + GPT + WhatsApp/Telegram"}],
  [{t:"3 · AI Chief of Staff",bold:true},{t:"Ask questions across all your data in plain language"},{t:"Claude + MCP connectors (Shopify, ads, CRM, Sheets)"}],
  [{t:"4 · Work System",bold:true},{t:"Every brand's workstreams, tasks and SOPs in one place"},{t:"Notion / ClickUp"}],
  [{t:"5 · Time & Focus",bold:true},{t:"AI auto-schedules deep work, meetings and priorities"},{t:"Motion (usemotion) / Reclaim"}],
  [{t:"6 · Meetings",bold:true},{t:"Auto notes + action items pushed to tasks"},{t:"Fathom / Fireflies"}],
  [{t:"7 · Comms Hub",bold:true},{t:"One inbox for email, IG, WhatsApp and chat"},{t:"Gorgias / shared inbox + Superhuman"}],
  [{t:"8 · Money View",bold:true},{t:"Spend, burn, runway and approvals across brands"},{t:"Volopay/Jify + Zoho Books"}],
  [{t:"9 · Approvals",bold:true},{t:"Creative, spend and hires flow to you for one-tap approve"},{t:"n8n + WhatsApp/Slack"}],
  [{t:"10 · Weekly Scorecard",bold:true},{t:"Auto scorecard vs targets + team accountability"},{t:"Looker + n8n"}],
]));

c2.push(new Paragraph({children:[new PageBreak()]}));
c2.push(H1("3.  The Command Center"));
c2.push(P("A single live page is the heart of the system. It shows, for each of the four brands and for the group: revenue today/WTD/MTD vs target; ad spend and blended ROAS; CAC and AOV; contribution margin; orders and RTO rate; cash position and runway; and the B2B pipeline (events + corporate gifting) and Arihant's client pipeline. It is built in Looker Studio, fed by Triple Whale and Google Sheets, which n8n keeps updated from Shopify, the ad platforms and your CRM. You open it first thing and glance — green is fine, red gets your attention."));

c2.push(H1("4.  The AI Chief of Staff (Claude + MCP)"));
c2.push(P("Instead of digging through dashboards, you ask. With Claude connected to your systems through MCP (Model Context Protocol), you can type questions like “which Aurra Hype creatives had ROAS above 3 this week and how much budget is left on them?”, “what's my true margin on the top 10 Designomics SKUs after RTO?”, or “draft this week's investor update from the numbers.” MCP is an open 2026 standard with thousands of ready connectors, so Shopify, your ad accounts, HubSpot, Sheets and more plug in. Pair it with no-code agents (Gumloop/Lindy) for recurring jobs — lead qualification, competitor scans, weekly reporting — that run without you."));

c2.push(H1("5.  The Founder's Cadence"));
c2.push(H3("Daily (about an hour, in blocks)"));
c2.push(bullet("Morning: read the 8am digest; open the Command Center; flag anything red. (10 min)"));
c2.push(bullet("Approvals: clear the one-tap queue — creative, spend, hires. (10 min)"));
c2.push(bullet("Comms: batch-process the unified inbox twice, not continuously. (20 min)"));
c2.push(bullet("Deep work: one Motion-scheduled block on the highest-judgment task — product, partnerships, creative direction. (remainder)"));
c2.push(H3("Weekly"));
c2.push(bullet("Monday: review the auto-scorecard vs targets per brand; set the week's one priority per brand."));
c2.push(bullet("Midweek: creative review (what's winning in Motion), pipeline review (HubSpot)."));
c2.push(bullet("Friday: money review (burn/runway), and a 30-minute retro — what to automate next."));
c2.push(H3("Monthly"));
c2.push(bullet("Unit-economics deep dive per brand with the CA; update the growth-curve deck from real data."));
c2.push(bullet("Hiring/SOP review; decide what the founder should stop doing and hand to a person or an agent."));

c2.push(H1("6.  Founder-Level Automations"));
c2.push(P("Beyond the brand automations, these protect the founder's time and attention specifically:"));
c2.push(table([3200,5800],[
  [{t:"Automation"},{t:"What it does"}],
  [{t:"8am command digest",bold:true},{t:"Sales, spend, ROAS, top SKUs, low stock, pipeline changes — one WhatsApp/Telegram message across four brands."}],
  [{t:"Anomaly alerts",bold:true},{t:"Only pings you when something breaks a threshold (ROAS drop, stockout, RTO spike, big lead) — signal, not noise."}],
  [{t:"One-tap approvals",bold:true},{t:"Creative, ad-budget and hire requests arrive as approve/reject buttons; your tap triggers the next automated step."}],
  [{t:"Weekly auto-scorecard",bold:true},{t:"Every Monday, targets vs actuals per brand, with owners — built and delivered automatically."}],
  [{t:"Meeting-to-tasks",bold:true},{t:"Every call is transcribed; action items land in Notion assigned, so nothing relies on memory."}],
  [{t:"AI weekly briefing",bold:true},{t:"Claude drafts a plain-language 'state of the group' from the data for your Monday review."}],
  [{t:"Cash & runway watch",bold:true},{t:"Flags burn and runway changes and unusually large expenses before they matter."}],
]));

c2.push(H1("7.  A Day in the Life (target state)"));
c2.push(P("You wake to a single message: revenue tracking to plan, one Aurra Hype creative fatiguing, a corporate-gifting lead worth following up, one low-stock SKU with a PO already drafted for your approval. You approve the PO and the creative swap with two taps. You open the Command Center — all green except Loop In's pipeline, so you spend your deep-work block on event outreach. Your AI chief of staff drafts three follow-ups from the CRM; you edit and send. Meetings auto-transcribe into tasks. By early afternoon the operational surface is handled, and your remaining time goes to the things only you can do — product taste, partnerships, and brand direction. That is the point of the system: leverage, not busywork."));
c2.push(spacer(120));
c2.push(P([run("Build order: ",{bold:true}),run("Command Center + Daily Digest + AI Chief of Staff + Work System in Month 1; Time/Focus + Meetings + Comms + Money in Month 2; Approvals + Weekly Scorecard in Month 3. Companion: Harshdeep_Group_Master_Stack_FULL.xlsx (“Founder OS” tab).",{italics:true})]));

Promise.all([
  Packer.toBuffer(docShell("Harshdeep Group — Growth & Scale Blueprint (Full)", c1)).then(function(b){ fs.writeFileSync("/sessions/bold-epic-ramanujan/mnt/outputs/Harshdeep_Group_Strategy_FULL.docx", b); }),
  Packer.toBuffer(docShell("Harshdeep Group — Founder Operating System", c2)).then(function(b){ fs.writeFileSync("/sessions/bold-epic-ramanujan/mnt/outputs/Harshdeep_Group_Founder_OS.docx", b); })
]).then(function(){ console.log("BOTH DOCS WRITTEN"); });
