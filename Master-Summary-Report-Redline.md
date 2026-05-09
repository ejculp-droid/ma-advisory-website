# Master Summary Report: Fee Structure Mobile Issue (Redline)

## Executive Summary

The mobile defect is real and measurable: at a 390px mobile viewport, the live Fee Structure page renders a document width of 489px, producing 99px of horizontal overflow on https://rtoadvisory.com/pages/fee-structure.html.

The strongest root-cause finding is Report 1’s comparison-preview diagnosis: hidden hover-card comparison content remains present in ~~the layout overflow~~ **scrollable layout geometry** even though it is visually invisible. Live verification confirms that all four proposed CSS remedies reduce document width from 489px to 390px.

The highest-confidence immediate fix is to disable `.cmp-preview__hover-card` on mobile. The best structural fix is to choose one comparison system for mobile and desktop, remove duplicate inactive comparison layers from rendered flow, and ensure modal/hover-only content cannot contribute to page scroll width when inactive.

The service-link issue is separate from the mobile overflow issue but still important. Live extraction shows multiple visible service-card destinations currently resolve to 404, including Strategic Exit Planning, M&A Transaction Advisory, Monthly Advisory Retainers, Business Valuation Only, Due Diligence Support, Market Analysis & Positioning, and Hourly Consulting. The earlier “pages/pages” diagnosis is not the issue, but the correct conclusion is ~~not~~ **also not** “no link issue exists.” The accurate conclusion is that Netlify-style URL rewriting is not inherently broken, while several service-card destinations are missing, mis-mapped, or not deployed.

## Evidence Normalization

| Evidence item | Report 1: PX Comp | Report 2: PX A Window | Report 3: V Demand | Live verification result | Master conclusion |
|---|---|---|---|---|---|
| Mobile horizontal overflow exists | Strong yes | Implied yes | Unverified | Confirmed: 390px viewport, 489px scroll width, 99px overflow | Confirmed primary issue |
| Comparison preview area is implicated | Strong yes | Strong yes | Needs testing | Confirmed: `.cmp-preview__images` has 473px `scrollWidth` inside a 358px visual box | Confirmed primary culprit area |
| Hidden hover-card content contributes to overflow | Strong yes | Consistent | Not addressed | Confirmed by CSS remedy tests | Confirmed root-cause mechanism |
| Duplicate comparison systems exist | Not primary frame | Strong yes | Not addressed | Structurally plausible from class presence; should be audited in source | Likely systemic cause, separate from immediate CSS overflow |
| Broken pages/pages links | Not addressed | Not claimed | Says false | Current live URLs do not show pages/pages | False as framed |
| Service-card mapping or destination issue | Not addressed | Strong yes | Says no action | Live extraction shows multiple 404 destinations; RTO Exit Readiness points to succession-planning | Confirmed separate routing/content issue |
| Explore Service links intercepted by JS | Not addressed | Strong yes | Not addressed | Current live click navigated to destination; no interception observed for first card | Likely stale or source-specific, not confirmed live |
| Netlify quote/path rewrites | Not addressed | Not primary | Strong yes | Pretty URL behavior is plausible and not itself a defect | Correct but incomplete |

## Heat and Frequency Overlay

### Issue heatmap

| Issue | Frequency across reports | Live confidence | User impact | Fix urgency | Heat rating |
|---|---|---|---|---|---|
| Mobile horizontal overflow from comparison preview/hover-card content | 2 of 3 reports | Very high | High: breaks mobile viewport and visual trust | Immediate | Critical |
| Duplicate comparison UI systems | 1 of 3 reports, but overlaps with overflow evidence | Medium-high | High: recurring layout and interaction ambiguity | High | High |
| Service-card destinations returning 404 or mis-mapped | 2 of 3 reports conflict; live test confirms failures | High | High: users click dead service pages | High | High |
| Incorrect claim that pages/pages is the broken URL pattern | 1 of 3 reports addresses it | High confidence false | Low if treated correctly; high if it distracts repair | Do not fix | Cold / false alarm |
| Quote style (single vs double quotes) in deployed HTML | 1 of 3 reports | High confidence non-issue | None | Do not fix | Cold / false alarm |
| Explore Service JS click interception | 1 of 3 reports | Low on current live page | Medium if present in another branch/source | Audit only | Warm / stale candidate |
| Heading `<br>` and hero mobile min-height | 1 of 3 reports | Reported fixed | Low current relevance | Regression test only | Cold / resolved |

