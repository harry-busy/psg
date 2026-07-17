const docx = require("docx");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, TableOfContents,
  Header, Footer, PageNumber, LevelFormat, convertInchesToTwip
} = docx;
const fs = require("fs");

const NAVY="1F2A44", BLUE="2E5AAC", TEAL="0E7C7B", ORANGE="C05621", GREY="5A6270", LGREY="F2F4F7", ACCENT="C05621";
const FONT="Calibri";

const P = (text, opts={}) => new Paragraph({
  spacing:{after: opts.after??120, before: opts.before??0, line: 276},
  alignment: opts.align,
  children: (Array.isArray(text)?text:[new TextRun({text, font:FONT, size:opts.size??21, color:opts.color??"222222", bold:opts.bold, italics:opts.italics})])
});
const run = (t,o={}) => new TextRun({text:t, font:FONT, size:o.size??21, color:o.color??"222222", bold:o.bold, italics:o.italics});

const H1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing:{before:280, after:120},
  children:[new TextRun({text:t, font:FONT, size:30, bold:true, color:NAVY})] });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing:{before:220, after:90},
  children:[new TextRun({text:t, font:FONT, size:24, bold:true, color:BLUE})] });
const H3 = (t,color=TEAL) => new Paragraph({ heading: HeadingLevel.HEADING_3, spacing:{before:160, after:70},
  children:[new TextRun({text:t, font:FONT, size:22, bold:true, color})] });

const bullet = (t, level=0) => new Paragraph({
  numbering:{reference:"bl", level},
  spacing:{after:70, line:270},
  children: Array.isArray(t)?t:[new TextRun({text:t, font:FONT, size:21, color:"222222"})]
});

function cell(text, {w, bold, bg, color, size=19, align}={}) {
  const kids = Array.isArray(text)? text.map(x=> new TextRun({...x, font:FONT, size:x.size||size}))
    : [new TextRun({text:String(text), font:FONT, size, bold, color:color||"222222"})];
  return new TableCell({
    width:{size:w, type:WidthType.DXA},
    shading: bg?{type:ShadingType.CLEAR, fill:bg, color:"auto"}:undefined,
    margins:{top:60,bottom:60,left:90,right:90},
    children:[new Paragraph({alignment:align, spacing:{after:0,line:250}, children:kids})]
  });
}
function table(colW, rows) {
  const total = colW.reduce((a,b)=>a+b,0);
  return new Table({
    columnWidths: colW, width:{size:total, type:WidthType.DXA},
    borders:{
      top:{style:BorderStyle.SINGLE,size:2,color:"C9CED6"}, bottom:{style:BorderStyle.SINGLE,size:2,color:"C9CED6"},
      left:{style:BorderStyle.SINGLE,size:2,color:"C9CED6"}, right:{style:BorderStyle.SINGLE,size:2,color:"C9CED6"},
      insideHorizontal:{style:BorderStyle.SINGLE,size:2,color:"D9DEE5"}, insideVertical:{style:BorderStyle.SINGLE,size:2,color:"D9DEE5"}
    },
    rows: rows.map((r,i)=> new TableRow({
      tableHeader: i===0,
      children: r.map((c,ci)=> cell(c.t,{w:colW[ci], bold:i===0?true:c.bold, bg:i===0?NAVY:(c.bg|| (i%2===0?"F7F9FC":undefined)), color:i===0?"FFFFFF":c.color, align:c.align, size:c.size}))
    }))
  });
}
const spacer = (h=80)=> new Paragraph({spacing:{after:h}, children:[new TextRun({text:"",font:FONT})]});
const rule = ()=> new Paragraph({ spacing:{after:120}, border:{bottom:{style:BorderStyle.SINGLE,size:6,color:ORANGE}} , children:[new TextRun({text:"",font:FONT})]});

// ---------------- CONTENT ----------------
const children = [];

