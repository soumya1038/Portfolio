# Design System Reference Guide

## Quick CSS Variables Reference

Copy and use these variables in your components:

### Colors

```css
/* Primary & Accent */
var(--primary)          /* #4f46e5 - Indigo */
var(--primary-dark)     /* #4338ca */
var(--primary-light)    /* #818cf8 */
var(--accent)           /* #22d3ee - Cyan */
var(--accent-dark)      /* #06b6d4 */
var(--accent-light)     /* #67e8f9 */

/* Backgrounds */
var(--bg-dark)          /* #0f172a */
var(--bg-darker)        /* #020617 */
var(--bg-light)         /* #1e293b */

/* Text */
var(--text-primary)     /* #f1f5f9 */
var(--text-secondary)   /* #cbd5e1 */
var(--text-tertiary)    /* #94a3b8 */
var(--border)           /* #334155 */

/* Semantic */
var(--success)          /* #10b981 - Green */
var(--warning)          /* #f59e0b - Amber */
var(--error)            /* #ef4444 - Red */
var(--info)             /* #3b82f6 - Blue */
```

### Spacing

```css
var(--spacing-xs)       /* 0.25rem - 4px */
var(--spacing-sm)       /* 0.5rem - 8px */
var(--spacing-md)       /* 1rem - 16px */
var(--spacing-lg)       /* 1.5rem - 24px */
var(--spacing-xl)       /* 2rem - 32px */
var(--spacing-2xl)      /* 3rem - 48px */
var(--spacing-3xl)      /* 4rem - 64px */
```

### Typography

```css
var(--text-xs)          /* 0.75rem - 12px */
var(--text-sm)          /* 0.875rem - 14px */
var(--text-base)        /* 1rem - 16px */
var(--text-lg)          /* 1.125rem - 18px */
var(--text-xl)          /* 1.25rem - 20px */
var(--text-2xl)         /* 1.5rem - 24px */
var(--text-3xl)         /* 1.875rem - 30px */
var(--text-4xl)         /* 2.25rem - 36px */
var(--text-5xl)         /* 3rem - 48px */
var(--text-6xl)         /* 3.75rem - 60px */
```

### Border Radius

```css
var(--radius-sm)        /* 0.375rem - 6px */
var(--radius-md)        /* 0.5rem - 8px */
var(--radius-lg)        /* 0.75rem - 12px */
var(--radius-xl)        /* 1rem - 16px */
var(--radius-2xl)       /* 1.5rem - 24px */
```

### Transitions

```css
var(--transition-fast)  /* 150ms cubic-bezier(0.4, 0, 0.2, 1) */
var(--transition-base)  /* 200ms cubic-bezier(0.4, 0, 0.2, 1) */
var(--transition-slow)  /* 300ms cubic-bezier(0.4, 0, 0.2, 1) */
```

### Shadows

```css
var(--shadow-sm)        /* 0 1px 2px rgba(0, 0, 0, 0.05) */
var(--shadow-md)        /* 0 4px 6px -1px rgba(0, 0, 0, 0.1) */
var(--shadow-lg)        /* 0 10px 15px -3px rgba(0, 0, 0, 0.1) */
var(--shadow-xl)        /* 0 20px 25px -5px rgba(0, 0, 0, 0.1) */
var(--shadow-glow)      /* 0 0 20px rgba(79, 70, 229, 0.3) */
```

---

## Component Classes

### Buttons

```html
<!-- Primary Button -->
<button class="btn-primary">Click me</button>

<!-- Secondary Button -->
<button class="btn-secondary">Click me</button>
```

### Cards

```html
<div class="card">
  <!-- Card content -->
</div>
```

### Badges

```html
<span class="badge">React</span>
<span class="badge">Node.js</span>
```

### Sections

```html
<!-- Dark Section -->
<section class="section section-dark">
  <!-- Content -->
</section>

<!-- Light Section -->
<section class="section section-light">
  <!-- Content -->
</section>
```

---

## Animations

### Predefined Animations

```html
<!-- Fade in from bottom -->
<div class="animate-fade-in-up">Content</div>

<!-- Fade in from top -->
<div class="animate-fade-in-down">Content</div>

<!-- Slide in from left -->
<div class="animate-slide-in-right">Content</div>

<!-- Pulsing glow -->
<div class="animate-pulse-glow">Content</div>
```

### Custom Animation Examples

```css
/* Fade in up with delay */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

/* With delay for staggered effect */
.animate-fade-in-up {
  animation-delay: 0.2s;
}
```

---

## Usage Examples

### Example 1: Creating a New Component