### Root-cause heatmap

| Root cause candidate | Supporting evidence | Contradicting evidence | Master weight |
|---|---|---|---|
| Hidden absolute hover cards remain scrollable on mobile | Direct width reduction when hover cards are hidden; `.cmp-preview__images` scrollWidth exceeds visible box | None from live mobile test | 95% |
| Internal comparison rows have desktop-biased two-column grid | One-column grid remedy fixes overflow; Report 1 cites `grid-template-columns: minmax(200px, 260px) minmax(0, 1fr)` | Not necessarily the only cause because clipping also fixes it | 80% |
| Duplicate comparison UI layers create layout/interaction fragility | Report 2 identifies preview, hover-card overlays, and modal as competing systems; live class presence supports modal/overlay complexity | Live overflow can be patched without removing all duplicate systems | 70% |
| Netlify URL rewriting causes broken links | Report 3 explains rewrite mechanics | Live 404s occur on several destinations; no pages/pages issue observed | 10% |
| JS prevents service-card navigation | Report 2 source claim | Current live click test navigates normally for first service card | 20% current live, higher for referenced source branch |

## Primary Mobile Root Cause

The core mobile failure is ~~not the page’s overall responsive grid~~ **not primarily the page-level responsive grid**. It is a hidden comparison layer embedded inside comparison preview cards. Hidden hover-card content is visually suppressed via opacity/pointer behavior, but remains part of scrollable geometry. At 390px viewport width, the comparison image area visually fits, but internal scrollable content does not.

### Live measurement snapshot

| Measurement | Value |
|---|---|
| Mobile viewport width | 390px |
| Document scroll width | 489px |
| Overflow beyond viewport | 99px |
| `.cmp-preview__images` visual width | 358px |
| `.cmp-preview__images` `scrollWidth` | 473px |
| `.compare-modal__row` maximum right edge | 434px |
| `.compare-modal` max width/right contribution | 489px |

This explains why the defect appears stubborn: visible stacking can look acceptable while hidden/inactive comparison content still pushes document width beyond the viewport.

## Verified Remedies

All four Report 1 remedies were live-tested at 390px and reduced document width from 489px to 390px.

| Remedy | Result | Practical interpretation |
|---|---|---|
| Hide `.cmp-preview__hover-card` on mobile | 390px scroll width, 0px overflow | Cleanest immediate fix because hover-only UI has little mobile value |
| Clip `.cmp-preview__image-wrap` overflow | 390px scroll width, 0px overflow | Good containment fallback; may mask hidden layout debt |
| Clip `.cmp-preview__col` overflow | 390px scroll width, 0px overflow | Effective, but broader than exact offender |
| Force hover-card `.compare-modal__row` to one column | 390px scroll width, 0px overflow | Best if hover-card content must remain structurally present |

### Immediate patch

```css
@media (max-width: 760px) {
  .fee-page .cmp-preview__hover-card {
    display: none !important;
  }
}
```

This aligns UI with interaction reality: hover cards are desktop affordances; mobile users should not incur layout cost from invisible hover-only content.

## Structural Cleanup

Preferred production cleanup beyond immediate containment:

1. Keep one comparison mechanism as canonical.
2. If modal is canonical, remove hover-card comparison content from mobile rendered flow.
3. If preview cards are canonical, eliminate or lazy-render separate modal content unless Compare explicitly needs it.
4. Ensure hidden modal/overlay layers use `display: none`, unmounted rendering, or explicit geometry containment when inactive.
5. Add mobile regression assertion: `document.documentElement.scrollWidth <= document.documentElement.clientWidth` at 375, 390, 414, and 430 widths.

## Service-Link Findings

This is a separate fix lane from overflow.

| Card label | Current destination | Current status | Assessment |
|---|---|---|---|
| RTO Exit Readiness Index™ Assessment | `/pages/services/succession-planning` | 200 | Resolves, but label-to-destination may be conceptually wrong |
| Strategic Exit Planning | `/pages/services/strategic-exit-planning.html` | 404 | Broken destination |
| M&A Transaction Advisory | `/pages/services/ma-transaction-advisory.html` | 404 | Broken destination |
| Monthly Advisory Retainers | `/pages/services/monthly-advisory-retainers.html` | 404 | Broken destination |
| Business Valuation Only | `/pages/services/strategic-exit-planning.html` | 404 | Broken and likely mis-mapped |
| Due Diligence Support | `/pages/services/due-diligence-support.html` | 404 | Broken destination |
| Market Analysis & Positioning | `/pages/services/market-analysis-positioning.html` | 404 | Broken destination |
| Hourly Consulting | `/pages/services/hourly-consulting.html` | 404 | Broken destination |

