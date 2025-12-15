# UI Design Rules for Claude Code

This document provides strict guidelines for Claude Code when designing and implementing UI components for the alshami_store project.

## 0. Core Principles

### Simplicity First

**KEEP EVERYTHING SIMPLE. DO NOT OVERCOMPLICATE.**

- Write clean, minimal code
- Avoid unnecessary abstractions
- Don't add features that weren't requested
- Keep component structure flat and straightforward
- Prefer simple solutions over clever ones
- If something can be done in 5 lines instead of 20, do it in 5
- Don't create custom hooks, utilities, or helpers unless absolutely necessary
- Focus on the task at hand - nothing more, nothing less

### Modern & Appealing Design

**WHEN IMPLEMENTING UI, ALWAYS CREATE MODERN, VISUALLY APPEALING DESIGNS**

When the user asks for UI-related implementations, default to creating:

- **Modern aesthetics**: Use contemporary design patterns, clean layouts, and professional spacing
- **Visual hierarchy**: Clear distinction between primary and secondary elements using size, color, and weight
- **Thoughtful spacing**: Generous whitespace, proper padding, and balanced margins
- **Engaging interactions**: Smooth hover states, subtle transitions, and intuitive feedback
- **Professional polish**: Attention to details like rounded corners, shadows, and borders
- **Responsive design**: Mobile-first approach that looks great on all screen sizes
- **Brand consistency**: Use the color system thoughtfully to create cohesive, on-brand experiences

**Examples of modern design choices:**
- Use cards with subtle shadows for content grouping
- Add hover effects with `transition-colors` or `transition-transform`
- Implement proper visual hierarchy with typography utilities
- Use icons from Lucide React to enhance clarity
- Apply subtle backgrounds (`bg-muted`, `bg-accent`) to create depth
- Add badges, tags, or labels to highlight important information
- Create clear call-to-action buttons with appropriate sizing and prominence
- Use grid or flex layouts for clean, organized content

**The goal**: Every UI implementation should feel polished, professional, and delightful to use - not just functional.

## 1. Component Library

**MUST USE shadcn/ui components exclusively**

- All UI components MUST be from the shadcn/ui library
- Install components using: `npx shadcn@latest add [component-name]`
- Components are configured with:
  - Style: **New York**
  - Base color: **Slate**
  - Icon library: **Lucide React**
  - RSC (React Server Components): **Enabled**

### Available shadcn/ui Components

Before creating custom components, check if shadcn/ui provides:
- Layout: Card, Separator, Tabs, Accordion, Collapsible
- Forms: Input, Button, Checkbox, Radio, Select, Textarea, Label, Form
- Navigation: NavigationMenu, Dropdown Menu, Context Menu, Menubar, Breadcrumb
- Feedback: Alert, Toast, Dialog, Alert Dialog, Sheet, Popover, Tooltip
- Data: Table, Data Table, Badge, Avatar, Progress, Skeleton
- Typography: Typography components with proper hierarchy

**Installation Path**: All shadcn/ui components install to `components/ui/`

## 2. Color System

**ONLY USE CSS VARIABLES from globals.css**

### Available Color Variables

All colors are defined in globals.css using the OKLCH color space with automatic dark mode support.

#### Semantic Colors (MUST USE THESE)

```css
/* Base Colors */
bg-background          /* Main background color */
text-foreground        /* Main text color */

/* UI Elements */
bg-card                /* Card backgrounds */
text-card-foreground   /* Card text */
bg-popover             /* Popover/dropdown backgrounds */
text-popover-foreground /* Popover text */

/* Brand & Actions */
bg-primary             /* Primary brand color (purple/blue) */
text-primary-foreground /* Text on primary backgrounds */
bg-secondary           /* Secondary backgrounds */
text-secondary-foreground /* Text on secondary backgrounds */

/* States */
bg-muted               /* Muted/disabled backgrounds */
text-muted-foreground  /* Muted/secondary text */
bg-accent              /* Accent/hover states */
text-accent-foreground /* Text on accent backgrounds */
bg-destructive         /* Error/danger states */

/* Borders & Inputs */
border-border          /* Border colors */
border-input           /* Input field borders */
ring-ring              /* Focus ring colors */

/* Charts (if needed) */
bg-chart-1 through bg-chart-5 /* Data visualization */

/* Sidebar (if implemented) */
bg-sidebar, text-sidebar-foreground, bg-sidebar-primary, etc.
```

### Color Usage Rules

1. **NEVER** use arbitrary color values like `bg-blue-500`, `text-red-600`, etc.
2. **ALWAYS** use semantic CSS variables: `bg-primary`, `text-foreground`, `border-border`
3. **AUTOMATIC** dark mode support - colors automatically adapt
4. **NO** custom color definitions without updating globals.css

### Examples

✅ **CORRECT**:
```tsx
<div className="bg-background text-foreground border-border">
  <Button className="bg-primary text-primary-foreground">Click me</Button>
  <p className="text-muted-foreground">Secondary text</p>
</div>
```

❌ **INCORRECT**:
```tsx
<div className="bg-white text-gray-900 border-gray-200">
  <Button className="bg-blue-600 text-white">Click me</Button>
  <p className="text-gray-500">Secondary text</p>
</div>
```