// COVER
children.push(
  new Paragraph({spacing:{before:1400,after:0}, alignment:AlignmentType.CENTER, children:[new TextRun({text:"HARSHDEEP GROUP", font:FONT, size:56, bold:true, color:NAVY})]}),
  new Paragraph({spacing:{after:60}, alignment:AlignmentType.CENTER, border:{bottom:{style:BorderStyle.SINGLE,size:10,color:ORANGE}}, children:[new TextRun({text:"", font:FONT})]}),
  new Paragraph({spacing:{before:160,after:40}, alignment:AlignmentType.CENTER, children:[new TextRun({text:"90-Day Scale Engine", font:FONT, size:34, bold:true, color:BLUE})]}),
  new Paragraph({spacing:{after:300}, alignment:AlignmentType.CENTER, children:[new TextRun({text:"The complete services, software & automation blueprint to grow three brands toward crore-scale", font:FONT, size:22, italics:true, color:GREY})]}),
  new Paragraph({spacing:{after:40}, alignment:AlignmentType.CENTER, children:[new TextRun({text:"Aurra Hype   ·   Designomics India   ·   Loop In Events", font:FONT, size:24, bold:true, color:NAVY})]}),
  new Paragraph({spacing:{after:600}, alignment:AlignmentType.CENTER, children:[new TextRun({text:"Powered in-house by Arihant Digital", font:FONT, size:20, italics:true, color:TEAL})]}),
  new Paragraph({spacing:{after:20}, alignment:AlignmentType.CENTER, children:[new TextRun({text:"Founder: Harshdeep   |   Bengaluru, India", font:FONT, size:20, color:"444444"})]}),
  new Paragraph({spacing:{after:20}, alignment:AlignmentType.CENTER, children:[new TextRun({text:"Strategy & Operating Plan — July 2026", font:FONT, size:20, color:"444444"})]}),
  new Paragraph({children:[new PageBreak()]})
);

// TOC
children.push(H1("Contents"));
children.push(new TableOfContents("Contents",{hyperlink:true, headingStyleRange:"1-2"}));
children.push(new Paragraph({children:[new PageBreak()]}));

// 1. EXEC SUMMARY
children.push(H1("1.  Executive Summary"));
children.push(P("You are not launching three startups from zero. You are a founder with a roughly ten-year-old digital agency — Arihant Digital — deciding to point that machine at three of your own brands. That single fact changes the entire strategy. Where a normal founder pays agencies for web, marketing, design and automation, you already own most of that capability. The plan below treats Arihant Digital and the Designomics production capability as an in-house engine that builds and scales all three brands at internal cost, and then sells that same, now battle-tested capability to outside clients as your proof accumulates."));
children.push(P([run("The three brands are deliberately complementary. "),run("Aurra Hype",{bold:true}),run(" is a Bengaluru streetwear / hype-apparel label selling through aurahyped.com, with a physical store and office launching 12 July. "),run("Designomics India",{bold:true}),run(" is a personalised gifting and merchandise brand — custom gift boxes, stickers, mugs, oversized tees, workshops and corporate gifting. "),run("Loop In Events",{bold:true}),run(" is an event-management and experiential business. Apparel, merch/gifting, and events reinforce one another: events need merch and gifting, corporate gifting opens B2B doors, and apparel drops are experiential moments. One audience, three revenue engines, one content and data flywheel.")]));
children.push(P([run("One issue needs fixing before it becomes expensive: ",{}),run("\"Loop In Events\" and loopinevents.com already belong to an established Canadian event planner (Michelle Munro). ",{bold:true}),run("You are operating under a name someone else built and owns online. Section 3.3 lays out a rebrand-and-trademark plan. Separately, \"Aurra/Aura\" is a very crowded name in Indian apparel, so Aurra Hype needs a distinctive, trademarked identity too.")]));
children.push(P("This document is the narrative and roadmap. The companion spreadsheet (Harshdeep_Group_Stack.xlsx) is the operating tool: every service, software and automation tagged by brand, priority, in-house-vs-buy, vendor and cost, plus a week-by-week roadmap, an AI-automation catalogue, a channel tracker and a live budget. Read them together."));

