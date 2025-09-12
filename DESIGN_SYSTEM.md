# Gym Logger Design System

_Tailwind CSS + shadcn/ui Implementation_

## Brand Identity

### Logo

- **Primary Logo**: Gym Logger with dumbbell, checklist, and pencil icon
- **Icon Elements**:
  - Dumbbell (fitness/training)
  - Checklist/clipboard (tracking/logging)
  - Pencil (editing/recording)
- **Colors**: Metallic gold/bronze icon on dark background
- **Typography**: Clean, modern sans-serif, white text

### Brand Values

- **Professional**: Clean, trustworthy interface
- **Motivational**: Encouraging progress tracking
- **Efficient**: Quick and easy workout logging
- **Modern**: Contemporary design with excellent UX

## Tailwind Color Configuration

### Primary Colors (Navy Blue Theme)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Brand Navy Blue
        navy: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#243b53",
          900: "#102a43",
          950: "#0a1a2e",
        },
        // Brand Primary (Navy)
        primary: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#2c3e50", // Main brand color
          600: "#34495e",
          700: "#1a252f",
          800: "#243b53",
          900: "#102a43",
          950: "#0a1a2e",
        },
        // Gold/Accent Colors
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        // Success/Progress
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        // Warning/Attention
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        // Error/Danger
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
      },
    },
  },
};
```

### CSS Custom Properties (for shadcn/ui)

```css
/* globals.css */
@layer base {
  :root {
    /* Brand Colors */
    --brand-navy: 44 62 80; /* #2c3e50 */
    --brand-navy-light: 52 73 94; /* #34495e */
    --brand-navy-dark: 26 37 47; /* #1a252f */

    /* Gold Accent */
    --brand-gold: 245 158 11; /* #f59e0b */
    --brand-gold-light: 217 119 6; /* #d97706 */
    --brand-gold-dark: 180 83 9; /* #b45309 */

    /* Background */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    /* Card */
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    /* Popover */
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    /* Primary (Navy) */
    --primary: 44 62 80; /* #2c3e50 */
    --primary-foreground: 210 40% 98%;

    /* Secondary */
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;

    /* Muted */
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;

    /* Accent (Gold) */
    --accent: 245 158 11; /* #f59e0b */
    --accent-foreground: 222.2 84% 4.9%;

    /* Destructive */
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    /* Border */
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 44 62 80; /* Brand navy for focus rings */

    /* Radius */
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 44 62 80; /* Keep navy in dark mode */
    --primary-foreground: 210 40% 98%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 245 158 11; /* Keep gold accent */
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 44 62 80;
  }
}
```

## Typography Configuration

### Font Families (Tailwind Config)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
    },
  },
};
```

### Typography Classes

```css
/* Display Text */
.text-display-2xl {
  @apply text-6xl font-bold tracking-tight;
} /* 72px */
.text-display-xl {
  @apply text-5xl font-bold tracking-tight;
} /* 60px */
.text-display-lg {
  @apply text-4xl font-bold tracking-tight;
} /* 48px */
.text-display-md {
  @apply text-3xl font-bold tracking-tight;
} /* 36px */
.text-display-sm {
  @apply text-2xl font-bold tracking-tight;
} /* 30px */

/* Headings */
.text-h1 {
  @apply text-3xl font-bold tracking-tight;
} /* 36px */
.text-h2 {
  @apply text-2xl font-semibold tracking-tight;
} /* 30px */
.text-h3 {
  @apply text-xl font-semibold tracking-tight;
} /* 24px */
.text-h4 {
  @apply text-lg font-semibold tracking-tight;
} /* 20px */
.text-h5 {
  @apply text-base font-semibold tracking-tight;
} /* 18px */
.text-h6 {
  @apply text-sm font-semibold tracking-tight;
} /* 16px */

/* Body Text */
.text-body-xl {
  @apply text-xl leading-relaxed;
} /* 20px */
.text-body-lg {
  @apply text-lg leading-relaxed;
} /* 18px */
.text-body {
  @apply text-base leading-relaxed;
} /* 16px */
.text-body-sm {
  @apply text-sm leading-relaxed;
} /* 14px */
.text-body-xs {
  @apply text-xs leading-relaxed;
} /* 12px */
```

## Spacing System

### Base Spacing Unit

```css
--spacing-unit: 0.25rem /* 4px base unit */;
```

### Spacing Scale

