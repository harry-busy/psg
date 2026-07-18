/**
 * Studio reference images created by our creative team, served from
 * public/references. ref1..ref11 are png, ref12..ref16 are jpeg. Update this
 * one list when new references are added and every page picks them up.
 */
export const REFERENCE_IMAGES: string[] = [
  ...Array.from({ length: 11 }, (_, i) => `/references/ref${i + 1}.png`),
  ...Array.from({ length: 5 }, (_, i) => `/references/ref${i + 12}.jpeg`),
];
