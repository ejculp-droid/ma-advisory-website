# Guide: Adding Folders to the Assets Directory

This guide explains how to add folders to the `assets` directory in this repository.

## ✅ What Was Done

The images folder structure has been created in `assets/images/` with the following subdirectories:

```
assets/
└── images/
    ├── favicon/              # Browser and app icons
    ├── hero/                 # Hero section backgrounds
    ├── icons/
    │   └── services/         # Service icons
    ├── logos/
    │   ├── clients/          # Client company logos
    │   └── testimonials/     # Testimonial client logos
    ├── office/               # Office/location photos
    └── team/                 # Team member headshots
```

## 🎯 How to Add More Folders

### Method 1: Using Command Line

```bash
# Navigate to the assets directory
cd assets

# Create a new folder (example: creating a 'documents' folder)
mkdir documents

# Or create nested folders at once
mkdir -p downloads/pdfs/reports

# Add a .gitkeep file to track empty folders in git
touch documents/.gitkeep
```

### Method 2: Using Your File Explorer/Finder

1. Open the `assets` folder in your file explorer
2. Create a new folder with your desired name
3. Add at least one file to the folder (or create a `.gitkeep` file)
4. Commit the changes to git

### Method 3: Programmatically (Node.js example)

```javascript
const fs = require('fs');
const path = require('path');

// Create a new folder
const newFolder = path.join(__dirname, 'assets', 'videos');
fs.mkdirSync(newFolder, { recursive: true });

// Add .gitkeep to track in git
fs.writeFileSync(path.join(newFolder, '.gitkeep'), '');
```

## 📝 Important Notes

### About .gitkeep Files
- Git doesn't track empty folders by default
- `.gitkeep` is a convention (not a git feature) to keep empty folders in version control
- You can use any filename, but `.gitkeep` is the standard convention
- Once you add actual files to the folder, you can optionally remove `.gitkeep`

### Best Practices

1. **Use descriptive names**: Choose folder names that clearly indicate their purpose
   - ✅ Good: `assets/videos`, `assets/fonts`, `assets/documents`
   - ❌ Bad: `assets/stuff`, `assets/misc`, `assets/folder1`

2. **Follow existing conventions**: Look at the current structure and maintain consistency
   - This project uses lowercase names
   - Words are separated by hyphens if needed (e.g., `service-icons`)

3. **Document your folders**: Update relevant README files when adding new folders

4. **Organize logically**: Group related assets together
   ```
   assets/
   ├── images/      # All image files
   ├── videos/      # All video files
   ├── documents/   # PDFs and documents
   └── fonts/       # Custom font files
   ```

## 📋 Examples

### Adding a Videos Folder

```bash
cd assets
mkdir videos
touch videos/.gitkeep
git add videos/.gitkeep
git commit -m "Add videos folder to assets"
```

### Adding a Fonts Folder with Subfolders

```bash
cd assets
mkdir -p fonts/{woff,woff2,ttf}
touch fonts/.gitkeep fonts/woff/.gitkeep fonts/woff2/.gitkeep fonts/ttf/.gitkeep
git add fonts/
git commit -m "Add fonts folder structure to assets"
```

### Adding a Downloads Folder

```bash
cd assets
mkdir downloads
touch downloads/.gitkeep
git add downloads/.gitkeep
git commit -m "Add downloads folder to assets"
```

## 🔍 Verifying Your Folders

After creating folders, verify they're tracked by git:

```bash
# Check git status
git status

# List all folders in assets
ls -la assets/

# View folder tree
tree assets/
```

## 📚 Related Documentation

- See `README.md` for overall project structure
- See `IMAGE-GUIDE.md` for image-specific guidelines
- See `assets/images/README.md` for detailed image folder usage

## ❓ Common Questions

**Q: Why do I need .gitkeep files?**
A: Git doesn't track empty directories. The .gitkeep file ensures the folder structure is preserved in version control even when folders are empty.

**Q: Can I add any type of folder to assets?**
A: Yes! The assets folder is meant for static files like images, videos, documents, fonts, etc. Add folders as needed for your project.

**Q: Should I commit .gitkeep files?**
A: Yes, .gitkeep files should be committed to ensure the folder structure is available to all team members.

**Q: What if I want to add files instead of empty folders?**
A: If you're adding actual files, you don't need .gitkeep. Just add your files directly and commit them.

## 📞 Need Help?

If you have questions about the folder structure or need assistance, refer to the main README.md or check the existing folder structure for examples.
