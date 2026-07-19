import json, os

SRC = "Diyam/content"
META = [
  ("00_START_HERE_Diyam_Content_Machine.md", "start-here", "Start Here — The Content Machine", "Master index, brand snapshot, assumptions & how to run the 30-day system."),
  ("01_Positioning_and_Brand_Strategy.md", "positioning", "Positioning & Brand Strategy", "Who Diyam is, the audience, the voice, the visual identity and the two content engines."),
  ("02_30_Day_Content_Calendar.md", "calendar", "30-Day Content Calendar", "The core deliverable — every day mapped: Reel / post / stories, hooks, scripts, shot lists, captions, hashtags, CTAs."),
  ("03_Instagram_Features_and_Product_Tagging_Guide.md", "instagram-features", "Instagram Features & Product Tagging Guide", "Step-by-step: product tags in Reels, Shopping, Trial Reels, AI auto-translation and every 2026 business feature."),
  ("04_PR_Positioning_and_Growth_Plan.md", "pr-growth", "PR Positioning & Growth Plan", "PR angle, influencer/collab plan, the UGC engine, local Jayanagar/Bangalore activations and ORM."),
  ("05_Caption_Hook_and_Hashtag_Bank.md", "captions-hashtags", "Caption, Hook & Hashtag Bank", "Reusable hooks, caption templates and ready hashtag sets to copy-paste daily."),
]

docs = []
for i, (fn, slug, title, desc) in enumerate(META):
    with open(os.path.join(SRC, fn), encoding="utf-8") as f:
        md = f.read()
    docs.append({"num": f"{i:02d}", "slug": slug, "title": title, "desc": desc, "filename": fn, "markdown": md})

header = (
"// AUTO-GENERATED from Diyam/content/*.md — do not edit by hand.\n"
"// Regenerate via /tmp/gen_content.py. Markdown is verbatim, character-for-character.\n\n"
"export interface DiyamDoc {\n"
"  num: string;\n  slug: string;\n  title: string;\n  desc: string;\n  filename: string;\n  markdown: string;\n}\n\n"
"export const DIYAM_DOCS: DiyamDoc[] = "
)
body = json.dumps(docs, ensure_ascii=False, indent=2)
out = header + body + ";\n\n" + \
"export function diyamDoc(slug: string): DiyamDoc | undefined {\n" \
"  return DIYAM_DOCS.find((d) => d.slug === slug);\n}\n"

os.makedirs("lib/diyam", exist_ok=True)
with open("lib/diyam/content.generated.ts", "w", encoding="utf-8") as f:
    f.write(out)
print("wrote lib/diyam/content.generated.ts,", len(out), "bytes,", len(docs), "docs")
# sanity: ensure total md chars preserved
print("total md chars:", sum(len(d["markdown"]) for d in docs))
