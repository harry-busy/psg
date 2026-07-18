import { REFERENCE_IMAGES } from "@/lib/references";

/**
 * Studio reference gallery themed for the crimson+cream client blueprint pages
 * (PSG Gold, Vardhman, Diyam, Padmavathi). Shows the real jewellery visuals our
 * creative team produces. Self-contained section so it drops into any pitch page.
 */
const RED = "#D2042D";
const CREAM_2 = "#e0d9c6";
const GOLD = "#b8860b";
const GOLD_SOFT = "#c9a227";

export function StudioReferences() {
  return (
    <section className="px-5 py-16 sm:px-6 sm:py-24" style={{ background: "#EBE5D5", color: "#1d1d1f" }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: GOLD }}>
          Content our studio team creates
        </div>
        <h2 className="max-w-3xl font-display text-[clamp(1.5rem,4.6vw,2.9rem)] font-semibold leading-[1.14] tracking-tight" style={{ color: RED }}>
          Reference shots, crafted by our team.
        </h2>
        <div className="my-6 h-[3px] w-16 rounded-full" style={{ background: `linear-gradient(90deg, ${GOLD_SOFT}, transparent)` }} />
        <p className="max-w-3xl text-base leading-relaxed sm:text-lg" style={{ color: "#4a3b33" }}>
          Real studio and on-model jewellery visuals produced by our creative team, the calibre of content that runs
          across your feed, ads and catalog. Tap any image to view it full size.
        </p>
        <div className="mt-8 columns-2 gap-3 sm:columns-3 lg:columns-4">
          {REFERENCE_IMAGES.map((src, i) => (
            <a
              key={src}
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="group mb-3 block break-inside-avoid overflow-hidden rounded-xl border shadow-[0_10px_30px_-20px_rgba(60,10,25,0.4)]"
              style={{ borderColor: `${GOLD}33`, background: CREAM_2 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Studio reference ${i + 1} by our creative team`}
                loading="lazy"
                className="w-full transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