```css
--space-0: 0 --space-1: 0.25rem /* 4px */ --space-2: 0.5rem /* 8px */
  --space-3: 0.75rem /* 12px */ --space-4: 1rem /* 16px */ --space-5: 1.25rem
  /* 20px */ --space-6: 1.5rem /* 24px */ --space-8: 2rem /* 32px */
  --space-10: 2.5rem /* 40px */ --space-12: 3rem /* 48px */ --space-16: 4rem
  /* 64px */ --space-20: 5rem /* 80px */ --space-24: 6rem /* 96px */
  --space-32: 8rem /* 128px */;
```

## Border Radius

```css
--radius-none: 0 --radius-sm: 0.125rem /* 2px */ --radius-base: 0.25rem
  /* 4px */ --radius-md: 0.375rem /* 6px */ --radius-lg: 0.5rem /* 8px */
  --radius-xl: 0.75rem /* 12px */ --radius-2xl: 1rem /* 16px */
  --radius-3xl: 1.5rem /* 24px */ --radius-full: 9999px;
```

## Shadows

```css
/* Elevation Shadows */
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05) --shadow-sm: 0 1px 3px 0
    rgb(0 0 0 / 0.1),
  0 1px 2px -1px rgb(0 0 0 / 0.1) --shadow-base: 0 4px 6px -1px rgb(0 0 0 / 0.1),
  0 2px 4px -2px rgb(0 0 0 / 0.1) --shadow-md: 0 10px 15px -3px rgb(0 0 0 / 0.1),
  0 4px 6px -4px rgb(0 0 0 / 0.1) --shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1),
  0 8px 10px -6px rgb(0 0 0 / 0.1) --shadow-xl: 0 25px 50px -12px
    rgb(0 0 0 / 0.25) --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
    /* Colored Shadows */ --shadow-navy: 0 4px 14px 0 rgb(44 62 80 / 0.15)
    --shadow-gold: 0 4px 14px 0 rgb(245 158 11 / 0.15);
```

## shadcn/ui Component Guidelines

### Button Variants

```tsx
// Primary Button (Navy)
<Button className="bg-primary-500 hover:bg-primary-600 text-primary-foreground">
  Primary Action
</Button>

// Secondary Button (Outline)
<Button variant="outline" className="border-primary-500 text-primary-500 hover:bg-primary-50">
  Secondary Action
</Button>

// Accent Button (Gold)
<Button className="bg-gold-500 hover:bg-gold-600 text-white">
  Accent Action
</Button>

// Destructive Button
<Button variant="destructive">
  Delete
</Button>

// Ghost Button
<Button variant="ghost">
  Cancel
</Button>
```

### Card Components

```tsx
// Default Card
<Card className="border border-border shadow-sm">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>

// Elevated Card
<Card className="shadow-md border-0">
  <CardContent className="p-6">
    <p>Elevated card content</p>
  </CardContent>
</Card>

// Accent Card (Gold border)
<Card className="border-gold-200 bg-gold-50/50">
  <CardContent className="p-6">
    <p>Accent card with gold styling</p>
  </CardContent>
</Card>
```

### Form Components

```tsx
// Input Field
<Input
  className="border-input focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
  placeholder="Enter text..."
/>

// Label
<Label className="text-sm font-medium text-foreground">
  Field Label
</Label>

// Form Field with Error
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input
          type="email"
          {...field}
          className="border-input focus:ring-2 focus:ring-primary-500"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Navigation Components

```tsx
// Navbar
<nav className="border-b border-border bg-background shadow-sm h-16">
  <div className="container mx-auto px-4 h-full flex items-center">
    <Logo />
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className="text-muted-foreground hover:text-primary-500">
            Dashboard
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>
</nav>

// Sidebar Navigation
<aside className="w-64 border-r border-border bg-background">
  <nav className="p-4 space-y-2">
    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary-500">
      <Home className="mr-2 h-4 w-4" />
      Dashboard
    </Button>
  </nav>
</aside>
```

## Layout Guidelines

### Container Widths

```css
--container-sm: 640px --container-md: 768px --container-lg: 1024px
  --container-xl: 1280px --container-2xl: 1536px;
```

### Grid System

- **Base Grid**: 12 columns
- **Gap**: `--space-4` (16px)
- **Responsive Breakpoints**:
  - Mobile: 320px+
  - Tablet: 768px+
  - Desktop: 1024px+
  - Large Desktop: 1280px+

### Page Layout

- **Header Height**: `4rem`
- **Sidebar Width**: `16rem` (collapsed: `4rem`)
- **Content Padding**: `--space-6`
- **Max Content Width**: `--container-xl`

## Animation & Transitions

### Duration

```css
--duration-75: 75ms --duration-100: 100ms --duration-150: 150ms
  --duration-200: 200ms --duration-300: 300ms --duration-500: 500ms
  --duration-700: 700ms --duration-1000: 1000ms;
