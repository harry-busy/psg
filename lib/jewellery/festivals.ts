/** Indian jewellery festival calendar with T-minus campaign planning. */

export interface Festival {
  name: string;
  d2026: string;
  d2027: string;
  approx: boolean; // lunar - verify near date
  major: boolean; // gold-major buying day
  why: string;
  ideas: [string, string, string];
}

export const FESTIVALS: Festival[] = [
  { name: "Makar Sankranti / Pongal", d2026: "2026-01-14", d2027: "2027-01-15", approx: false, major: false, why: "South-Indian harvest gifting; coins & light jewellery move well.", ideas: ["Coin & light-jewellery gift guide reel", "'New beginnings' offer post", "Festive till decor + team greeting story"] },
  { name: "Valentine's Day", d2026: "2026-02-14", d2027: "2027-02-14", approx: false, major: false, why: "Couples gifting - pendants, rings, bracelets at accessible prices.", ideas: ["'Say it in gold' pendant reel", "Couple-story UGC contest", "DM-to-order Valentine's catalog broadcast"] },
  { name: "Ugadi / Gudi Padwa", d2026: "2026-03-19", d2027: "2027-04-08", approx: false, major: true, why: "New year - auspicious gold buying day in home market.", ideas: ["Ugadi wishes + new-collection teaser", "'Start the year with gold' offer", "Traditional styling reel in local language"] },
  { name: "Akshaya Tritiya", d2026: "2026-04-21", d2027: "2027-05-08", approx: false, major: true, why: "THE biggest gold-buying day of the year - plan 3 weeks ahead.", ideas: ["Countdown series (T-14/T-7/T-2)", "Pre-booking offer + free insured delivery", "Live gold-rate + muhurat-timing posts"] },
  { name: "Mother's Day", d2026: "2026-05-10", d2027: "2027-05-09", approx: false, major: false, why: "Emotional gifting - mangalsutra, earrings, 'for amma' angle.", ideas: ["'For Amma' storytelling reel", "Mother-daughter matching sets", "Customer mother-story UGC"] },
  { name: "Varamahalakshmi", d2026: "2026-08-21", d2027: "2027-08-13", approx: true, major: true, why: "Lakshmi festival - strong traditional jewellery demand.", ideas: ["Lakshmi-pooja jewellery guide", "Temple-jewellery collection showcase", "Festive booking broadcast to VIP list"] },
  { name: "Raksha Bandhan", d2026: "2026-08-28", d2027: "2027-08-17", approx: true, major: false, why: "Sibling gifting - bracelets, chains, silver rakhi.", ideas: ["Silver rakhi + bracelet catalog", "'Gift her gold this Rakhi' reel", "Brother-sister offer bundle"] },
  { name: "Onam", d2026: "2026-08-26", d2027: "2027-09-14", approx: true, major: false, why: "Kerala customers & diaspora - traditional gold demand.", ideas: ["Kasavu + gold styling reel", "Onam wishes + light-jewellery offers", "NRI shipping highlight post"] },
  { name: "Navratri / Dussehra", d2026: "2026-10-11", d2027: "2027-09-30", approx: false, major: true, why: "9-day festive window; Vijayadashami is an auspicious buying day.", ideas: ["9 days × 9 styles reel series", "Dussehra muhurat buying post", "Garba-ready jewellery edits"] },
  { name: "Karva Chauth", d2026: "2026-10-29", d2027: "2027-10-18", approx: true, major: false, why: "North-Indian gifting moment for husbands → wives.", ideas: ["Gifting guide for husbands", "Mangalsutra & bangle showcase", "Pre-order broadcast"] },
  { name: "Dhanteras", d2026: "2026-11-06", d2027: "2027-10-26", approx: true, major: true, why: "Second-biggest gold day - wealth-buying tradition; manage queues!", ideas: ["T-10 countdown + pre-booking", "Coins/bars + lightweight catalog", "Extended-hours + live rate updates"] },
  { name: "Diwali / Lakshmi Puja", d2026: "2026-11-08", d2027: "2027-10-28", approx: false, major: true, why: "Peak festive gifting; follow Dhanteras momentum through the week.", ideas: ["Family-gifting lookbook", "Diwali dhamaka offer reel", "Thank-you + review request post-festival"] },
  { name: "Wedding Season (Nov-Feb)", d2026: "2026-11-15", d2027: "2027-11-15", approx: true, major: true, why: "Bridal sets = biggest tickets; nurture brides 3-6 months ahead.", ideas: ["Bridal lookbook series", "Real-bride testimonial reels", "Bridal appointment booking campaign"] },
  { name: "Christmas & New Year", d2026: "2026-12-25", d2027: "2027-12-25", approx: false, major: false, why: "Year-end gifting + NRI visits home.", ideas: ["Year-end gift guide", "NRI 'back home' shopping post", "New-year new-gold teaser"] },
];

export function festivalDate(f: Festival, year: "2026" | "2027") {
  return year === "2026" ? f.d2026 : f.d2027;
}

export function minusDays(date: string, n: number) {
  const x = new Date(date + "T00:00");
  x.setDate(x.getDate() - n);
  return x;
}

export function fmtShort(date: string) {
  return new Date(date + "T00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** Build an .ics calendar for a year's campaigns (T-14 / T-7 / T-2 / day). */
export function buildICS(year: "2026" | "2027", onlyMajor = false): string {
  let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Ospyr Jewellery OS//EN\n";
  FESTIVALS.filter((f) => !onlyMajor || f.major).forEach((f) => {
    const date = festivalDate(f, year);
    (
      [
        [0, `${f.name} - festival day`],
        [14, `${f.name} - start teasers`],
        [7, `${f.name} - main campaign push`],
        [2, `${f.name} - final reminder`],
      ] as [number, string][]
    ).forEach(([n, title]) => {
      const ds = minusDays(date, n).toISOString().slice(0, 10).replace(/-/g, "");
      ics += `BEGIN:VEVENT\nDTSTART;VALUE=DATE:${ds}\nSUMMARY:${title}\nDESCRIPTION:${f.ideas.join(" | ")}\nEND:VEVENT\n`;
    });
  });
  return ics + "END:VCALENDAR";
}
