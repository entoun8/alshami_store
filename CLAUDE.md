# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Alshami Store** - A modern e-commerce platform for premium herbs, coffees, and more, built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4.

## Development Commands

### Running the Application
```bash
npm run dev        # Start development server at http://localhost:3000
npm run build      # Create production build
npm start          # Start production server (run build first)
npm run lint       # Run ESLint
```

### Installing shadcn/ui Components
```bash
npx shadcn@latest add [component-name]
```

Components install to `components/ui/` with the following configuration:
- Style: **New York**
- Base color: **Slate**
- Icon library: **Lucide React**
- RSC (React Server Components): Enabled

## Architecture

### Project Structure

```
app/
├── (root)/          # Route group for main pages
│   ├── layout.tsx   # Root group layout wrapper
│   └── page.tsx     # Home page
├── layout.tsx       # Root layout (metadata, fonts, global providers)
└── globals.css      # Global styles, CSS variables, utility classes

components/
└── ui/              # shadcn/ui components (auto-installed)

lib/
├── constants/
│   └── index.ts     # App constants (APP_NAME, APP_DESCRIPTION, SERVER_URL)
└── utils.ts         # Utility functions (cn() for class merging)
```

### Key Patterns

**Route Groups**: The `(root)/` directory is a route group that doesn't affect the URL structure. Use route groups to organize layouts without adding URL segments.

**Path Aliases**: Use `@/` prefix for imports from the root directory:
```tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
```

**Class Name Utilities**: Use `cn()` from `@/lib/utils` to merge Tailwind classes with shadcn component variants:
```tsx
<Button className={cn("additional-classes", className)} />
```

## UI Development - CRITICAL RULES

**IMPORTANT**: Before implementing any UI components, **always check `docs/ui.md`** for detailed design guidelines, patterns, and examples specific to this project.

### 1. Component Library (shadcn/ui ONLY)

**NEVER create custom UI components that shadcn/ui provides.** Always install and use shadcn components:

```bash
npx shadcn@latest add button card input select dialog
```

Available shadcn components:
- **Layout**: Card, Separator, Tabs, Accordion, Collapsible
- **Forms**: Input, Button, Checkbox, Radio, Select, Textarea, Label, Form
- **Navigation**: NavigationMenu, Dropdown Menu, Context Menu, Menubar, Breadcrumb
- **Feedback**: Alert, Toast, Dialog, Alert Dialog, Sheet, Popover, Tooltip
- **Data**: Table, Data Table, Badge, Avatar, Progress, Skeleton

### 2. Color System (CSS Variables ONLY)

**NEVER use arbitrary Tailwind color classes** like `bg-blue-500`, `text-red-600`, etc.

**ALWAYS use semantic CSS variables** defined in `app/globals.css`:

```tsx
// ✅ CORRECT
<div className="bg-background text-foreground border-border">
  <Button className="bg-primary text-primary-foreground">Click</Button>
  <p className="text-muted-foreground">Secondary text</p>
</div>

// ❌ INCORRECT
<div className="bg-white text-gray-900 border-gray-200">
  <Button className="bg-blue-600 text-white">Click</Button>
  <p className="text-gray-500">Secondary text</p>
</div>
```

Available semantic colors:
- `bg-background`, `text-foreground` - Main background/text
- `bg-card`, `text-card-foreground` - Card components
- `bg-primary`, `text-primary-foreground` - Primary brand color (purple/blue)
- `bg-secondary`, `text-secondary-foreground` - Secondary backgrounds
- `bg-muted`, `text-muted-foreground` - Muted/disabled states
- `bg-accent`, `text-accent-foreground` - Accent/hover states
- `bg-destructive` - Error/danger states
- `border-border`, `border-input` - Border colors
- `ring-ring` - Focus ring colors

Colors automatically support dark mode via `.dark` class.

### 3. Layout Wrapper

**ALWAYS use `.wrapper` class** for content containers (defined in globals.css):

```tsx
// ✅ CORRECT - Page layout
export default function HomePage() {
  return (
    <main className="wrapper">
      <h1 className="h1-bold">Welcome</h1>
      {/* content */}
    </main>
  );
}

// ✅ CORRECT - Section with background
<section className="bg-muted">
  <div className="wrapper">
    <h2 className="h2-bold">Section Title</h2>
  </div>
</section>

// ❌ INCORRECT - Don't create custom containers
<div className="max-w-6xl mx-auto px-4">
  {/* content */}
</div>
```

`.wrapper` provides:
- Max width: `7xl` (1280px)
- Centering: Auto margins on large screens
- Responsive padding: `p-5` default, `md:px-10` on medium+

### 4. Typography Utilities

**USE predefined heading classes** from globals.css:

```tsx
// ✅ CORRECT
<h1 className="h1-bold">Main Title</h1>    // font-bold text-3xl lg:text-4xl
<h2 className="h2-bold">Section</h2>        // font-bold text-2xl lg:text-3xl
<h3 className="h3-bold">Subsection</h3>     // font-bold text-xl lg:text-2xl

// ❌ INCORRECT
<h1 className="text-4xl font-bold">Title</h1>
```

## Styling System

### Tailwind CSS 4

This project uses **Tailwind CSS v4** with PostCSS plugin (`@tailwindcss/postcss`).

**Key differences from v3:**
- Theme configured via `@theme inline` in globals.css
- Custom variants defined with `@custom-variant` (e.g., dark mode)
- CSS variable integration with `var(--color-*)` pattern

### Dark Mode

Dark mode is implemented via the `.dark` class on elements. Colors automatically adapt using CSS variables defined in `:root` and `.dark` selectors.

### Border Radius

Consistent border radius values via CSS variables:
- `rounded-sm` → `calc(var(--radius) - 4px)`
- `rounded-md` → `calc(var(--radius) - 2px)`
- `rounded-lg` → `var(--radius)` (0.65rem)
- `rounded-xl` → `calc(var(--radius) + 4px)`

## TypeScript Configuration

- **Target**: ES2017
- **Module**: ESNext with bundler resolution
- **JSX**: react-jsx (React 19)
- **Strict mode**: Enabled
- **Path aliases**: `@/*` maps to root directory

## Linting

ESLint configured with Next.js recommended rules:
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`

Ignored directories: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Important Constants

Defined in `lib/constants/index.ts`:
- `APP_NAME`: "Alshami"
- `APP_DESCRIPTION`: "A modern e-commerce platform for premium herbs, coffees, and more."
- `SERVER_URL`: "http://localhost:3000"

Used in root layout for metadata configuration.

## Development Workflow

1. **Install shadcn components** before creating new UI:
   ```bash
   npx shadcn@latest add [component-name]
   ```

2. **Use semantic CSS variables** for all colors

3. **Apply `.wrapper` class** for content containers

4. **Use typography utilities** (`.h1-bold`, `.h2-bold`, `.h3-bold`)

5. **Leverage `cn()`** utility for conditional class merging

6. **Follow Next.js App Router patterns**:
   - Server Components by default
   - Use `"use client"` only when needed (event handlers, hooks, browser APIs)
   - Co-locate files in route directories

## Additional Notes

- **Font**: Inter from Google Fonts
- **Icon library**: Lucide React (via shadcn/ui)
- **Animation utilities**: `tw-animate-css` package available
- **Class variance**: Uses `class-variance-authority` for component variants

Refer to `docs/ui.md` for detailed UI design rules and examples.