Reconciliation:

- Report 3 is correct that pages/pages is not the operative defect.
- Report 3 is too broad if it concludes no service-link action is required.
- Report 2 is directionally correct that card destinations require audit, but its JS interception claim is not confirmed on current live behavior.

## Outliers and False Alarms

- **False/stale:** pages/pages URL defect (not observed in current live extraction).
- **Non-defect:** quote rewriting (single vs double quotes is not materially relevant).
- **Possibly stale/branch-specific:** Explore Service click interception (audit source, but not confirmed live for first card).
- **Likely resolved:** heading `<br>` and hero min-height (retain in regression checklist only).

## Best-Practice Standard for Final Fix

- Do not rely on `opacity: 0` alone for inactive layers containing large layout structures.
- Do not keep desktop hover experiences active in mobile rendered layout unless converted to tap-first UI.
- Do not duplicate same content across preview cards, hover overlays, and modals without a single source of truth and inactive-system unmounting/containment.
- Add `min-width: 0` to flex/grid children containing nested content.
- Add wrapping safeguards (`overflow-wrap: anywhere` or equivalent) for long labels in narrow mobile cards.
- Test actual document scroll width; screenshots alone can miss hidden overflow.

## Recommended Fix Order

### Phase 1: Stop the mobile break immediately

Apply:

```css
@media (max-width: 760px) {
  .fee-page .cmp-preview__hover-card {
    display: none !important;
  }
}
```

Verify at 375/390/414/430:

```js
document.documentElement.scrollWidth === document.documentElement.clientWidth
```

### Phase 2: Clean comparison architecture

| Chosen mechanism | Keep | Remove/disable |
|---|---|---|
| Compare modal | Button-triggered modal | Mobile hover cards + duplicate hidden comparison grids |
| Preview cards | Inline preview content | Separate modal unless it adds unique content |
| Mobile accordion | Tap-expanded single-column sections | Desktop hover-card behavior below 760px |

### Phase 3: Repair service-card destinations

Build inventory: card label → intended slug → deployed path.

| Card label | Decision needed |
|---|---|
| RTO Exit Readiness Index™ Assessment | Dedicated readiness page vs intentional succession-planning destination |
| Business Valuation Only | Valuation-specific destination vs strategic-exit-planning |
| Strategic Exit Planning | Create/deploy strategic-exit page vs repoint to existing page |
| All 404 cards | Add pages, restore pages, or redirect intentionally |

### Phase 4: Audit stale JS/source variants

Search for:

```js
preventDefault()
retainer-card
project-card
cmp-preview__hover-card
compare-modal
service-modal
```

If interception exists and behavior is intended modal expansion, relabel CTA from “Explore Service” to “View Details” and provide separate navigational link.

## Regression Test Checklist

| Test | Expected result |
|---|---|
| 375px mobile document width | `scrollWidth <= clientWidth` |
| 390px mobile document width | `scrollWidth <= clientWidth` |
| 414px mobile document width | `scrollWidth <= clientWidth` |
| 430px mobile document width | `scrollWidth <= clientWidth` |
| Compare button on mobile | Opens one clean comparison experience, no hidden duplicate panel |
| Preview cards on mobile | No hover-only content contributes to width |
| Service-card click | Navigates to correct live page, or intentionally opens modal with matching label |
| All service-card hrefs | 200/301/302 to intended destination, never 404 |
| Long service labels | Wrap inside card without horizontal scroll |
| Browser screenshot | No clipped content, no horizontal scrollbar, no intrusive narrow comparison panel |

## Final Diagnosis

The mobile overflow has one dominant confirmed cause: hidden hover-card comparison content in preview architecture contributes to scrollable width on mobile. Immediate containment is to disable hover cards below 760px (or force contained single-column behavior plus clipping).

The broader quality risk is architectural duplication: multiple comparison/modal systems increase probability of invisible desktop-oriented UI leaking into mobile layout.

The service-link issue is real but separate: discard the doubled `/pages/pages` theory, then repair the visible service-card destination inventory because multiple live destinations return 404 and at least two mappings appear conceptually misaligned.
