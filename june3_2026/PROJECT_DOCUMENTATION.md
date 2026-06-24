# 💝 A Gift For You - Romantic Interactive Website

A beautiful, production-quality romantic website dedicated to your girlfriend. This site features an interactive gift box with draggable ribbons that reveals a heartfelt love letter.

## 🌸 Features

### Visual Design
- **Soft Pastel Pink Aesthetic**: Dreamy gradient background (#FFE4EC → #FFF8F8)
- **Elegant Typography**: Uses "Great Vibes" cursive font for romantic feel
- **Smooth Animations**: All elements animate beautifully using Framer Motion and GSAP
- **Floating Decorative Elements**: 
  - Subtle floating flowers throughout the page
  - Twinkling sparkles for magical atmosphere
  - Floating hearts for romantic touch

### Core Interactions

#### 1. **Gift Box**
- Centered, beautifully illustrated pink gift box
- Realistic ribbon with glossy effects
- Gentle floating and breathing animations
- Responsive to user interaction

#### 2. **Draggable Ribbon** (Interactive)
- **Left and right ribbon tails** that can be dragged
- Physics-based movement with elasticity
- When dragged more than 150 pixels:
  - Gift box begins shaking
  - Lid opens slowly with light effects
  - Magical glow emerges
  - Flowers burst from the box

#### 3. **Flower Burst Animation**
- 40 flowers explode from gift box
- Each flower:
  - Flies upward at different angles
  - Rotates and scales up
  - Fades out gracefully
- Transitions into full-screen flower coverage
- Duration: 4-6 seconds

#### 4. **Love Letter Page**
- Elegant paper design with soft shadows
- Displays a romantic, handwritten-style message
- **Edit Letter** button to customize the message
- Decorative seal animation (💌)
- Background filled with semi-transparent floating flowers

## 🚀 Getting Started

### Installation

```bash
cd june3_2026
npm install
npm run dev
```

The site will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## 📝 Customizing the Love Letter

Edit the default letter in [LoveLetter.tsx](components/LoveLetter/LoveLetter.tsx):

```typescript
const DEFAULT_LETTER = `My Dearest Love,

[Your custom message here]

Forever yours,
❤️`;
```

Or use the **Edit Letter** button on the website to change it interactively.

## 🎨 Color Palette

- **Main Pink**: #FFB6D9
- **Light Pink**: #FFE4EC
- **Pale Yellow**: #FFFACD
- **Cream**: #FFFEF0
- **Peach**: #FFD4B4
- **Background**: Gradient from #FFE4EC to #FFF8F8

## 🎭 Component Structure

```
components/
├── GiftBox/
│   └── GiftBox.tsx          # Main gift box with lid & ribbon knot
├── Ribbon/
│   └── Ribbon.tsx           # Interactive draggable ribbon tails
├── FlowerBurst/
│   └── FlowerBurst.tsx      # Flower explosion animation sequence
├── LoveLetter/
│   └── LoveLetter.tsx       # Love letter display & editor
├── FloatingFlowers/
│   └── FloatingFlowers.tsx  # Background floating flowers
├── Sparkles/
│   └── Sparkles.tsx         # Twinkling sparkle effects
└── FloatingHearts/
    └── FloatingHearts.tsx   # Floating heart animations
```

## 🎬 Animation Timeline

1. **Initial State** (0s)
   - Gift box gently floats up and down
   - Flowers slowly drift around
   - Sparkles twinkle softly
   - Hearts float upward

2. **Ribbon Drag** (When >150px pulled)
   - Ribbon stretches with physics
   - Spring-back effect on release
   - Jiggles slightly with bounce

3. **Gift Opening** (1-2s)
   - Gift box shakes
   - Lid rotates open
   - Bright glow emerges

4. **Flower Burst** (2-6s)
   - Flowers explode outward
   - Full-screen flower transition
   - Magical particle effects

5. **Letter Reveal** (6s+)
   - Letter fades in
   - Gentle background animations
   - Edit button becomes available

## 🛠️ Technologies Used

- **Framework**: Next.js 16.2.7 with React 19
- **Animation**: Framer Motion + GSAP
- **Styling**: Tailwind CSS 4
- **Physics**: React Spring (optional for enhanced interactions)
- **Development**: TypeScript 5

## 📦 Dependencies

```json
{
  "framer-motion": "Latest",
  "gsap": "Latest",
  "react-spring": "Latest",
  "matter-js": "Latest"
}
```

## 🎯 How to Use

1. **Load the website** - Beautiful gift box appears with instructions
2. **Follow instructions** - "✨ Drag the ribbon to open the gift ✨"
3. **Drag the ribbon** - Click and drag either ribbon tail downward
4. **Watch magic happen** - Gift opens with animations
5. **Enjoy the letter** - Beautiful love letter appears
6. **Edit if desired** - Click "Edit Letter" to customize the message

## 📱 Responsive Design

- Optimized for desktop (1920x1080 and up)
- Mobile-responsive with touch support
- Smooth animations at 60 FPS
- Optimized asset loading

## ✨ Special Features

### Ambient Effects
- **Soft Glow**: Gentle glowing shadows on flowers
- **Parallax**: Subtle background movement
- **Blur Effects**: Glassmorphism on letter page
- **Particle System**: Magical sparkle effects

### Interactive Feedback
- Pull progress indicator bar
- Cursor changes on hoverable elements
- Smooth spring animations
- Responsive to user input

### Romantic Touches
- Cursive fonts for elegance
- Heart emojis for romance
- Envelope seal (💌) animation
- Handwritten-style text

## 🔧 Performance Optimizations

- Code splitting by component
- Lazy-loaded animations
- Optimized SVG rendering
- Efficient particle management
- CSS animations where possible

## 📸 Screenshots

The website features:
- Beautiful pink gradient background
- Elegant gift box with shadows
- Interactive ribbon system
- Magical flower animations
- Romantic love letter display

## 💡 Tips for Customization

### Change Colors
Update the color values in:
- `app/globals.css` - Background gradient
- `components/GiftBox/GiftBox.tsx` - Box colors
- `components/Ribbon/Ribbon.tsx` - Ribbon colors
- `components/FloatingFlowers/FloatingFlowers.tsx` - Flower colors

### Adjust Animation Speed
- Gift opening: Modify transition duration in `GiftBox.tsx`
- Flower burst: Adjust duration in `FlowerBurst.tsx`
- Floating effects: Change animation timing in individual components

### Add Sound Effects
Uncomment and implement audio in `app/page.tsx`:
- `ribbonPullAudioRef` - For ribbon interactions
- `openAudioRef` - For gift opening
- `burstAudioRef` - For flower burst

## 🎓 Learning Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [GSAP Docs](https://greensock.com/gsap/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)

## 💖 Final Notes

This website is built with love, designed to create a magical, romantic experience. Every detail—from colors to animations to interactions—has been carefully crafted to make your girlfriend feel special.

The experience should feel like: **"Opening a magical pink gift that reveals a heartfelt love letter written just for her."**

---

**Built with ❤️ for someone special**
