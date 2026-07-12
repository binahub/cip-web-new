# Prompt: Implement Homepage (Desktop-7) — mehrabad CIP lounge

## ⚠️ Read this first
You are implementing **one page** — the homepage — inside an **existing Next.js boilerplate**. Do not scaffold a new project, do not change the folder structure, and do not add packages beyond what's explicitly listed below. Match the existing project conventions exactly.

The boilerplate was built with this spec (for your context on conventions/folder structure — follow it exactly, don't reinvent it):

- Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS v4 (CSS-first, `@theme` in `globals.css`, no `tailwind.config.js`)
- npm only
- No UI kit (no MUI/Ant/shadcn/Chakra) — plain Tailwind + hand-built primitives
- TanStack Query v5 for server state (not needed for this static page, but don't break existing providers)
- Folder structure (already exists in the project, use it, don't invent new top-level folders):
  ```
  src/
    app/                 # routing only, no component definitions
    services/            # api-client.ts + per-service queries/mutations/types
    components/
      ui/                # generic, domain-agnostic primitives (Button, Card, Badge, Input, IconButton...)
      layout/             # app-wide structural pieces (Header, Footer, Nav)
      home/                # components used only by the homepage (create this folder)
    hooks/
    providers/
    lib/
    types/
    config/
  ```

Route: implement this as `src/app/page.tsx` (the homepage/root route), composed from components in `src/components/home/`, `src/components/layout/`, and `src/components/ui/`.

**Font**: The project fonts are already registered globally — do not import or load any fonts yourself. Instead, map the Figma font family names below to whatever font-family tokens/CSS variables already exist in the project for each of these (ask me to confirm the mapping if the token names aren't obvious from `globals.css`):
- `Yekan Bakh` — Regular / SemiBold / Bold / ExtraBold weights (primary Farsi UI font — body text, nav, buttons, most headings)
- `Yekan Bakh VF` — Regular (used only for the small "مشاهده جزئیات" card CTA label)
- `Kavo Serif` — Black Styled / Light Styled (used only for the "mehrabad CIP lounge" brand wordmark, header + hero)
- `Rokh` — Medium (used only for the Farsi subheading under the brand wordmark in the hero)
- `Inter` — Regular (used only for the English "VIP Services" / "CIP Services" badge labels)

**Language/direction**: All Farsi text must render RTL (`dir="rtl"` at the appropriate container level — check how the boilerplate's root layout already handles this; if it doesn't set `dir="rtl"` globally yet, set it in `app/layout.tsx` on `<html>`, since this whole product is Farsi-first). English badge labels (`VIP Services`, `CIP Services`) stay LTR inline within the RTL flow — use `dir="auto"` or an explicit `dir="ltr"` span for those, matching the reference markup below.

**Design source**: Figma file `CIP-mehr`, frame "Desktop - 7" (fileKey `kGjukZGwgrmmUPx2jBfR7g`, node `73:2448`), 1440px desktop artboard. Build **desktop-first, pixel-perfect at 1440px**, then make it reasonably responsive down to mobile using the same design language (stack sections, fluid widths) since exact mobile specs weren't provided — use your judgment there and flag assumptions.

---

## 1. Icons — use `iconsax-react`, do NOT hardcode `<img>` src to Figma URLs

The design uses the **Vuesax/Iconsax** icon set (layer names like `vuesax/linear/location`, `vuesax/bulk/user`). Install the matching npm package:

```bash
npm install iconsax-react
```

Map icons like this (component name → Figma layer):
| Figma layer | iconsax-react import | Used in |
|---|---|---|
| `vuesax/bulk/user` | `User` (variant="Bulk") | header login pill |
| `vuesax/linear/arrow-down` | `ArrowDown` (variant="Linear") | header nav dropdown, search selects |
| `vuesax/linear/profile-2user` | `Profile2User` | hero search "مسافران" field |
| `vuesax/linear/calendar` | `Calendar` | hero search "تاریخ پرواز" field |
| `vuesax/linear/location` | `Location` | hero search "فرودگاه" field |
| `vuesax/bulk/shield` | `Shield` (Bulk) | feature: "آرامش قبل از پرواز" |
| `vuesax/bulk/headphone` | `Headphone` (Bulk) | feature: "VIP سفر کنید" |
| `vuesax/bulk/microscope` | `Microscope` (Bulk) | feature: "پرواز بدون معطلی" |
| `vuesax/linear/routing` | `Routing` | lounge showcase card |
| `vuesax/linear/map` | `Map1` | lounge showcase card |
| `vuesax/linear/tree` | `Tree` | lounge showcase card |
| `vuesax/linear/add-square` | `AddSquare` | blog "ادامه مطلب" button |
| crown icon (badge) | closest iconsax `Crown1` (Bold/Bulk) | "VIP Services" badge |
| diamond icon (badge) | closest iconsax `DiamondsIcon`/`Diamonds` | "CIP Services" badge |

If `iconsax-react` doesn't have an exact 1:1 match for the crown/diamond badge icons, use the visually closest bold/filled variant and flag it to me rather than guessing silently.

## 2. Images — placeholders needed, real assets to follow

The design references several **raster photo assets** (AI-generated lounge photography) and **decorative background blurs** that live only inside the Figma file and aren't something I can hand you as static SVG. Do NOT point `<Image>` `src` at any `figma.com/api/mcp/asset/...` URL — those are temporary and will already be dead by the time you build this. Instead:

- Use `next/image` with a local placeholder (solid dark gradient div, or a placeholder image of matching aspect ratio) for now, sized exactly per the specs below, with a `// TODO: replace with exported asset from Figma` comment.
- I will export and drop the real files into `public/images/home/` myself afterward — name the placeholder files predictably (e.g. `lounge-1.jpg`, `lounge-2.jpg`, `lounge-3.jpg`, `lounge-4.jpg`, `hero-bg-glow.png`, `lounge-map.png`, `logo-mark.svg`) so swapping is a find-and-replace.

Required images (exact box sizes, all `object-fit: cover` unless noted):
1. **Logo mark** — small icon-only logomark, ~76×77px in hero, ~40×40px in header (same mark, two sizes) — likely exportable as SVG once you have file access; placeholder: simple circular/abstract mark.
2. **4× service photo cards** (lounge photography), each card is 416×405px with the photo occupying the bottom ~225px band inside a rounded 24px container, dark gradient overlay fading the photo into the card's near-black background (`rgba(13,16,18,0.85)`) — see section 4.2 for exact card anatomy.
3. **Lounge map/floorplan image** — inside the "خدمات سی آی پی" showcase card, roughly 900×365px, masked/cropped into a 566×454px rounded container.
4. **Background decorative glow(s)** — two large soft blurred ellipse shapes behind the whole hero (a warm mauve/rose glow top-left and a matching one lower-center). These are purely decorative — recreate with CSS (radial-gradient blur) rather than an image if easier; approximate colors: warm rose (`#c9ada7`-family) glow at very low opacity over black.

---

## 3. Design tokens (extracted from Figma — use these exact values)

### Colors
```
--color-bg:                #000000   (page background, pure black)
--color-text-primary:      #ffffff
--color-text-hero:         #f2e9e4   (brand wordmark + hero subheading, warm off-white)
--color-text-secondary:    #969696   (body copy, descriptions)
--color-text-muted:        #979dac   (header nav links)
--color-text-price-label:  #555555   (price unit/qualifier text)
--color-accent:             #c9ada7   (primary brand accent — dusty rose; CTA text, buttons, price-card bg)
--color-badge-bg:           rgba(34, 34, 59, 0.6)     (#22223b @ 60% — "VIP/CIP Services" pill bg)
--color-header-bg:          rgba(23, 28, 31, 0.47)     (sticky header bar bg, glass effect)
--color-search-card-bg:     rgba(23, 28, 31, 0.6)      (hero search bar container bg)
--color-card-bg-subtle:     rgba(23, 28, 31, 0.3)      (secondary translucent cards)
--color-photo-card-bg:      rgba(13, 16, 18, 0.85)     (service photo card bg, near-black)
--color-login-pill-bg:      rgba(201, 173, 167, 0.14)  (accent @ 14%)
--color-cta-pill-bg:        rgba(201, 173, 167, 0.16)  ("مشاهده جزئیات" button bg, accent @ 16%)
--color-border-input:       #969696                    (search field borders)
```
All of these should become Tailwind v4 `@theme` tokens (e.g. `--color-accent: #c9ada7;`) in `globals.css` if equivalent tokens don't already exist in the boilerplate — check first, extend rather than duplicate.

### Typography scale (font-size / line-height / weight / color / family — as used)
| Role | Size | Line-height | Family/Weight | Color |
|---|---|---|---|---|
| Brand wordmark ("mehrabad CIP lounge") | 32px | 1.808 | Kavo Serif, Black Styled | `#f2e9e4` |
| Hero subheading ("سی آی پی فرودگاه مهرآباد") | 20px | 1.808 | Rokh, Medium | `#f2e9e4` |
| Nav overlay title ("خدمات جایگاه تشریفات") | 24px | 1.808 | Yekan Bakh Bold | white |
| Section/card title (e.g. "لانژ اضافه مسافران", "خدمات سی آی پی") | 24px | 1.808 | Yekan Bakh Bold | white |
| Feature title (e.g. "پرواز بدون معطلی") | 20px | 1.808 | Yekan Bakh SemiBold | white |
| Feature description | 14px | 1.808 | Yekan Bakh Regular | `#969696` |
| Blog heading (mixed weight inline) | 41px | 1.453 | Yekan Bakh Regular + ExtraBold span | white |
| Blog body copy | 14px | 1.808 | Yekan Bakh Regular | `#969696` |
| Header nav links ("خدمات" / "وبلاگ") | 16px | 1.808 | Yekan Bakh Regular | `#979dac` |
| Login pill label ("ورود / ثبت نام") | 14px | 1.808 | Yekan Bakh SemiBold | `#c9ada7` |
| Card CTA ("مشاهده جزئیات") | 12px | 22px | Yekan Bakh VF Regular | `#c9ada7` |
| Blog CTA ("ادامه مطلب") | 14px | 1.808 | Yekan Bakh SemiBold | `#c9ada7` |
| Badge pill text ("VIP Services"/"CIP Services") | 12px | normal | Inter Regular | white |
| Price (large number) | 20px | — | Yekan Bakh Bold | white |
| Price unit/qualifier ("تومان" / "قیمت از") | 12px | — | Yekan Bakh Regular | `#555555` |
| Hero search field label | 16px | 1.808 | Yekan Bakh Regular | `#969696` |

### Spacing / radius
- Page horizontal padding: `72px` at 1440px width (i.e. content max-width ≈ 1296px, centered)
- Header bar: height `72px`, `rounded-2xl` (16px), full content width, glassy translucent bg + subtle blur (`backdrop-blur`) since bg is semi-transparent over the hero glow
- Card radius: mostly `24px`; small pill buttons/tags: `10–16px`; login pill/CTA buttons: `12px`
- Section gaps: hero search bar sits ~`24px` below the header divider line; photo-card grid uses `24px`(ish, derive from x-deltas: cards start at x=72, 512, 952 → **~24px gutter**, card width `416px`) gaps, 2 rows with `~24px` vertical gap (top=706 and top=1135 → gap ≈ 24px after 405px card height... actually 1135-706-405=24px, confirmed)

---

## 4. Section-by-section breakdown

Build each of these as a component in `src/components/home/`, composed together in `src/app/page.tsx`. Shared primitives (Button, Badge, Card, IconButton, SearchField) go in `src/components/ui/`; the sticky header goes in `src/components/layout/Header.tsx`.

### 4.1 `Header` (`components/layout/Header.tsx`)
Full-width translucent bar, `72px` tall, rounded, sits inside the `72px` page gutter, over the background glow.
- **Left side** (RTL-first, so this is visually first from the right... follow exact Figma positions, don't just mirror blindly): brand wordmark "mehrabad" / "CIP lounge" (two-line, Kavo Serif Black + Light), small logomark icon (~40×40px) to its left.
- **Center-right**: vertical divider line, then nav links "وبلاگ" and "خدمات" (with a dropdown arrow-down icon next to "خدمات"), 16px `#979dac`.
- **Right side**: login pill button — rounded-xl, bg `rgba(201,173,167,0.14)`, icon (`vuesax/bulk/user`) + text "ورود | ثبت نام" in `#c9ada7` 14px SemiBold.

Build this as a reusable `Header` — it's shared across the whole booking flow (I confirmed the same header appears on every other screen in this Figma file), so make it generic/prop-driven now even though only the homepage needs it today.

### 4.2 `Hero` (`components/home/Hero.tsx`)
- Full-bleed background: black, with the two decorative glow blurs (see Section 2, item 4) positioned behind everything else (z-index below content).
- Centered heading block: brand wordmark (32px Kavo Serif) + Farsi subheading (20px Rokh) + small logomark image above/beside it, centered horizontally in the upper hero area.
- Below that: nav-style section title "خدمات جایگاه تشریفات" (24px Bold, centered) — this appears to be a secondary in-page heading, not literal nav.
- **Search bar** (`components/ui/SearchField` × 3, composed in a row inside a translucent rounded container `rgba(23,28,31,0.6)`, height `104px`, radius `24px`):
  1. "مسافران" field with `Profile2User` icon
  2. "تاریخ پرواز" field with `Calendar` icon (has an internal vertical divider before it separating from a "زمان پرواز" label — re-check: the reference shows one segment containing both "زمان پرواز" and "تاریخ پرواز" separated by a thin vertical line, i.e. this middle segment is actually two sub-fields sharing one bordered container)
  3. "فرودگاه" field with `Location` icon + a leading `ArrowDown` chevron (dropdown affordance)
  
  Each field: `flex-1`, bordered (`1px solid #969696`), rounded `16px`, transparent bg, `16px` horizontal padding, `56px`-ish tall, label text `#969696` 16px.
  
  A small accent-colored (`#c9ada7`) rounded card (`173×88px`) sits at the hero's left edge overlapping the search bar row slightly above it, containing small text "بررسی خدمات" (16px ExtraBold, black text on the accent bg) — this reads as a small promo/CTA tile layered over the hero; implement as an absolutely-positioned accent card within the hero's relative container.

### 4.3 `FeatureHighlights` (`components/home/FeatureHighlights.tsx`)
Three feature blurbs laid out in a row under two secondary translucent pill-shaped card backgrounds (these look like decorative background shapes behind the icon+text groups, not literal separate cards — treat the `rgba(23,28,31,0.3)` rounded rectangles as background accents behind each text group). Each item:
- Icon (32×32, Bulk variant): Shield / Headphone / Microscope
- Title (20px SemiBold white): "آرامش قبل از پرواز" / "VIP سفر کنید" / "پرواز بدون معطلی"
- Description (14px Regular `#969696`, ~276–282px wide): exact Farsi copy — pull directly from the reference block in the appendix, don't paraphrase.

### 4.4 `ServiceCategoryGrid` (`components/home/ServiceCategoryGrid.tsx`)
A 3-column × 2-row grid of **6 identical service photo cards** (component: `components/home/ServiceCard.tsx`, reused 6×). Each card, `416×405px`, radius `24px`, bg `rgba(13,16,18,0.85)`:
- Top ~180px: empty/dark (title + price + badges + CTA live here, over the dark bg)
- Two small pill badges near the top: "VIP Services" (crown icon) and "CIP Services" (diamond icon), bg `rgba(34,34,59,0.6)`, `10px` radius, `12px` Inter text, white.
- Title (24px Bold white, centered)
- Price row: large price "۲۳,۱۰۰,۰۰۰" (20px Bold white) + "تومان" (12px `#555`) + "قیمت از" (12px `#555`) — note this repeats the same placeholder price `۲۳,۱۰۰,۰۰۰` across all 6 cards in the source design; keep as static/placeholder data for now, structured so it's trivially swappable for real pricing data later (e.g. a typed `services: ServiceCardData[]` array passed into the grid).
- Small "مشاهده جزئیات" pill button (bg `rgba(201,173,167,0.16)`, `#c9ada7` 12px text, small leading icon)
- Bottom ~225px: photo, masked into the card's rounded bottom, with a dark gradient fade (`linear-gradient(180deg, transparent 4.5%, rgba(13,16,18,0.59) 40%, #0d1012 88%)`) so the photo fades into the card background.

The 6 card titles/content (top row, then bottom row):
1. "لانژ اضافه مسافران"
2. "صندلی چرخدار و بالابر"
3. "خدمات تشریفات"
4. "مشایعت کننده"
5. "پارکینگ مسقف اختصاصی"
6. "لانژ ویژه کادر پرواز"

### 4.5 `LoungeShowcase` (`components/home/LoungeShowcase.tsx`)
A large feature card (~566×490px) titled "خدمات سی آی پی" (24px Bold, right-aligned) containing:
- A rounded photo/map area (bg `rgba(34,34,59,0.53)`, pill-shaped top corners `216.5px` radius) with the lounge floorplan/map image masked inside.
- Three small decorative icon badges overlaid on/near the card edges: `Map1` (40px), `Routing` (36px), `Tree` (24px) in circular colored chips (`#22223b`, white, `#c9ada7` respectively — check exact chip colors against the reference, they use different bg per chip).

### 4.6 `BlogTeaser` (`components/home/BlogTeaser.tsx`)
Right-aligned text block:
- Heading (41px, line-height 1.453, mixed weight — "نکاتی که قبل از" Regular + "سفر های خارج" ExtraBold + "از کشور بهتر است بدانید." Regular, all inline in one paragraph)
- Body copy (14px `#969696`, ~526px wide) — pull exact text from appendix, preserves the bullet list structure (`لذت`, `آرامش`, `کشف و اکتشاف`, `شناخت سایر فرهنگ‌ها و ملل`, `و …`)
- "ادامه مطلب" link/button (bordered, `#c9ada7`, `AddSquare` icon), `141×40px`, radius `12px`

---

## 5. Shared UI primitives to build in `components/ui/`

Since there's no UI kit, build these as clean, typed, reusable primitives (with variants via props, not hardcoded per-instance styling):

- **`Button`** — variants seen: filled accent, bordered/outline accent, ghost pill (small, translucent bg). Support `leadingIcon`/`trailingIcon` props (per the Figma component note: "Leading icons convey meaning, trailing icons indicate affordance of what will happen when you interact with the button").
- **`Badge`** — small pill, icon + label (used for "VIP Services" / "CIP Services").
- **`Card`** — base rounded container with configurable bg/opacity, used as the base for `ServiceCard` and `LoungeShowcase`.
- **`SearchField`** — bordered field with icon + label, used 3× in the hero.
- **`IconButton`** — circular/rounded icon-only button (login pill icon, dropdown chevrons).

Keep these domain-agnostic — no homepage-specific copy or data inside `components/ui/`; all copy/data comes from the `components/home/*` components that consume them.

---

## 6. Acceptance criteria
- Visually matches the Figma "Desktop - 7" frame at 1440px viewport width — spacing, color, type, and copy should match exactly (cross-check against the raw reference export in the appendix below for precise `px` values you're unsure about).
- All Farsi copy is copied verbatim from this prompt / the appendix — do not translate, reword, or "fix" the Persian text.
- No hardcoded Figma asset URLs anywhere in the code.
- Icons come from `iconsax-react`, not inline `<img>` tags pointing at Figma exports.
- Structure follows the boilerplate's `components/ui` / `components/layout` / `components/home` split — no components defined inside `app/`.
- Reasonable responsive behavior below 1440px (your judgment, flagged assumptions welcome) — but desktop pixel-accuracy is the priority for this pass.
- TypeScript strict, no `any`, props typed per component.

If anything below is ambiguous or you're about to guess at a value instead of using what's given, stop and ask rather than inventing spacing/colors.

---

## Appendix — Raw Figma reference export (ground truth for exact positioning/values)

This is the raw MCP-extracted markup for the frame. It uses absolute positioning and literal Figma asset URLs — **do not copy this structure or these URLs as-is**. Use it only as a pixel-value/copy reference while you build the proper flex/grid, componentized, responsive version described above.

```tsx
// NOTE: reference only — image src values are expired Figma export URLs.
// Re-derive actual asset paths per Section 2 of the prompt above.

export default function Desktop7Reference() {
  return (
    <div className="bg-black relative size-full">
      {/* Decorative background glows */}
      <div className="absolute h-[1002px] left-[622px] top-[1740px] w-[1183px]" />{/* ellipse glow, accent color, heavy blur */}
      <div className="absolute h-[1002px] left-[-446px] top-[-409px] w-[2366px]" />{/* ellipse glow, accent color, heavy blur */}

      {/* Header bar */}
      <div className="absolute bg-[rgba(23,28,31,0.47)] h-[72px] left-[72px] rounded-[16px] top-[32px] w-[1296px]" />
      {/* nav: خدمات / وبلاگ + arrow-down, right-aligned inside header */}
      {/* login pill: bg rgba(201,173,167,0.14), rounded-[12px], "ورود | ثبت نام" #c9ada7 14px SemiBold + user icon */}
      {/* brand wordmark "mehrabad" / "CIP lounge" top-left of header, Kavo Serif */}
      {/* vertical divider line inside header */}

      {/* Hero heading */}
      <p className="font-['Kavo_Serif:Black_Styled'] text-[32px] text-[#f2e9e4]">mehrabad CIP lounge</p>
      <p className="font-['Rokh:Medium'] text-[20px] text-[#f2e9e4]">سی آی پی فرودگاه مهرآباد</p>
      <p className="font-['Yekan_Bakh:Bold'] text-[24px] text-white">خدمات جایگاه تشریفات</p>

      {/* Hero search bar — translucent container, 3 field groups */}
      <div className="absolute content-stretch flex gap-[24px] items-start left-[387px] top-[455px] w-[847px]">
        <div className="border border-[#969696] rounded-[16px] px-[16px] flex items-center gap-[8px]">
          <p className="text-[#969696] text-[16px]">مسافران</p>{/* + Profile2User icon */}
        </div>
        <div className="border border-[#969696] rounded-[16px] px-[16px] flex items-center gap-[8px]">
          <p className="text-[#969696] text-[16px]">زمان پرواز</p>
          {/* vertical divider */}
          <p className="text-[#969696] text-[16px]">تاریخ پرواز</p>{/* + Calendar icon */}
        </div>
        <div className="border border-[#969696] rounded-[16px] px-[16px] flex items-center gap-[8px]">
          {/* ArrowDown icon */}
          <p className="text-[#969696] text-[16px]">فرودگاه</p>{/* + Location icon */}
        </div>
      </div>
      {/* small accent promo tile: bg #c9ada7, 173x88px, rounded-[16px], "بررسی خدمات" 16px ExtraBold black */}

      {/* Feature highlights row (3x) */}
      <p className="font-['Yekan_Bakh:SemiBold'] text-[20px] text-white">آرامش قبل از پرواز</p>
      <p className="font-['Yekan_Bakh:Regular'] text-[#969696] text-[14px] w-[276px]">
        در سالن اختصاصی استراحت کنید و پذیرایی شوید؛ دریافت کارت پرواز و ترانسفر تا پای هواپیما با ما.
      </p>
      <p className="font-['Yekan_Bakh:SemiBold'] text-[20px] text-white">VIP سفر کنید</p>
      <p className="font-['Yekan_Bakh:Regular'] text-[#969696] text-[14px] w-[282px]">
        بدون صف و شلوغی از گیت اختصاصی عبور کنید و با خودروی تشریفاتی تا پای پلکان هواپیما بروید.
      </p>
      <p className="font-['Yekan_Bakh:SemiBold'] text-[20px] text-white">پرواز بدون معطلی</p>
      <p className="font-['Yekan_Bakh:Regular'] text-[#969696] text-[14px] w-[276px]">
        صفر تا صد امور پروازی (بار و کارت پرواز) توسط تیم ما؛ شما فقط از بوفه و اینترنت لذت ببرید.
      </p>

      {/* 6x Service photo cards — 3 cols x 2 rows, 416x405px each, 24px gutter */}
      {/* card anatomy: badges (VIP Services / CIP Services), title 24px Bold white,
          price row (20px Bold white "۲۳,۱۰۰,۰۰۰" + 12px #555 "تومان"/"قیمت از"),
          "مشاهده جزئیات" pill CTA (bg rgba(201,173,167,0.16), #c9ada7 12px),
          bottom photo band masked into rounded-[24px], gradient-faded into rgba(13,16,18,0.85) card bg */}
      {/* Row 1 titles: لانژ اضافه مسافران | صندلی چرخدار و بالابر | خدمات تشریفات */}
      {/* Row 2 titles: مشایعت کننده | پارکینگ مسقف اختصاصی | لانژ ویژه کادر پرواز */}
      <div className="absolute bg-[rgba(34,34,59,0.6)] flex gap-[4px] h-[20px] items-center rounded-[10px]">
        <p className="font-['Inter:Regular'] text-[12px] text-white">VIP Services</p>{/* + crown icon */}
      </div>
      <div className="absolute bg-[rgba(34,34,59,0.6)] flex gap-[4px] h-[20px] items-center rounded-[10px]">
        <p className="font-['Inter:Regular'] text-[12px] text-white">CIP Services</p>{/* + diamond icon */}
      </div>

      {/* Lounge showcase card (خدمات سی آی پی) */}
      <p className="font-['Yekan_Bakh:Bold'] text-[24px] text-white">خدمات سی آی پی</p>
      <div className="absolute bg-[rgba(34,34,59,0.53)] h-[454px] w-[433px] rounded-tl-[216.5px] rounded-tr-[216.5px]" />
      {/* Map1 icon 40px, Routing icon 36px, Tree icon 24px overlaid as circular chips */}

      {/* Blog teaser */}
      <p className="font-['Yekan_Bakh:Regular'] text-[41px] text-white leading-[1.453]">
        <span>نکاتی که قبل از </span>
        <span className="font-['Yekan_Bakh:ExtraBold']">سفر های خارج</span>
        <span> از کشور بهتر است بدانید.</span>
      </p>
      <div className="font-['Yekan_Bakh:Regular'] text-[#969696] text-[14px] w-[526px]">
        <p>علل سفر شامل تفریح، گردشگری، سفر تحقیقاتی، بازدید از نحوه زندگی مردم یک ناحیه، سفر داوطلبانه برای خیریه، مهاجرت برای زندگی در جایی دیگر، سفر برای مراقبت بهداشتی و سفرهای مأموریتی (سفر تجاری) است.</p>
        <p>انگیزه‌های سفر عبارتند از:</p>
        <ul className="list-disc">
          <li>لذت</li>
          <li>آرامش</li>
          <li>کشف و اکتشاف</li>
          <li>شناخت سایر فرهنگ‌ها و ملل</li>
          <li>و …</li>
        </ul>
      </div>
      <div className="border border-[#c9ada7] rounded-[12px] h-[40px] w-[141px]">
        <p className="font-['Yekan_Bakh:SemiBold'] text-[#c9ada7] text-[14px]">ادامه مطلب</p>{/* + AddSquare icon */}
      </div>
    </div>
  );
}
```
