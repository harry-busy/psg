import { Card, CardTitle } from "@/components/ui";
import { Sparkles } from "lucide-react";
import { REFERENCE_IMAGES as REFS } from "@/lib/references";

/**
 * Studio reference gallery - real jewellery shots created by our creative team,
 * shown across every creator/studio page as the quality bar and inspiration.
 * Image list lives in lib/references.ts (public/references).
 */

export function ReferenceGallery({ className = "" }: { className?: string }) {
  return (
    <Card className={`mt-5 ${className}`}>
      <CardTitle className="flex items-center gap-2">
        <Sparkles size={16} className="text-[var(--color-crimson)]" /> References from our studio team
      </CardTitle>
      <p className="-mt-2 mb-4 text-sm text-[var(--color-muted)]">
        Real studio and on-model jewellery shots created by our creative team, the calibre every image here aims for.
        Tap any reference to view it full size.
      </p>
      <div className="rounded-2xl bg-black p-3 sm:p-4">
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
          {REFS.map((src, i) => (
            <a
              key={src}
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="group mb-3 block break-inside-avoid overflow-hidden rounded-xl border border-white/10 bg-black"
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
    </Card>
  );
}
