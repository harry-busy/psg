import zipfile, re, os, json, shutil, posixpath
from collections import Counter

REPORTS = [
 ("Diyam/diyamppt/Instagram_diyamhouseofsilver_18_Jun_2026_17_Jul_2026_2499.pptx",
   "diyam-social-report","instagram","Diyam - Instagram Social Report","Diyam House of Silver",None,
   "Social Report","18 Jun 2026 - 17 Jul 2026","18 May 2026 - 17 Jun 2026","own"),
 ("Diyam/diyamppt/Instagram_diyamhouseofsilver_18_Jun_2026_17_Jul_2026_2499 (1).pptx",
   "diyam-instagram-report","instagram","Diyam - Instagram Report (Socialinsider)","Diyam House of Silver",None,
   "Instagram Report","18 Jun 2026 - 17 Jul 2026","19 May 2026 - 17 Jun 2026","own"),
 ("Diyam/diyamppt/Compare_DIYAM_HOUSE_OF_SILVER_OnnMe_18_Jun_2026_17_Jul_2026_f381.pptx",
   "compare-onnme","compare","Diyam vs OnnMe","Diyam House of Silver","OnnMe",
   "Comparison Report","18 Jun 2026 - 17 Jul 2026",None,"compare"),
 ("Diyam/diyamppt/Compare_DIYAM_HOUSE_OF_SILVER_Psg_Gold_18_Jun_2026_17_Jul_2026_05ca.pptx",
   "compare-psg-gold","compare","Diyam vs PSG Gold","Diyam House of Silver","PSG Gold",
   "Comparison Report","18 Jun 2026 - 17 Jul 2026",None,"compare"),
 ("Diyam/ppts/Compare_DIYAM_HOUSE_OF_SILVER_Giri_Zever_Mahal_20_Jun_2026_19_Jul_2026_1185.pptx",
   "compare-giri-zever-mahal","compare","Diyam vs Giri Zever Mahal","Diyam House of Silver","Giri Zever Mahal",
   "Comparison Report","20 Jun 2026 - 19 Jul 2026",None,"compare"),
 ("Diyam/ppts/Compare_DIYAM_HOUSE_OF_SILVER_SILVANA_20_Jun_2026_19_Jul_2026_218b.pptx",
   "compare-silvana","compare","Diyam vs SILVANA","Diyam House of Silver","SILVANA",
   "Comparison Report","20 Jun 2026 - 19 Jul 2026",None,"compare"),
 ("Diyam/ppts/Compare_DIYAM_HOUSE_OF_SILVER_Tiffany_Co_20_Jun_2026_19_Jul_2026_b262.pptx",
   "compare-tiffany-co","compare","Diyam vs Tiffany & Co","Diyam House of Silver","Tiffany & Co",
   "Comparison Report","20 Jun 2026 - 19 Jul 2026",None,"compare"),
 ("Diyam/ppts/Instagram_girizevermahal_1990_20_Jun_2026_19_Jul_2026_6497.pptx",
   "ig-giri-zever-mahal","instagram","Giri Zever Mahal - Instagram Report","Giri Zever Mahal (@girizevermahal_1990)",None,
   "Instagram Report","20 Jun 2026 - 19 Jul 2026","20 May 2026 - 19 Jun 2026","competitor"),
 ("Diyam/ppts/Instagram_pukhrajjewells_silverngp_20_Jun_2026_19_Jul_2026_3887.pptx",
   "ig-pukhraj-jewells","instagram","Pukhraj Jewells Silver - Instagram Report","Pukhraj Jewells Silver (@pukhrajjewells_silverngp)",None,
   "Instagram Report","20 Jun 2026 - 19 Jul 2026","20 May 2026 - 19 Jun 2026","competitor"),
 ("Diyam/ppts/Instagram_tiffanyandco_20_Jun_2026_19_Jul_2026_0943.pptx",
   "ig-tiffany-co","instagram","Tiffany & Co - Instagram Report","Tiffany & Co (@tiffanyandco)",None,
   "Instagram Report","20 Jun 2026 - 19 Jul 2026","20 May 2026 - 19 Jun 2026","competitor"),
]

PUB = "public/diyam-reports"
if os.path.exists(PUB): shutil.rmtree(PUB)
os.makedirs(PUB, exist_ok=True)

