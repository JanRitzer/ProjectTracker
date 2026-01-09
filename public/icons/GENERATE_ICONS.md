# PWA Icon Generation Guide

## Required Icons

You need to generate the following PWA icons for your Project Tracker app:

### Icon Specifications

| Filename | Size | Purpose |
|----------|------|---------|
| `icon-192x192.png` | 192x192px | Android Chrome icon, notifications |
| `icon-512x512.png` | 512x512px | Android Chrome splash screen |
| `icon-maskable-192x192.png` | 192x192px | Android adaptive icon (with safe zone) |
| `icon-maskable-512x512.png` | 512x512px | Android adaptive splash (with safe zone) |
| `apple-touch-icon.png` | 180x180px | iOS home screen icon |
| `favicon.ico` | 32x32px | Browser favicon |

## Design Specifications

**Theme Colors:**
- Background: `#ff6b35` (your app's primary orange)
- Logo/Text: White
- Style: Modern, bold, matches your app aesthetic

**Recommended Design:**
- White "PT" letters (Project Tracker) on orange background
- Or a simple geometric icon representing tasks/productivity
- Keep it simple and recognizable at small sizes

**Maskable Icons (Android):**
- Must have 40% padding from edges (safe zone)
- Full bleed design - icon fills entire square
- Critical content within the center 80% circle

## Quick Generation Options

### Option 1: Online PWA Icon Generator (Recommended)
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload a 1024x1024 px PNG of your logo/icon
3. Download the generated icon pack
4. Extract and copy all icons to this folder

### Option 2: Favicon.io
1. Go to https://favicon.io/favicon-generator/
2. Create a simple text-based icon ("PT")
3. Customize colors (Background: #ff6b35, Text: #FFFFFF)
4. Download and use icons

### Option 3: Manual Creation (Design Tool)
If you have Figma, Sketch, or Photoshop:
1. Create a 1024x1024px artboard
2. Fill with #ff6b35 background
3. Add white "PT" text (centered, bold font like Outfit)
4. Export at required sizes listed above
5. For maskable variants, ensure design stays within center 80% circle

## Temporary Placeholder

For now, the PWA will work without icons but won't look polished. Generate these icons when you're ready to deploy or test on mobile devices.

## After Generating Icons

1. Place all icon files in this `/public/icons/` directory
2. The vite.config.js is already configured to use them
3. Test by running `npm run dev` and checking DevTools → Application → Manifest
4. On mobile, try "Add to Home Screen" to see your icon

## Testing Your Icons

- **Desktop:** Chrome DevTools → Application tab → Manifest → Check icon loading
- **Android:** Install PWA, check home screen icon
- **iOS:** Add to Home Screen, check icon on springboard
- **Maskable:** Use https://maskable.app/ to preview adaptive icon behavior
