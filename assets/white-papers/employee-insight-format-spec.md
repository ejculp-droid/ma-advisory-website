# Employee Insight Formatting Spec

Source extracted from local MHT file.

## Page Setup
- Page size: 8.5in x 11.0in
- Margins: top 0.9in, right 1.0in, bottom 0.9in, left 1.0in
- Header margin: 0.5in
- Footer margin: 0.5in

## Typography
- Primary body font: Cormorant Garamond
- Body size: 11.0pt
- Body line height: 115%
- Body alignment: justify
- Body spacing: 0in top, 0in right, 10.0pt bottom, 0in left

### Title style (MsoTitle)
- Font: Cormorant Garamond SemiBold
- Size: 26.0pt
- Color: #0F2E2A
- Letter spacing: 0.25pt
- Alignment: justify
- Spacing: 0in top, 0in right, 15.0pt bottom, 0in left

### Heading 1
- Font: Cormorant Garamond Medium
- Size: 18.0pt
- Color: #0F2E2A
- Line height: 115%
- Alignment: justify
- Spacing: 24.0pt top, 0in right, 0in bottom, 0in left

### Heading 2
- Font: Cormorant Garamond Medium
- Size: 13.0pt
- Color: #0F2E2A
- Line height: 115%
- Alignment: justify
- Spacing: 10.0pt top, 0in right, 0in bottom, 0in left

### Custom section heading style (Employee Insight Reports)
- Base: Heading 2
- Font: Cormorant Garamond Medium
- Size: 13.0pt
- Weight: bold
- Color: #0F2E2A
- Alignment: center

## Accent and Theme Colors Seen
- #0F2E2A (primary dark green used for titles/headings)
- #4F81BD (accent blue used in subtitle style definition)
- Theme tokens present: text1, background1, accent1..accent6, white, black

## Lists
- Uses Word list definitions with negative first-line indent pattern.
- Common level-1 list values:
  - text-indent: -0.25in
  - margin-left by level: 0.25in, 0.5in, 0.75in, 1.0in, 1.25in
- Bullets use Symbol font with bullet glyph (\F0B7)

## Tables
- Core table families available:
  - Table Normal
  - Table Grid
  - Light Shading
  - Light List
  - Light Grid
- Frequent table defaults:
  - Cell padding: 0in 5.4pt 0in 5.4pt
  - Base table font: Cambria 11.0pt
- Table Grid baseline:
  - Outer border: 1.0pt solid
  - Inside borders: 0.5pt solid

## Document Structure Found
- H1 count: 1
- H2 count: 14
- H1 text:
  - Spencer McCoy
- H2 sections:
  - What Do You Know / Have You Heard About the Planned Combination?
  - What Are Your Thoughts About the Plan?
  - Before Hearing of the Plan, How Did You See the Next 5-10 Years?
  - How, If At All, Has That Changed Since Learning of It?
  - Describe Your Role / How Do You Spend Your Time
  - What Is Your Ideal State / Magic Wand Scenario?
  - Quality Control
  - Tell Me About the Process: Job In to Job Out
  - What Do You Like About the Process / Strongest Part?
  - What Would You Change About the Process / Weakest Part?
  - Concerns
  - Questions Spencer Had for Elliott
  - Notes & Observations
  - Recommendation

## Rebuild Checklist for New Files
- Set page size and margins first.
- Define body style (Cormorant Garamond, 11pt, justified, 115%, 10pt paragraph after).
- Define Title style (26pt, #0F2E2A, semi-bold).
- Define Heading 1 and Heading 2 styles using Cormorant Garamond Medium and specified spacing.
- If you need centered section headers, apply the custom Employee Insight Reports style settings.
- Use consistent list indents with -0.25in hanging indent.
- Use Table Grid or Light Grid for structured data tables.