// 2. THESIS
children.push(H1("2.  The Group Thesis — One Flywheel, Four Assets"));
children.push(P("The strategic core is a flywheel in which each asset lowers the cost or raises the value of the others:"));
children.push(bullet([run("Arihant Digital",{bold:true}),run(" builds the websites, runs the paid and organic marketing, sets up the analytics and builds the automations — for all three brands, at cost.")]));
children.push(bullet([run("Designomics",{bold:true}),run(" supplies design, branding, print, packaging and merchandise to itself, to Aurra Hype and to Loop In Events — again, at cost.")]));
children.push(bullet([run("Aurra Hype and Loop In Events",{bold:true}),run(" generate real revenue, real customers and real content — which become the case studies that let Arihant and Designomics win external clients.")]));
children.push(bullet([run("Every external client",{bold:true}),run(" then funds more capability, which compounds back into the three brands. That is the flywheel.")]));
children.push(P([run("The financial edge is structural: work an outsider would pay agency rates for is delivered to your brands at internal cost. ",{bold:true}),run("That spread is your margin advantage and the reason a three-brand build is realistic for one founder. The risk is the mirror image — over-extension. The roadmap in Section 8 sequences the work so the in-house engine is never asked to do everything at once.")]));

// 3. BUSINESS DEEP-DIVES
children.push(new Paragraph({children:[new PageBreak()]}));
children.push(H1("3.  Business Deep-Dives"));

children.push(H2("3.1  Aurra Hype — Streetwear / Hype Apparel D2C"));
children.push(P("Aurra Hype sells hype-driven apparel online with a new physical store and office in Bengaluru. Streetwear in India is a genuine, fast-growing culture, but it is won on three things: desirable product, a hype/drop rhythm, and disciplined performance marketing with healthy unit economics. The current footprint is thin and inconsistent — the immediate job is to make the brand look and feel established, then pour measured paid traffic into a store that converts."));
children.push(H3("What it needs"));
children.push(P("A refined, trademarked identity that separates it from the many \"Aura/Aurra\" apparel brands; a fast Shopify store with reviews, upsells and one-tap UPI/COD checkout; catalog and lifestyle photography plus a reels engine; always-on Meta ads scaling into Google Shopping/PMax; email/SMS/WhatsApp retention flows; reliable apparel manufacturing plus small-batch print (DTG/DTF) so drops don't require huge MOQs; branded packaging for an unboxing moment; a shipping aggregator with RTO/COD control (RTO is the silent killer of apparel margins); and a POS that unifies the new store with online stock. Marketplaces (Amazon, Flipkart, then Myntra/Ajio) come once the D2C engine is profitable."));

children.push(H2("3.2  Designomics India — Personalised Gifting, Merch & Apparel"));
children.push(P("Designomics is a gifting and merchandise brand: build-your-own gift boxes, stickers, posters, mugs, bottles, candles, notebooks, oversized tees, DTF patch kits and workshops, with an explicit \"Made in Bharat\" and corporate-gifting angle. This is the most naturally profitable of the three because it has two demand engines — impulse/occasion D2C gifting and contract corporate gifting — and because a strong customization UX commands premium prices."));
children.push(H3("What it needs"));
children.push(P("A move off Wix onto a platform that supports a proper custom-box configurator, apps and speed; a corporate-gifting sales motion (outbound to companies, catalogs, quote-to-order, bulk pricing, GST invoicing); a reliable supplier network for merch categories plus print-on-demand for the long tail; occasion-based automation (birthdays, festivals, anniversaries) that turns one-time gifters into recurring revenue; and, later, a quick-commerce pilot for a few fast-moving low-price gifting SKUs. Because Designomics already produces design and print, it becomes the group's in-house packaging and merch arm."));

