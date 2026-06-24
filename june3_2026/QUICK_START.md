# 🚀 Quick Start Guide

## Starting the Website

### Option 1: Development Mode (Recommended for Testing)

```bash
cd "c:\Users\user\Documents\For me\Random web Gifts\june3_2026"
npm run dev
```

Then open your browser to: **http://localhost:3000**

### Option 2: Production Mode

```bash
npm run build
npm start
```

## Using the Website

### Step 1: View the Gift Box
- The website loads with a beautiful pink gradient background
- A gift box appears in the center with ribbons
- Floating flowers and sparkles animate gently around

### Step 2: Drag the Ribbon
- **Hover over either ribbon tail** (left or right side of the gift box)
- The cursor will change to a grab cursor
- **Click and drag downward** on the ribbon tail
- Watch as the ribbon stretches with physics-based movement

### Step 3: Open the Gift
- When you've dragged the ribbon **more than 150 pixels**:
  - The gift box will shake
  - The lid will start opening
  - A magical glow will emerge
  - Flowers will burst out

### Step 4: Enjoy the Flower Animation
- 40 flowers will explode from the gift box
- They'll float upward, rotate, and fade away
- The screen will gradually fill with flowers
- After 4-6 seconds, the flowers will transition to the letter page

### Step 5: Read the Love Letter
- A beautiful paper with the love letter will appear
- The letter is displayed in elegant cursive font
- A decorative seal (💌) rotates at the bottom

### Step 6: Customize the Letter (Optional)
- Click the **"Edit Letter"** button
- Type your custom message
- Click **"Save"** to update

## Features Overview

### 🎨 Aesthetic Elements
- Soft pastel pink color palette
- No harsh colors or orange tones
- Dreamy, romantic atmosphere
- Elegant typography

### 🎬 Animations
- Smooth 60 FPS animations
- Physics-based ribbon movement
- Magical particle effects
- Cinematic flower burst sequence

### ✨ Interactive Elements
- Draggable ribbon tails
- Hoverable buttons
- Editable love letter
- Progress indicator bar

### 🌸 Decorative Elements
- Floating flowers (varying sizes and speeds)
- Twinkling sparkles
- Floating hearts
- Glossy highlights on gifts

## Customization

### Change the Letter

Edit [components/LoveLetter/LoveLetter.tsx](components/LoveLetter/LoveLetter.tsx):

```typescript
const DEFAULT_LETTER = `My Dearest Love,

[Your message here...]

Forever yours,
❤️`;
```

### Change Colors

Edit [app/globals.css](app/globals.css) to modify the main gradient:

```css
background: linear-gradient(135deg, #YourColor1 0%, #YourColor2 50%, #YourColor3 100%);
```

### Adjust Animation Speed

Each component has configurable animation timings:
- `GiftBox.tsx` - Gift floating and breathing
- `Ribbon.tsx` - Ribbon spring-back speed
- `FlowerBurst.tsx` - Flower explosion duration
- `FloatingFlowers.tsx` - Background flower drift speed

## Troubleshooting

### Website won't load
```bash
# Clear cache and node_modules
rm -r node_modules
npm install
npm run dev
```

### Animations seem choppy
- Close other browser tabs
- Reduce the number of floating elements:
  - Edit `FloatingFlowers` count prop in [app/page.tsx](app/page.tsx)
  - Edit `Sparkles` count prop

### Ribbon not dragging
- Make sure you're clicking directly on the ribbon element
- The cursor should change to a grab cursor when hovering
- Try dragging in a downward direction for best results

### Letter doesn't appear after animation
- Wait a few seconds - the transition takes 4-6 seconds
- Check browser console for errors (F12)

## File Structure

```
june3_2026/
├── app/
│   ├── page.tsx              # Main page with orchestration
│   ├── layout.tsx            # Root layout with fonts
│   └── globals.css           # Global styles
├── components/
│   ├── GiftBox/
│   ├── Ribbon/
│   ├── FlowerBurst/
│   ├── LoveLetter/
│   ├── FloatingFlowers/
│   ├── Sparkles/
│   └── FloatingHearts/
├── styles/
│   └── animations.css        # Animation keyframes
└── public/                   # Static assets
```

## Performance Tips

- Keep the number of floating elements below 10 for best performance
- Close browser dev tools while running for better frame rate
- Use Chrome/Edge for best performance
- Disable hardware acceleration if animations seem stuttery

## Browser Compatibility

- ✅ Chrome/Chromium (Best)
- ✅ Firefox (Good)
- ✅ Safari (Good)
- ✅ Edge (Best)
- ⚠️ Mobile browsers (Limited - optimized for desktop)

## Advanced Customization

### Add Sound Effects

1. Add audio files to `public/` folder
2. Uncomment audio refs in [app/page.tsx](app/page.tsx)
3. Play sounds on interactions:

```typescript
ribbonPullAudioRef.current?.play();
```

### Add More Animation

Create new components in the `components/` folder and import them in `page.tsx`.

### Deploy to Web

```bash
# Build for production
npm run build

# Deploy to Vercel (recommended)
vercel deploy

# Or use other hosting (Netlify, GitHub Pages, etc.)
```

## Support & Customization

For additional customization, edit the component files directly. Each component is self-contained and well-commented.

---

**Enjoy creating a magical experience for your girlfriend! 💝**