ENT = [("&amp;","&"),("&lt;","<"),("&gt;",">"),("&quot;",'"'),("&#10;","\n"),("&apos;","'")]

def paras_text(xml):
    lines = []
    for p in re.split(r'<a:p\b', xml):
        texts = re.findall(r'<a:t>(.*?)</a:t>', p, re.S)
        if texts:
            line = ''.join(texts)
            for a,b in ENT: line = line.replace(a,b)
            line = line.strip()
            if line: lines.append(line)
    return lines

def slide_image_rels(z, slide_name):
    rels_name = "ppt/slides/_rels/" + os.path.basename(slide_name) + ".rels"
    mapping = {}
    if rels_name in z.namelist():
        rxml = z.read(rels_name).decode('utf-8','ignore')
        for m in re.finditer(r'Id="([^"]+)"[^>]*Target="([^"]+)"', rxml):
            rid, tgt = m.group(1), m.group(2)
            if 'media/' in tgt:
                mapping[rid] = posixpath.normpath("ppt/slides/" + tgt)
    return mapping

def process(path, slug):
    z = zipfile.ZipFile(path)
    names = z.namelist()
    slide_files = sorted([n for n in names if re.match(r'ppt/slides/slide\d+\.xml$', n)],
                         key=lambda n: int(re.search(r'(\d+)', n.split('/')[-1]).group(1)))
    per_slide_media = []
    for sf in slide_files:
        sx = z.read(sf).decode('utf-8','ignore')
        relmap = slide_image_rels(z, sf)
        media = []
        for rid in re.findall(r'r:embed="([^"]+)"', sx):
            if rid in relmap and relmap[rid] not in media:
                media.append(relmap[rid])
        per_slide_media.append(media)
    nslides = len(slide_files)
    cnt = Counter()
    for ms in per_slide_media:
        for m in set(ms): cnt[m] += 1
    chrome = {m for m,c in cnt.items() if c >= max(3, int(nslides*0.6))}
    outdir = os.path.join(PUB, slug)
    os.makedirs(outdir, exist_ok=True)
    urlmap = {}
    for m in cnt:
        if m in chrome or m not in names: continue
        fn = posixpath.basename(m)
        with open(os.path.join(outdir, fn), 'wb') as fh:
            fh.write(z.read(m))
        urlmap[m] = "/diyam-reports/" + slug + "/" + fn
    slides = []
    for i, sf in enumerate(slide_files):
        lines = paras_text(z.read(sf).decode('utf-8','ignore'))
        imgs = [urlmap[m] for m in per_slide_media[i] if m in urlmap]
        slides.append({"n": i+1, "lines": lines, "images": imgs})
    return slides

out = []
for (path, slug, kind, title, subject, competitor, style, period, cmp, group) in REPORTS:
    slides = process(path, slug)
    out.append({"slug":slug,"kind":kind,"title":title,"subject":subject,"competitor":competitor,
                "style":style,"period":period,"comparePeriod":cmp,"group":group,
                "filename":os.path.basename(path),"nslides":len(slides),"slides":slides})
    print(slug, "slides:", len(slides), "imgs:", sum(len(s["images"]) for s in slides))

header = (
"// AUTO-GENERATED from Diyam/diyamppt & Diyam/ppts PPTX decks - do not edit by hand.\n"
"// Slide text is verbatim from each deck; images are the decks' own graphs/thumbnails\n"
"// copied to /public/diyam-reports/<slug>/. Regenerate via .ppt_extract/gen_reports.py.\n\n"
"export interface ReportSlide { n: number; lines: string[]; images: string[]; }\n"
"export interface DiyamReport {\n"
"  slug: string; kind: 'instagram' | 'compare'; title: string; subject: string;\n"
"  competitor: string | null; style: string; period: string; comparePeriod: string | null;\n"
"  group: 'own' | 'compare' | 'competitor'; filename: string; nslides: number; slides: ReportSlide[];\n}\n\n"
"export const DIYAM_REPORTS: DiyamReport[] = "
)
ts = header + json.dumps(out, ensure_ascii=False, indent=1) + \
";\n\nexport function diyamReport(slug: string): DiyamReport | undefined {\n  return DIYAM_REPORTS.find((r) => r.slug === slug);\n}\n"
with open("lib/diyam/reports.generated.ts","w",encoding="utf-8") as f:
    f.write(ts)
print("wrote lib/diyam/reports.generated.ts", len(ts), "bytes")
