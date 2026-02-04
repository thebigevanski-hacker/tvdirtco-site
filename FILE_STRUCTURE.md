# File Structure for Deployment

Your website files should be organized like this:

```
your-project/
├── index.html
├── services.html
├── rentals.html
├── about.html
├── projects.html
├── contact.html
├── sitemap.xml
├── robots.txt
├── README.md
├── QUICK_START.md
└── assets/
    └── logo.png  ← Your logo file goes here
```

## Important: Assets Folder

Make sure to create an `assets` folder in the root of your project and put your `logo.png` file inside it.

The logo is set to:
- **Height:** 64px (h-16 in Tailwind)
- **Hover effect:** Slight scale up on hover
- **Alt text:** "Temecula Valley Dirt Co. Logo" (good for SEO)

## If Your Logo Has a Different Name

If your logo file is named differently (like `TVDirtCo-Logo.png`), you need to update it in all 6 HTML files.

Search for: `assets/logo.png`
Replace with: `assets/YOUR-ACTUAL-FILENAME.png`

## Logo Size Recommendations

For best results:
- **Minimum width:** 200px
- **Recommended:** 400-600px wide
- **Format:** PNG with transparent background (preferred) or JPG
- **File size:** Keep under 100KB for fast loading

If your logo is too large or small, you can adjust the height in the code by changing `h-16` to:
- `h-12` (smaller - 48px)
- `h-20` (larger - 80px)
- `h-24` (even larger - 96px)

## Vercel Deployment

When deploying to Vercel, make sure:
1. Your `assets` folder is included in your GitHub repository
2. The folder structure matches exactly as shown above
3. File names are case-sensitive (logo.png ≠ Logo.PNG)