children.push(H2("3.3  Loop In Events — Event Management  ⚠  Name & Trademark Risk"));
children.push(P([run("Loop In Events is your experiential/event-management business. Before scaling it, resolve a real problem: ",{}),run("\"Loop In Events\" and the domain loopinevents.com already belong to an established Canadian event planner (Michelle Munro), an inclusive-events specialist with a live, professional website. ",{bold:true}),run("You are currently building brand equity, running ads and creating content under a name and web identity that someone else owns and ranks for.")]));
children.push(H3("Why this matters",ORANGE));
children.push(P("You will never own the matching .com without buying it from her (unlikely/expensive). Your SEO, ads and PR partly benefit her brand through name confusion. If either party trademarks in the other's markets, or if you ever expand internationally, the conflict escalates. And any brand you build on a name you don't own is equity you can lose."));
children.push(H3("Recommended path",ORANGE));
children.push(P("Rebrand now, while the brand is young and the cost of change is lowest. Choose a distinctive name; run a free IP India public-search (wordmark + phonetic) across the relevant classes — most importantly Class 41 (event/entertainment services) and Class 35 (advertising/business); secure the matching .com/.in domain and social handles before announcing; then file the trademark through an IP attorney. Budget roughly ₹45,000–₹60,000 for search, filing and identity across the group's brands. Treat this as Month-1, non-negotiable work — the spreadsheet lists it as P0."));
children.push(H3("What it needs (post-rebrand)",TEAL));
children.push(P("A lead-capturing website with a portfolio and packages; a sales CRM to move enquiries from quote to booking; local + LinkedIn lead-gen; an event project/vendor-management system; and post-event feedback/testimonial automation. Loop In also becomes the group's live-activation arm — it runs Aurra Hype's store launches, pop-ups and drop events, and Designomics' corporate-gifting experiences."));

// 4. IN-HOUSE ENGINE
children.push(new Paragraph({children:[new PageBreak()]}));
children.push(H1("4.  The In-House Engine & Cross-Sell Flywheel"));
children.push(P("The table below shows how each brand supplies and consumes value across the group. This is the operating logic that makes one founder running three brands feasible — and it is also, itself, a productised agency offer you can sell externally."));
children.push(table([2400,3300,3300],[
  [{t:"Asset"},{t:"Supplies to the group"},{t:"Consumes from the group"}],
  [{t:"Arihant Digital",bold:true,bg:"EAF0FB"},{t:"Web build, performance + organic marketing, SEO/GEO, analytics, all automations"},{t:"Real brands to showcase as case studies → external clients"}],
  [{t:"Designomics",bold:true,bg:"EDF6EA"},{t:"Branding, design, print, packaging, merch, gifting, workshops"},{t:"Digital marketing + web + automation from Arihant"}],
  [{t:"Aurra Hype",bold:true,bg:"FDEDE3"},{t:"Streetwear product, drops, youth-culture content & audience"},{t:"Web, ads, packaging, events, automation from the group"}],
  [{t:"Loop In Events",bold:true,bg:"FFF7E0"},{t:"Live activations, launches, pop-ups, corporate experiences"},{t:"Branding, web, marketing, merch/gifting from the group"}],
]));
children.push(spacer());
children.push(P([run("The cross-sell engine: ",{bold:true}),run("a corporate client who books Loop In for an event is offered Designomics gifting for attendees and Arihant for their digital; a Designomics corporate-gifting buyer is a warm lead for events; Aurra Hype's audience is content fuel for all three. One relationship, multiple revenue lines — and dramatically lower blended CAC.")]));

// 5. FULL STACK
children.push(new Paragraph({children:[new PageBreak()]}));
children.push(H1("5.  The Full Operating Stack, by Domain"));
children.push(P("This is the \"everything a business needs\" map — online and offline. Each domain below names what to run and who owns it (in-house via Arihant/Designomics, or bought). The companion spreadsheet has the vendor, priority, phase and cost for every single line."));

