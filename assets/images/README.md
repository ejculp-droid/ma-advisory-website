# Images Directory

This directory contains all image assets for the M&A Advisory website.

## 📁 Folder Structure

```
images/
├── logos/
│   ├── logo.svg              # Primary company logo
│   ├── clients/              # Client company logos for transactions
│   └── testimonials/         # Client logos for testimonials
├── hero/
│   └── hero-bg.jpg           # Hero section background (1920x1080)
├── team/
│   └── [firstname-lastname.jpg]  # Team member headshots (800x800)
├── icons/
│   └── services/             # Service icons (64x64 SVG)
├── favicon/
│   ├── favicon-16x16.png     # Browser tab icon
│   ├── favicon-32x32.png     # Browser bookmark icon
│   └── apple-touch-icon.png  # iOS home screen icon
├── office/                   # Office/location photos (1200x800)
└── og-image.jpg              # Social media sharing image (1200x630)
```

## 🎯 How to Add Images

### Step 1: Prepare Your Images
- Follow the specifications in `/IMAGE-GUIDE.md`
- Optimize images for web (use TinyPNG, Squoosh, etc.)
- Use proper naming conventions

### Step 2: Place Images in Correct Folder
Based on the image type, place your file in the appropriate subdirectory:

- **Company Logo**: `logos/logo.svg`
- **Hero Background**: `hero/hero-bg.jpg`
- **Team Photos**: `team/firstname-lastname.jpg`
- **Service Icons**: `icons/services/icon-name.svg`
- **Client Logos**: `logos/clients/company-name.svg`
- **Favicons**: `favicon/favicon-*.png`
- **Office Photos**: `office/office-description.jpg`

### Step 3: Update HTML References
Update your HTML files to reference the new images:

```html
<!-- Logo -->
<img src="/assets/images/logos/logo.svg" alt="Company Name">

<!-- Hero Background -->
<section class="hero" style="background-image: url('/assets/images/hero/hero-bg.jpg')">

<!-- Team Photo -->
<img src="/assets/images/team/john-smith.jpg" alt="John Smith">
```

## 📋 Quick Reference

### Required Image Sizes
- **Hero**: 1920x1080px (JPG, <300KB)
- **Team Photos**: 800x800px (JPG, <100KB)
- **Logos**: Variable (SVG preferred or PNG)
- **Icons**: 64x64px (SVG)
- **Favicons**: 16x16, 32x32, 180x180 (PNG)
- **OG Image**: 1200x630px (JPG/PNG)

### Recommended Tools
- **Optimization**: TinyPNG (tinypng.com), Squoosh (squoosh.app)
- **Free Stock Photos**: Unsplash (unsplash.com), Pexels (pexels.com)
- **Icons**: Heroicons (heroicons.com), Feather Icons (feathericons.com)

## 💡 Tips

1. **Always optimize** images before adding them to reduce page load times
2. **Use SVG** for logos and icons when possible for scalability
3. **Maintain consistent** naming conventions across all images
4. **Keep originals** - store high-resolution originals elsewhere as backup
5. **Test images** on different devices and screen sizes

For detailed specifications and guidelines, see `/IMAGE-GUIDE.md` in the root directory.