```tsx
'use client'

export default function MyComponent() {
  return (
    <section className="section section-dark">
      <div className="container-custom">
        <h2 className="heading">My Section</h2>
        <p className="text-lg text-gray-300">
          Using the design system...
        </p>
        <button className="btn-primary">
          Action
        </button>
      </div>
    </section>
  )
}
```

### Example 2: Using Design System Variables

```css
.my-component {
  background: var(--bg-light);
  color: var(--text-primary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
}

.my-component:hover {
  background: var(--bg-dark);
  box-shadow: var(--shadow-glow), var(--shadow-lg);
}
```

### Example 3: Responsive Card Grid

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="card">
    <h3 class="text-xl font-bold text-white">Item 1</h3>
    <p class="text-gray-400">Description</p>
  </div>
  <!-- More cards -->
</div>
```

---

## Color Combinations

### Primary Colors
- **Primary + Text**: Indigo on dark background ✓
- **Accent + Text**: Cyan on dark background ✓
- **Primary + Accent**: Gradient for emphasis ✓

### Semantic Colors
- **Success**: Green (#10b981) - For positive actions
- **Error**: Red (#ef4444) - For destructive actions
- **Warning**: Amber (#f59e0b) - For caution
- **Info**: Blue (#3b82f6) - For information

---

## Typography Hierarchy

### Page Title (H1)
```html
<h1 class="heading">Main Page Title</h1>
<!-- Uses: var(--text-5xl or 6xl), font-weight: 700 -->
```

### Section Title (H2)
```html
<h2 class="heading">Section Title</h2>
<!-- Uses: var(--text-4xl or 5xl), font-weight: 700 -->
```

### Subsection Title (H3)
```html
<h3 class="text-3xl font-bold">Subsection</h3>
<!-- Uses: var(--text-3xl), font-weight: 700 -->
```

### Body Text
```html
<p class="text-base text-gray-300">
  Regular body text
</p>
<!-- Uses: var(--text-base), color: var(--text-primary or secondary) -->
```

---

## Responsive Design Breakpoints

Tailwind CSS breakpoints used:

```
sm: 640px   (small screens)
md: 768px   (medium screens)
lg: 1024px  (large screens)
xl: 1280px  (extra large)
2xl: 1536px (2x large)
```

Usage:
```html
<!-- Default: 1 column, md+: 2 columns, lg+: 3 columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"></div>
```

---

## Interactive States

### Button States
```html
<!-- Normal -->
<button class="btn-primary">Button</button>

<!-- Hover (automatic) -->
<!-- Uses: transform: translateY(-2px), box-shadow: glow -->

<!-- Active (automatic) -->
<!-- Uses: transform: translateY(0) -->

<!-- Disabled -->
<button class="btn-primary opacity-50 cursor-not-allowed" disabled>
  Button
</button>
```

### Card Hover
```html
<div class="card group">
  <!-- Card lift effect on hover -->
  <!-- Border color changes to accent -->
  <!-- Shadow becomes more pronounced -->
</div>
```

---

## Best Practices

### ✅ DO
- Use CSS variables for all color values
- Use consistent spacing scale
- Use predefined animations
- Use proper semantic HTML
- Test on multiple screen sizes

### ❌ DON'T
- Don't hardcode colors (use variables)
- Don't use arbitrary spacing values
- Don't create custom animations
- Don't mix light and dark themes
- Don't forget mobile optimization

---

## Accessibility Checklist

- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Interactive elements are 44x44px minimum
- [ ] Focus states are visible
- [ ] Semantic HTML is used
- [ ] Alt text for images
- [ ] Proper heading hierarchy
- [ ] Keyboard navigation works
- [ ] Animations respect prefers-reduced-motion

---

## Performance Tips

1. **Use CSS Variables** - Reduces CSS file size
2. **Lazy Load Images** - Add `loading="lazy"`
3. **Optimize Animations** - Use `transform` and `opacity`
4. **Minimize Reflows** - Batch DOM updates
5. **Use Transitions** - Smooth interactions feel faster

---

## Debugging

### Check CSS Variables
```js
// In browser console:
getComputedStyle(document.documentElement)
  .getPropertyValue('--primary')
```

### Test Responsive Design
- Use DevTools device emulation
- Test on real devices
- Check all breakpoints

### Performance Audit
- Use Lighthouse in DevTools
- Check CLS, LCP, FID metrics
- Optimize images and bundle size

---

## Additional Resources

- [CSS Variables MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

## Questions?

Refer to the design system CSS variables in [globals.css](../src/app/globals.css) for the complete reference.

All colors, spacing, and animations are defined at the top of the file for easy access and modification.