const domainRows = [
  ["Brand & Identity","In-house (Designomics) + IP attorney","Group naming architecture, per-brand logos & guidelines, trademark search & filing. Fixes the Loop In name clash and the crowded 'Aurra' space."],
  ["Website & E-commerce","In-house (Arihant)","Shopify for Aurra Hype & Designomics (off Wix), lead-gen site for Loop In, conversion apps, one-tap UPI/COD checkout, CRO, hosting/email/DNS."],
  ["Content & Creative","Hybrid","Product + lifestyle photography, a short-form video/reels engine (3–5/week/brand), a design subscription, UGC creator pipeline, drop lookbooks."],
  ["Performance Marketing","In-house (Arihant) + ad spend","Always-on Meta, Google Search/Shopping/PMax, LinkedIn for B2B/events, a creative-testing framework to drive CAC down."],
  ["Organic & Social","In-house (Arihant)","Consistent posting calendars, community/DM management, influencer seeding for Aurra Hype."],
  ["SEO / GEO / AEO","In-house (Arihant)","Technical + on-page SEO, AI-answer optimisation (get cited by ChatGPT/Gemini/Perplexity/AI Overviews), Google Business Profiles, content engine."],
  ["CRM & Retention","In-house (Arihant) + SaaS","Email/SMS via Klaviyo, WhatsApp Business API broadcasts, loyalty & referral, a sales CRM for Loop In & corporate gifting."],
  ["AI & Automation","In-house (Arihant)","n8n/Make backbone connecting store, ads, CRM, WhatsApp and sheets; support chatbot; AI content & product imagery; ops dashboards. See Section 6."],
  ["Customer Support","Buy","Shared helpdesk across email/IG/WhatsApp/chat, plus returns/exchange management for apparel."],
  ["Sourcing & Manufacturing","Buy + Hybrid","Apparel units (Tiruppur/Ludhiana/Bengaluru), DTG/DTF print for small-batch drops, merch/gifting supplier network, print-on-demand fallback, QC + tech-packs."],
  ["Packaging & Unboxing","In-house (Designomics)","Custom branded boxes, mailers and tape; gift-box configurator; inserts, thank-you cards, review/referral QR codes."],
  ["Inventory & Warehouse","Buy","One inventory system (Zoho Inventory/Unicommerce), barcode/SKU labelling, stockroom setup, multi-channel stock sync to stop overselling."],
  ["Order & Logistics","Buy","Shipping aggregator (Shiprocket/iThink) for best courier per pincode, RTO/COD control, an OMS, fast checkout, and Bengaluru same-day."],
  ["Quick Commerce & Marketplaces","In-house (Arihant) + fees","Amazon & Flipkart (then Myntra/Ajio) for Aurra Hype; Meesho + a Blinkit/Zepto/Instamart pilot for Designomics gifting SKUs; marketplace ads."],
  ["Retail / Offline","Hybrid","Store POS + ops, the 12 July launch amplified as content/PR, and pop-ups/exhibitions/college activations run by Loop In."],
  ["Finance & Compliance","Buy","Zoho Books/Tally + GST, payment gateway & reconciliation, a CA retainer, entity structuring, and a live unit-economics dashboard."],
  ["Legal & IP","Buy","Trademark portfolio, contracts & policies, supplier/influencer/employment agreements."],
  ["HR & Team Ops","Hybrid","Phased hiring (marketing, ops, design), payroll/attendance, an SOP & training library."],
  ["Project & Internal Ops","In-house (Arihant)","One project/task system across all three brands, a central asset library (DAM), and event project management for Loop In."],
  ["Analytics & BI","In-house (Arihant)","GA4 + server-side tracking, e-com profit analytics (true profit after ads/RTO/COGS), and one group KPI dashboard."],
];
children.push(table([2350,2100,4550], [
  [{t:"Domain"},{t:"Owner"},{t:"What runs here"}],
  ...domainRows.map(r=>[{t:r[0],bold:true},{t:r[1]},{t:r[2]}])
]));