```

### Easing

```css
--ease-linear: linear --ease-in: cubic-bezier(0.4, 0, 1, 1)
  --ease-out: cubic-bezier(0, 0, 0.2, 1)
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Common Transitions

```css
--transition-fast: all --duration-150 --ease-out --transition-base: all
  --duration-200 --ease-out --transition-slow: all --duration-300 --ease-out;
```

## Accessibility Guidelines

### Color Contrast

- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Minimum 3:1 contrast ratio

### Focus States

- **Focus Ring**: `2px solid --brand-navy`
- **Focus Ring Offset**: `2px`
- **Focus Ring Radius**: `--radius-sm`

### Interactive Elements

- **Minimum Touch Target**: 44px × 44px
- **Hover States**: Required for all interactive elements
- **Loading States**: Required for async operations

## Dark Mode Support

### Dark Theme Colors

```css
/* Dark Backgrounds */
--dark-bg-primary: #0f172a --dark-bg-secondary: #1e293b
  --dark-bg-tertiary: #334155 /* Dark Text */ --dark-text-primary: #f8fafc
  --dark-text-secondary: #cbd5e1 --dark-text-tertiary: #94a3b8
  /* Dark Borders */ --dark-border-primary: #334155
  --dark-border-secondary: #475569;
```

## Implementation Steps

### 1. Update Tailwind Configuration

```bash
# Update tailwind.config.ts with the color palette above
```

### 2. Update Global CSS

```bash
# Add the CSS custom properties to app/globals.css
```

### 3. Install Required Fonts

```bash
# Add to your HTML head or use Next.js font optimization
npm install @next/font
```

### 4. Update shadcn/ui Components

```bash
# Update existing shadcn/ui components with new color scheme
npx shadcn-ui@latest add button card input label
```

### 5. Create Custom Components

```bash
# Create brand-specific components following the guidelines above
```

## Usage Examples

### Homepage Hero Section

```tsx
<section className="bg-gradient-to-br from-primary-50 to-primary-100 min-h-screen flex items-center">
  <div className="container mx-auto px-4 text-center">
    <h1 className="text-display-lg font-display text-primary-900 mb-6">
      Welcome to Gym Logger
    </h1>
    <p className="text-body-xl text-primary-700 mb-8 max-w-2xl mx-auto">
      Track your workouts, monitor your progress, and achieve your fitness
      goals.
    </p>
    <div className="flex gap-4 justify-center">
      <Button size="lg" className="bg-primary-500 hover:bg-primary-600">
        Get Started
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="border-primary-500 text-primary-500"
      >
        Learn More
      </Button>
    </div>
  </div>
</section>
```

### Workout Card Component

```tsx
<Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
  <CardHeader>
    <CardTitle className="text-h3 text-primary-900">Push Day</CardTitle>
    <CardDescription className="text-muted-foreground">
      Chest, Shoulders, Triceps
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-primary-600">45</p>
        <p className="text-sm text-muted-foreground">Sets</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-gold-600">2,250</p>
        <p className="text-sm text-muted-foreground">Total Weight</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-success-600">180</p>
        <p className="text-sm text-muted-foreground">Reps</p>
      </div>
    </div>
    <Button className="w-full bg-primary-500 hover:bg-primary-600">
      View Details
    </Button>
  </CardContent>
</Card>
```

## File Structure

```
app/
├── globals.css              # Global styles with CSS custom properties
├── layout.tsx              # Root layout with font imports
└── page.tsx                # Homepage

src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── layout/             # Layout components
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   └── custom/             # Custom brand components
│       ├── logo.tsx
│       ├── workout-card.tsx
│       └── progress-chart.tsx
├── lib/
│   ├── utils.ts            # Utility functions
│   └── constants.ts        # Design system constants
└── styles/
    └── components.css      # Component-specific styles
```

## Best Practices

1. **Use Tailwind Classes**: Prefer Tailwind utility classes over custom CSS
2. **Consistent Spacing**: Use the spacing scale (space-1, space-2, etc.)
3. **Color Semantics**: Use semantic color names (primary, secondary, accent)
4. **Responsive Design**: Always use responsive prefixes (sm:, md:, lg:, xl:)
5. **Component Composition**: Build complex components from simple shadcn/ui components
6. **Accessibility**: Ensure proper contrast ratios and focus states
7. **Performance**: Use CSS custom properties for theme switching
8. **Consistency**: Follow the established patterns for similar components
