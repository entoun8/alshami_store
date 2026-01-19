# UI Design Rules for Claude Code

Strict guidelines for designing and implementing UI components for alshami_store.

## 0. Core Principles

### Simplicity First
- Write clean, minimal code - avoid unnecessary abstractions
- Don't add unrequested features or create custom hooks/utilities unless necessary
- Keep component structure flat and straightforward
- If it can be done in 5 lines instead of 20, do it in 5
- Focus on the task at hand - nothing more, nothing less

### Modern & Appealing Design
Create polished, professional UI that's delightful to use:
- **Visual hierarchy**: Clear distinction between elements using size, color, and weight
- **Thoughtful spacing**: Generous whitespace, proper padding and margins
- **Engaging interactions**: Smooth hover states, subtle transitions, intuitive feedback
- **Responsive**: Mobile-first approach that looks great on all screen sizes
- **Brand consistency**: Use the color system for cohesive experiences

**Modern design patterns:**
- Cards with subtle shadows, hover effects with `transition-colors` or `transition-transform`
- Icons from Lucide React, subtle backgrounds (`bg-muted`, `bg-accent`) for depth
- Badges/tags for highlights, clear CTAs with appropriate sizing
- Grid or flex layouts for clean organization

## 1. Component Library

**MUST USE shadcn/ui components exclusively** - Install: `npx shadcn@latest add [component-name]`

Configuration: Style **New York**, Base color **Slate**, Icons **Lucide React**, RSC **Enabled**

**Available Components** (install to `components/ui/`):
- **Layout**: Card, Separator, Tabs, Accordion, Collapsible
- **Forms**: Input, Button, Checkbox, Radio, Select, Textarea, Label, Form
- **Navigation**: NavigationMenu, Dropdown Menu, Context Menu, Menubar, Breadcrumb
- **Feedback**: Alert, Toast, Dialog, Alert Dialog, Sheet, Popover, Tooltip
- **Data**: Table, Data Table, Badge, Avatar, Progress, Skeleton

## 2. Color System

**ONLY USE CSS VARIABLES** - NEVER use `bg-blue-500`, `text-red-600`, etc.

**Semantic Colors** (defined in globals.css with automatic dark mode):
```css
/* Base */
bg-background, text-foreground

/* UI Elements */
bg-card, text-card-foreground
bg-popover, text-popover-foreground

/* Brand & Actions */
bg-primary, text-primary-foreground         /* Primary brand (purple/blue) */
bg-secondary, text-secondary-foreground

/* States */
bg-muted, text-muted-foreground             /* Muted/disabled/secondary */
bg-accent, text-accent-foreground           /* Accent/hover states */
bg-destructive                              /* Error/danger */

/* Borders & Inputs */
border-border, border-input, ring-ring

/* Charts & Sidebar */
bg-chart-1 through bg-chart-5, bg-sidebar, text-sidebar-foreground, etc.
```

✅ **CORRECT**: `bg-background text-foreground border-border`
❌ **INCORRECT**: `bg-white text-gray-900 border-gray-200`

## 3. Layout Wrapper

**MUST USE `.wrapper` class** - Defined in globals.css as `max-w-7xl lg:mx-auto p-5 md:px-10 w-full`

Provides: Max-width 1280px, centered on large screens, responsive padding

**Use for**: Pages, sections, headers, footers, forms, any content needing consistent max-width

✅ **CORRECT**:
```tsx
<main className="wrapper">
  <h1 className="h1-bold">Welcome</h1>
</main>

<section className="bg-muted">
  <div className="wrapper">
    <h2 className="h2-bold">Section Title</h2>
  </div>
</section>
```

❌ **INCORRECT**: `<div className="max-w-6xl mx-auto px-4">` or `<div className="container mx-auto">`

## 4. Typography

**USE predefined classes** from globals.css:
- `.h1-bold` - `font-bold text-3xl lg:text-4xl`
- `.h2-bold` - `font-bold text-2xl lg:text-3xl`
- `.h3-bold` - `font-bold text-xl lg:text-2xl`

✅ **CORRECT**: `<h1 className="h1-bold">Title</h1>`
❌ **INCORRECT**: `<h1 className="text-4xl font-bold">Title</h1>`

## 5. Workflow

1. Check if shadcn/ui has the component → Install with `npx shadcn@latest add [component]`
2. Use `.wrapper` class for main containers
3. Use CSS variables for colors (never arbitrary classes)
4. Use typography utilities (`.h1-bold`, `.h2-bold`, `.h3-bold`)
5. Leverage Tailwind responsive prefixes (`sm:`, `md:`, `lg:`)

**Example - Product Card:**
```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }) {
  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <Badge className="bg-primary text-primary-foreground">New</Badge>
        <CardTitle className="h3-bold">{product.name}</CardTitle>
        <CardDescription className="text-muted-foreground">{product.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{product.description}</p>
      </CardContent>
      <CardFooter>
        <Button className="bg-primary text-primary-foreground">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}
```

## 6. Quick Reference

### DO:
✅ Use shadcn/ui components exclusively - install with `npx shadcn@latest add [component]`
✅ Use CSS variables for colors (`bg-primary`, `text-muted-foreground`)
✅ Use `.wrapper` for content containers
✅ Use `.h1-bold`, `.h2-bold`, `.h3-bold` for headings

### DON'T:
❌ Create custom components that shadcn/ui provides
❌ Use arbitrary colors (`bg-blue-500`, `text-red-600`, hex/rgb values)
❌ Create custom containers instead of `.wrapper`
❌ Use arbitrary text sizes instead of typography utilities

### Path Aliases
```tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
```

Available: `@/*` (root), `@/components`, `@/lib`, `@/hooks`

### Accessibility
shadcn/ui provides built-in accessibility - maintain semantic HTML, ARIA labels, keyboard navigation, and color contrast (handled by CSS variables).
