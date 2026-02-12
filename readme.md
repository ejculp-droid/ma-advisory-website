# M&A Advisory Website

A professional, responsive website for an M&A advisory firm built with modern web technologies and best practices.

## 🚀 Quick Start

1. **Clone or download** this repository
2. **Open** `index.html` in a web browser, or
3. **Run a local server**:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (with http-server)
   npx http-server
   
   # Then open http://localhost:8000 in your browser
   ```

## 📁 Project Structure

```
ma-advisory-website/
├── index.html              # Homepage
├── assets/
│   ├── css/
│   │   ├── variables.css   # Design system variables
│   │   ├── reset.css       # CSS reset/normalize
│   │   ├── typography.css  # Typography styles
│   │   ├── components.css  # Reusable components
│   │   ├── layout.css      # Page layouts
│   │   └── responsive.css  # Responsive styles
│   ├── js/
│   │   ├── main.js         # Core functionality
│   │   └── navigation.js   # Navigation handling
│   └── images/
│       ├── logos/          # Company and client logos
│       ├── hero/           # Hero background images
│       ├── team/           # Team member photos
│       └── icons/          # SVG icons
├── pages/                  # Additional website pages
│   ├── about.html
│   ├── services/
│   ├── industries/
│   ├── transactions.html
│   ├── team.html
│   ├── contact.html
│   └── ...
└── README.md               # This file
```

## 🎨 Design System

### Colors

- **Primary (Navy)**: `#003366`
- **Accent (Gold)**: `#D4AF37`
- **Gray Scale**: 9-step scale from `#f8f9fa` to `#212529`

### Typography

- **Primary Font**: Inter (body text)
- **Secondary Font**: Montserrat (headings)
- **Size Scale**: 11 steps from 12px to 72px

### Spacing

Based on 8-point grid system (4px base unit):
- XS: 8px
- SM: 12px
- MD: 16px
- LG: 24px
- XL: 32px
- 2XL-5XL: 40px-80px

## 🧩 Features

### Implemented

✅ Fully responsive design (mobile-first)  
✅ Sticky header with hide-on-scroll  
✅ Mobile navigation menu  
✅ Dropdown menus with keyboard support  
✅ Animated statistics counters  
✅ Carousel components (transactions, testimonials)  
✅ Scroll animations  
✅ Form validation  
✅ Smooth scrolling  
✅ Touch/swipe support  
✅ Accessibility (WCAG 2.1 AA)  
✅ SEO optimization  
✅ Schema.org markup  

### To Be Implemented

- [ ] Additional pages (About, Services, Team, etc.)
- [ ] Contact form backend integration
- [ ] Image assets (logos, photos, backgrounds)
- [ ] Blog/insights section
- [ ] Search functionality
- [ ] Analytics integration

## 🛠️ Customization

### 1. Update Company Information

**index.html:**
- Line 9-10: Page title and description
- Line 68-70: Company name and logo
- Line 568-573: Footer contact information
- Line 22-46: Update SEO metadata

### 2. Change Colors

**assets/css/variables.css:**
```css
:root {
  --color-primary-500: #003366;  /* Your primary color */
  --color-accent-500: #D4AF37;   /* Your accent color */
}
```

### 3. Update Content

- **Hero Section**: Lines 193-206 in index.html
- **Stats**: Lines 211-230 (update data-counter values)
- **Services**: Lines 237-299 (customize 4 service cards)
- **Transactions**: Lines 304-396 (add your deal examples)
- **Testimonials**: Lines 401-471 (add client quotes)

### 4. Add Images

Place your images in `/assets/images/` and update paths:

```html
<!-- Hero background -->
<section class="hero" style="background-image: url('/assets/images/hero/your-image.jpg')">

<!-- Logo -->
<img src="/assets/images/logos/your-logo.svg" alt="Company Logo">

<!-- Team photos -->
<img src="/assets/images/team/person-name.jpg" alt="Person Name">
```

See `IMAGE-GUIDE.md` for detailed specifications.

### 5. Customize Navigation

**index.html** lines 73-115: Update menu items

```html
<li class="nav-item">
  <a href="/your-page.html" class="nav-link">Your Link</a>
</li>
```

## 📱 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari iOS 12+
- Chrome Android (last 2 versions)

## ⚡ Performance

- Target: < 3s page load
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Lighthouse Score: > 90

## ♿ Accessibility

- WCAG 2.1 Level AA compliant
- Semantic HTML5 markup
- ARIA labels and landmarks
- Keyboard navigation support
- Screen reader friendly
- Focus indicators
- Skip links

## 🧪 Testing Checklist

### Functionality
- [ ] All navigation links work
- [ ] Dropdown menus open/close properly
- [ ] Mobile menu toggles correctly
- [ ] Carousels auto-advance and respond to clicks
- [ ] Form validation works
- [ ] Smooth scrolling functions
- [ ] Counters animate on scroll

### Responsive Design
- [ ] Test on mobile (320px-767px)
- [ ] Test on tablet (768px-1023px)
- [ ] Test on desktop (1024px+)
- [ ] Test on large screens (1920px+)
- [ ] Check landscape orientation
- [ ] Verify touch interactions

### Cross-Browser
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### Accessibility
- [ ] Tab through all interactive elements
- [ ] Test with screen reader
- [ ] Verify ARIA labels
- [ ] Check color contrast
- [ ] Test keyboard navigation

## 📝 Development Workflow

1. **Local Development**: Use a local server (Python, Node, VS Code Live Server)
2. **Make Changes**: Edit HTML, CSS, or JS files
3. **Test**: Check all functionality and responsive behavior
4. **Validate**: Run HTML/CSS validators
5. **Optimize**: Minify CSS/JS, compress images
6. **Deploy**: Upload to your hosting provider

## 🚀 Deployment

### Option 1: Traditional Hosting
Upload all files to your web server via FTP or cPanel.

### Option 2: Netlify (Recommended)
1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Configure custom domain
4. Enable form handling

### Option 3: GitHub Pages
1. Push code to GitHub repository
2. Enable GitHub Pages in settings
3. Select source branch
4. Access at `username.github.io/repository`

### Option 4: Vercel
1. Import project to [vercel.com](https://vercel.com)
2. Connect to Git repository
3. Configure build settings
4. Deploy automatically on push

## 🔧 Advanced Configuration

### Form Backend Integration

Replace the placeholder API endpoint in `assets/js/main.js`:

```javascript
const response = await fetch('/api/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

**Options:**
- **Netlify Forms**: Add `data-netlify="true"` to form tag
- **Formspree**: Use `https://formspree.io/f/YOUR_FORM_ID`
- **Custom Backend**: Build your own API endpoint
- **EmailJS**: Client-side email service

### Analytics Integration

Add before closing `</head>` tag:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 📞 Support

For questions or assistance:
- Review `QUICK-REFERENCE.md` for component usage
- Check `IMPLEMENTATION.md` for development timeline
- See `IMAGE-GUIDE.md` for image specifications

## 📄 License

This template is provided as-is for use in your M&A advisory website project.

---

**Built with:** HTML5, CSS3, Vanilla JavaScript  
**Version:** 1.0.0  
**Last Updated:** 2025
