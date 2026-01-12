# Green Box Component - Design Specifications

## Component Overview
A prominent call-to-action card with gradient background and floating elements.

## Dimensions
- **Width**: 100% of container (responsive)
- **Height**: Auto (content-driven)
- **Padding**: 24px all sides
- **Border Radius**: 24px

## Colors
- **Background**: Linear gradient 135°
  - Start: `hsl(142, 76%, 36%)` (#22c55e)
  - End: `hsl(142, 76%, 46%)` (#16a34a)
- **Text Color**: White (#ffffff)
- **Subtext Color**: White with 80% opacity (rgba(255, 255, 255, 0.8))
- **Button Background**: White with 20% opacity (rgba(255, 255, 255, 0.2))
- **Button Border**: White with 20% opacity (rgba(255, 255, 255, 0.2))

## Typography
- **Heading**: "Protect Your Crops"
  - Font: Poppins, Bold (600)
  - Size: 24px (1.5rem)
  - Line Height: 1.2
  - Color: White
  - Margin Bottom: 8px

- **Subtext**: "Detect diseases early and get expert treatment recommendations instantly."
  - Font: Inter, Regular (400)
  - Size: 14px (0.875rem)
  - Line Height: 1.4
  - Color: White 80% opacity
  - Max Width: 200px
  - Margin Bottom: 24px

## Button Specifications
- **Text**: "Scan Your Crop"
- **Font**: Inter, Medium (500)
- **Size**: 14px (0.875rem)
- **Padding**: 12px 24px
- **Border Radius**: 8px
- **Background**: White 20% opacity with backdrop blur
- **Border**: 1px solid white 20% opacity
- **Icon**: Camera icon (20px × 20px)
- **Gap**: 8px between icon and text
- **Min Height**: 44px (accessibility)
- **Hover State**: Background changes to white 30% opacity

## Decorative Elements

### Background Blur Circle
- **Position**: Absolute, bottom-right (-32px right, -32px bottom)
- **Size**: 160px × 160px
- **Background**: White 10% opacity
- **Blur**: 48px
- **Border Radius**: 50% (circle)

### Floating Leaf Element
- **Position**: Absolute, top-right (16px from top, 16px from right)
- **Size**: 96px × 96px container
- **Background**: White 20% opacity
- **Border Radius**: 50% (circle)
- **Animation**: Floating up and down (8px range, 3s duration, infinite)
- **Icon**: Leaf icon (48px × 48px, white 60% opacity)

## Shadow
- **Box Shadow**: `0 0 40px -10px hsl(142 76% 36% / 0.4)`
- **Effect**: Soft glow matching the gradient color

## Responsive Behavior
- **Mobile (≤576px)**: Full width, maintain padding
- **Tablet (576px-768px)**: Max width with centered alignment
- **Desktop (≥768px)**: Fixed max width, left-aligned content

## Animation
- **Initial State**: Opacity 0, translateY(20px)
- **Final State**: Opacity 1, translateY(0)
- **Duration**: 0.6s ease-out
- **Delay**: 0.1s (for staggered animations)

## Accessibility
- **Button**: Minimum 44px touch target
- **Focus State**: Visible outline for keyboard navigation
- **Screen Reader**: Proper ARIA labels
- **Color Contrast**: Meets WCAG AA standards

## Figma Instructions
1. Create a rectangle (343px × 200px for mobile reference)
2. Apply gradient background (135° angle)
3. Set border radius to 24px
4. Add text layers with specified typography
5. Create button with glass effect (use background blur if available)
6. Add decorative circles with blur effects
7. Position leaf icon with floating animation
8. Apply drop shadow for glow effect

## CSS Classes (for developers)
```css
.green-box {
  background: linear-gradient(135deg, hsl(142, 76%, 36%) 0%, hsl(142, 76%, 46%) 100%);
  border-radius: 24px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 40px -10px hsl(142 76% 36% / 0.4);
}

.green-box-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  font-weight: 500;
  transition: all 0.2s ease;
}

.green-box-button:hover {
  background: rgba(255, 255, 255, 0.3);
}
```