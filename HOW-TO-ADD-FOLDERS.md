# How to Add Folders to the Assets Directory

## Understanding Your Setup

This repository uses **Netlify CMS** for content management. The CMS configuration is in `/admin/config.yml`.

### Where Media Goes

According to your CMS configuration (line 5 in `admin/config.yml`):
```yaml
media_folder: "assets/images/uploads"
```

This means the CMS automatically saves uploaded images to `assets/images/uploads`.

## How to Add a Folder

### Method 1: Through File System (Local Development)

1. Navigate to the assets directory:
   ```bash
   cd assets
   ```

2. Create your folder:
   ```bash
   mkdir foldername
   ```
   Or create nested folders:
   ```bash
   mkdir -p foldername/subfolder
   ```

3. If you want git to track empty folders, add a `.gitkeep` file:
   ```bash
   touch foldername/.gitkeep
   ```

4. Commit your changes:
   ```bash
   git add assets/foldername
   git commit -m "Add foldername folder"
   git push
   ```

### Method 2: Through Netlify CMS (for Media Folders)

If you want to change where the CMS stores uploads:

1. Edit `/admin/config.yml`
2. Change the `media_folder` path:
   ```yaml
   media_folder: "assets/images/your-new-folder"
   public_folder: "/assets/images/your-new-folder"
   ```
3. Commit and push the changes
4. The CMS will now use the new folder for uploads

## Common Folders You Might Add

- `assets/videos` - for video files
- `assets/documents` - for PDFs and documents  
- `assets/fonts` - for custom web fonts
- `assets/images/photos` - for specific photo categories

## Important Notes

- Git doesn't track empty folders by default - use `.gitkeep` if needed
- The Netlify CMS will create the `uploads` folder automatically when you upload files
- Always commit folder changes to your repository so others see the structure

## Example: Adding a Videos Folder

```bash
# In your terminal
cd /path/to/ma-advisory-website
mkdir assets/videos
touch assets/videos/.gitkeep
git add assets/videos/.gitkeep
git commit -m "Add videos folder to assets"
git push origin main
```

That's it! The folder is now in your repository.