// 6. AI AUTOMATION
children.push(new Paragraph({children:[new PageBreak()]}));
children.push(H1("6.  AI Automation Playbook"));
children.push(P("Automation is where a small team punches far above its weight. Build these on an n8n or Make backbone wired to Shopify, the WhatsApp Business API, your CRM, Google Sheets and an LLM (GPT/Claude). The spreadsheet's \"AI Automations\" tab has the full catalogue; the highest-leverage ones are:"));
children.push(table([3200,5800],[
  [{t:"Automation"},{t:"What it does & why it pays"}],
  [{t:"Abandoned-cart recovery",bold:true},{t:"Timed WhatsApp + email with the product image and a nudge; typically recovers 8–15% of lost carts — pure margin."}],
  [{t:"Order-status on WhatsApp",bold:true},{t:"Auto updates at placed/shipped/out-for-delivery/delivered; cuts 'where is my order' tickets by ~60%."}],
  [{t:"AI support chatbot",bold:true},{t:"24×7 answers on sizing, returns and order status across site + WhatsApp, handing off to a human when needed."}],
  [{t:"Review & UGC request flow",bold:true},{t:"Post-delivery ask for a review + photo, rewarded with a coupon — builds the social proof that lowers ad CAC."}],
  [{t:"Daily ops digest to founder",bold:true},{t:"Every morning: sales, ad spend, ROAS, top SKUs and low-stock across all three brands, delivered to WhatsApp. One-glance control."}],
  [{t:"Low-stock & reorder alerts",bold:true},{t:"Flags winners before they sell out and drafts a PO to the supplier — prevents lost-sale stockouts."}],
  [{t:"Lead → CRM → auto-reply",bold:true},{t:"Every form/DM/ad lead for Loop In & corporate gifting is logged, answered with a booking link, and assigned. No lead dropped."}],
  [{t:"AI creative & imagery",bold:true},{t:"Generates ad copy, captions, product descriptions and on-model product images — cutting content time ~70%."}],
  [{t:"RTO/COD risk flagging",bold:true},{t:"Scores COD orders and auto-verifies risky ones over WhatsApp — directly protects apparel margin."}],
  [{t:"Client-ready weekly report",bold:true},{t:"Auto-builds a branded KPI report — used internally and sold as an Arihant service."}],
]));

// 7 -> becomes 7 Roadmap (renumber: 7 90-day)
children.push(new Paragraph({children:[new PageBreak()]}));
children.push(H1("7.  The 90-Day Roadmap"));
children.push(P("Three phases. Each ends in a concrete \"proof\" milestone — the evidence that the machine is working. The spreadsheet's roadmap tab breaks this to the week with owners."));

children.push(H2("Month 1 — Foundation (Weeks 1–4)"));
children.push(P("Get legal, brand and tech right so nothing built later has to be redone. Register/clean the entities and GST; run trademark searches and file for all three brands; rebrand Loop In and lock its new name, domain and handles; unify the brand systems. Stand up the tech backbone — Shopify, domains, WhatsApp API, payments, analytics, inventory, accounting and the n8n automation layer — all connected. Get the content pod shooting, design and order branded packaging, and turn the 12 July Aurra Hype store launch into a content-and-PR moment. Switch on always-on Meta ads to set a ROAS baseline."));
children.push(P([run("Proof: ",{bold:true}),run("three trademarks filed, Loop In relaunched under a clean name, all core systems live, the store launch driving footfall and a content spike, and the first profitable ad campaigns.")]));

children.push(H2("Month 2 — Engine (Weeks 5–8)"));
children.push(P("Turn the foundation into a compounding machine. Add Google/PMax and scale Aurra Hype's ad winners with CRO; switch on email/SMS/WhatsApp retention flows; deploy the top ten automations. Launch Aurra Hype on Amazon and Flipkart. Start Designomics' corporate-gifting outbound with a catalog and quote system. Relaunch Loop In with lead-gen and a CRM and book its first signature events. Turn on loyalty, referral and the UGC pipeline."));
children.push(P([run("Proof: ",{bold:true}),run("ROAS at or above ~2.5, retention flows visibly recovering revenue, live on two marketplaces, a corporate-gifting pipeline forming, and 2–3 events booked with case studies underway.")]));