## 3. Layout Wrapper

**MUST USE `.wrapper` class for content containers**

### Wrapper Definition

Defined in globals.css:

```css
.wrapper {
  @apply max-w-7xl lg:mx-auto p-5 md:px-10 w-full;
}
```

### Wrapper Specifications

- **Max width**: 7xl (1280px)
- **Centering**: Auto margins on large screens (`lg:mx-auto`)
- **Padding**:
  - Default: `p-5` (1.25rem all sides)
  - Medium+: `md:px-10` (2.5rem horizontal padding)
- **Width**: Full width (`w-full`)

### When to Use Wrapper

**ALWAYS use `.wrapper`** for:
- Page content sections
- Main content areas
- Container components that need consistent max-width
- Header/Footer inner content
- Forms and content blocks

### Wrapper Usage Examples

✅ **CORRECT**:
```tsx
// Page layout
export default function HomePage() {
  return (
    <main className="wrapper">
      <h1 className="h1-bold">Welcome</h1>
      {/* content */}
    </main>
  );
}

// Section component
<section className="bg-muted">
  <div className="wrapper">
    <h2 className="h2-bold">Section Title</h2>
    {/* content */}
  </div>
</section>

// Header component
<header className="border-b border-border">
  <div className="wrapper flex items-center justify-between">
    <Logo />
    <Navigation />
  </div>
</header>
```

❌ **INCORRECT**:
```tsx
// Don't create custom containers
<div className="max-w-6xl mx-auto px-4">
  {/* content */}
</div>

// Don't use arbitrary max-width
<div className="container mx-auto">
  {/* content */}
</div>
```

## 4. Typography Utilities

**USE predefined heading classes from globals.css**

### Available Typography Classes

Defined in globals.css:

```css
.h1-bold  /* font-bold text-3xl lg:text-4xl */
.h2-bold  /* font-bold text-2xl lg:text-3xl */
.h3-bold  /* font-bold text-xl lg:text-2xl */
```

### Typography Usage

✅ **CORRECT**:
```tsx
<h1 className="h1-bold">Main Page Title</h1>
<h2 className="h2-bold">Section Heading</h2>
<h3 className="h3-bold">Subsection</h3>
<p className="text-muted-foreground">Body text with muted color</p>
```

❌ **INCORRECT**:
```tsx
<h1 className="text-4xl font-bold">Title</h1>
<h2 className="text-2xl font-semibold">Section</h2>
```

## 5. Design Workflow

### Step-by-Step Process

1. **Identify Components**: Determine which shadcn/ui components are needed
2. **Install Components**: Run `npx shadcn@latest add [component-name]` for each
3. **Apply Wrapper**: Use `.wrapper` class for main content containers
4. **Use Semantic Colors**: Apply only CSS variables from globals.css
5. **Apply Typography**: Use `.h1-bold`, `.h2-bold`, `.h3-bold` classes
6. **Responsive Design**: Leverage Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)

### Component Installation Priority

Before writing any custom UI code:
1. Check if shadcn/ui has the component
2. Install it with `npx shadcn@latest add [component]`
3. Import and use it with proper props

### Example: Building a Product Card

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
        <CardDescription className="text-muted-foreground">
          {product.category}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{product.description}</p>
      </CardContent>
      <CardFooter>
        <Button className="bg-primary text-primary-foreground">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
```

## 6. Important Reminders

### DO:
✅ Use shadcn/ui components exclusively
✅ Use CSS variables from globals.css for all colors
✅ Use `.wrapper` class for content containers
✅ Use `.h1-bold`, `.h2-bold`, `.h3-bold` for headings
✅ Leverage semantic color names (`bg-primary`, `text-muted-foreground`)
✅ Use Tailwind utility classes for spacing, layout, and responsive design
✅ Install components before using them: `npx shadcn@latest add [component]`

### DON'T:
❌ Create custom UI components that shadcn/ui already provides
❌ Use arbitrary color classes like `bg-blue-500` or `text-red-600`
❌ Use custom hex/rgb color values
❌ Create custom container classes instead of `.wrapper`
❌ Use arbitrary text size classes instead of typography utilities
❌ Skip installing shadcn/ui components

## 7. Path Aliases

Use these TypeScript path aliases when importing:

```tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCustomHook } from "@/hooks/useCustomHook";
```

Available aliases:
- `@/*` - Root directory
- `@/components` - Components directory
- `@/lib` - Library/utilities
- `@/hooks` - Custom React hooks

## 8. Accessibility

shadcn/ui components come with built-in accessibility features:
- Always use semantic HTML through shadcn components
- Ensure proper ARIA labels are maintained
- Test keyboard navigation
- Maintain color contrast ratios (handled by CSS variables)

## Summary

When designing UI for alshami_store:
1. **Components**: shadcn/ui only
2. **Colors**: CSS variables from globals.css only
3. **Layout**: `.wrapper` class for containers
4. **Typography**: `.h1-bold`, `.h2-bold`, `.h3-bold` classes
5. **Installation**: `npx shadcn@latest add [component]` before use

Following these rules ensures consistent, maintainable, and accessible UI across the entire application.