children.push(H2("Month 3 — Scale (Weeks 9–12)"));
children.push(P("Push the winners and prove the model. Run a full drop calendar for Aurra Hype with influencer seeding and scaled budgets on proven creatives. Pilot Designomics on quick-commerce and print-on-demand for the long tail, with festive campaigns. Run pop-ups, exhibitions and college activations through Loop In and chase PR. Systemise with SOPs, first hires and dashboards — and package the now-proven Arihant capability to win external clients."));
children.push(P([run("Proof: ",{bold:true}),run("a record revenue month, hero SKUs identified, a live quick-commerce pilot, offline activations and press, a documented growth curve with real CAC/AOV/ROAS/repeat-rate numbers, and — the ultimate proof — Arihant landing outside clients off the back of your own brands.")]));

// 8. BUDGET
children.push(new Paragraph({children:[new PageBreak()]}));
children.push(H1("8.  Budget & Investment (Aggressive Scenario)"));
children.push(P("The figures below are indicative monthly ranges for the aggressive-spend posture you chose; the spreadsheet's Budget tab computes exact totals live from the stack, and ad budgets should scale up as ROAS proves out — treat them as floors, not caps. Because so much is delivered in-house, most spend is media and production rather than agency fees."));
children.push(table([3000,2600,3400],[
  [{t:"Bucket"},{t:"Indicative monthly (₹)"},{t:"Notes"}],
  [{t:"Paid media (all brands)",bold:true},{t:"₹3.5–5 L+"},{t:"Largest line; scales with ROAS. Meta first, then Google + marketplace ads."}],
  [{t:"Content & creative",bold:true},{t:"₹60k–1 L"},{t:"Photo/video, UGC creators, design subscription."}],
  [{t:"SaaS & automation stack",bold:true},{t:"₹80k–1.2 L"},{t:"Shopify, Klaviyo, WhatsApp API, inventory, shipping, analytics, n8n, etc."}],
  [{t:"Influencer / seeding",bold:true},{t:"₹1 L+"},{t:"Mostly Aurra Hype; product-gifting keeps cash cost lower."}],
  [{t:"Ops, finance, legal, HR",bold:true},{t:"₹40k–60k"},{t:"CA retainer, legal/IP, payroll as team grows."}],
  [{t:"One-time setup",bold:true},{t:"₹5–7 L","bg":"FFF3C4"},{t:"Trademarks, entity setup, replatforming, warehouse/POS, packaging tooling, launch."}],
]));
children.push(spacer());
children.push(P([run("The point of the in-house model: ",{bold:true}),run("an outside founder spending this would also pay 3–5× these numbers in agency margin. You keep that spread — it is what makes crore-scale ambition across three brands financially rational rather than reckless.")]));

// 9. KPIs
children.push(H1("9.  What \"Proof in 3 Months\" Looks Like"));
children.push(P("Aim the whole group at a small set of numbers a partner or investor would recognise. Track them per brand on one dashboard:"));
children.push(bullet([run("Revenue & growth curve",{bold:true}),run(" — monthly revenue per brand and a clean, up-and-to-the-right trend.")]));
children.push(bullet([run("ROAS & CAC",{bold:true}),run(" — blended and per-channel; the story is CAC falling as creative and retention improve.")]));
children.push(bullet([run("AOV & contribution margin",{bold:true}),run(" — true profit after COGS, ads and RTO, per SKU/brand.")]));
children.push(bullet([run("Repeat-purchase rate & LTV",{bold:true}),run(" — proof the retention flows work.")]));
children.push(bullet([run("RTO rate",{bold:true}),run(" — trending down; critical for apparel margin.")]));
children.push(bullet([run("Pipeline proof",{bold:true}),run(" — corporate-gifting deals and events booked; Arihant's first external clients.")]));
children.push(P([run("A caution on the target: ",{italics:true}),run("\"crore-crore in three months\" is the right ambition and the right direction, but for brands starting from a thin base, ninety days is realistically about building the machine and proving the curve — not banking crores in month three. The honest, powerful proof is a steep, documented growth trajectory plus healthy unit economics. That is what turns three young brands into a fundable, scalable group.",{italics:true})]));

// 10. RISKS
children.push(H1("10.  Risks & Mitigations"));
children.push(table([2600,6400],[
  [{t:"Risk"},{t:"Mitigation"}],
  [{t:"Loop In Events name/domain owned by a Canadian firm",bold:true,bg:"FFF3C4"},{t:"Rebrand now (young brand = cheap change), IP-India search, secure domain + handles, then trademark. Month-1 priority."}],
  [{t:"'Aurra/Aura' is crowded in apparel",bold:true},{t:"Distinctive visual identity + trademark; lean on the 'Hype/drop' positioning to stand apart."}],
  [{t:"Founder/engine over-extension across 3 brands",bold:true},{t:"The phased roadmap sequences work; automations and SOPs remove manual load; hire in Month 2–3."}],
  [{t:"Apparel RTO & COD losses",bold:true},{t:"RTO risk-flagging, COD verification (GoKwik/Shiprocket), push prepaid via incentives."}],
  [{t:"Thin margins on quick-commerce",bold:true},{t:"Treat Blinkit/Zepto as a Month-3 pilot only, on high-margin SKUs; own D2C stays the priority channel."}],
  [{t:"Inconsistent brand presence today",bold:true},{t:"Content engine + calendars + design subscription create consistent, professional output from week one."}],
]));

// 11. NEXT ACTIONS
children.push(H1("11.  Immediate Next Actions (This Week)"));
children.push(bullet("Run IP India public searches (wordmark + phonetic) for a new Loop In name and for Aurra Hype & Designomics marks; shortlist and lock a new Loop In name + domain + handles."));
children.push(bullet("Engage a CA + IP attorney: confirm entity structure/GST across brands and start trademark filings."));
children.push(bullet("Stand up the tech backbone: Shopify + WhatsApp Business API + payments + GA4 + n8n, connected."));
children.push(bullet("Brief the content pod and shoot Aurra Hype's catalog ahead of the 12 July store launch; plan the launch as a filmed, PR-able event (run by Loop In)."));
children.push(bullet("Design and order branded packaging; finalise apparel + DTG/DTF and merch suppliers."));
children.push(bullet("Switch on always-on Meta ads for Aurra Hype to set the ROAS baseline."));
children.push(spacer(120));
children.push(P([run("Companion file: ",{bold:true}),run("Harshdeep_Group_Stack.xlsx — the full stack, AI-automation catalogue, week-by-week roadmap, live budget and channel tracker. Use this document for the why and the sequence; use the spreadsheet to execute and track.",{italics:true})]));

// ---------- DOC ----------
const doc = new Document({
  creator:"Harshdeep Group", title:"Harshdeep Group — 90-Day Scale Engine",
  features:{updateFields:true},
  numbering:{ config:[{
    reference:"bl",
    levels:[
      {level:0, format:LevelFormat.BULLET, text:"•", alignment:AlignmentType.LEFT, style:{run:{color:ORANGE}, paragraph:{indent:{left:360,hanging:220}}}},
      {level:1, format:LevelFormat.BULLET, text:"–", alignment:AlignmentType.LEFT, style:{paragraph:{indent:{left:720,hanging:220}}}}
    ]}]},
  styles:{ default:{ document:{ run:{font:FONT, size:21, color:"222222"} } } },
  sections:[{
    properties:{ page:{ margin:{top:1080, bottom:1080, left:1200, right:1200} } },
    headers:{ default: new Header({children:[new Paragraph({alignment:AlignmentType.RIGHT, spacing:{after:0}, children:[new TextRun({text:"Harshdeep Group — 90-Day Scale Engine", font:FONT, size:15, color:"9AA1AC"})]})]}) },
    footers:{ default: new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER, children:[new TextRun({text:"Confidential  ·  ", font:FONT, size:15, color:"9AA1AC"}), new TextRun({children:["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES], font:FONT, size:15, color:"9AA1AC"})]})]}) },
    children
  }]
});
Packer.toBuffer(doc).then(function(b){ fs.writeFileSync("/sessions/bold-epic-ramanujan/mnt/outputs/Harshdeep_Group_Growth_Strategy.docx", b); console.log("DOCX written OK"); });
