# 3. User Interface Enhancement Goals

## 3.1 Integration with Existing UI

| Aspect | Existing Pattern | New Features Will Follow |
|--------|-----------------|-------------------------|
| **Component Library** | shadcn/ui (New York style) | All new components from shadcn registry |
| **Color System** | CSS variables only | No arbitrary Tailwind colors |
| **Layout** | `.wrapper` class for containers | All pages use `.wrapper` |
| **Typography** | `.h1-bold`, `.h2-bold`, `.h3-bold` | Consistent heading styles |
| **Dark Mode** | `.dark` class with CSS variables | Auto-supported via shadcn |
| **Icons** | Lucide React | Continue using Lucide |
| **Toast Notifications** | Sonner | Use for success/error feedback |
| **Forms** | React Hook Form + Zod + shadcn Form | All new forms follow this pattern |

## 3.2 Currently Installed shadcn Components

`button`, `card`, `form`, `input`, `label`, `select`, `table`, `badge`, `avatar`, `dropdown-menu`, `sheet`, `skeleton`, `separator`, `radio-group`, `pagination`, `checkbox`, `alert`, `sonner`

## 3.3 Components to Install

```bash
npx shadcn@latest add command dialog alert-dialog textarea tabs
```

| Feature | Component | Why Needed |
|---------|-----------|-----------|
| Product Search | `command`, `dialog` | Command palette with keyboard navigation |
| Admin Dashboard | `alert-dialog`, `textarea`, `tabs` | Delete confirmation, product description, navigation |

## 3.4 Modified/New Screens

| Screen | Type | Route | Description |
|--------|------|-------|-------------|
| Home | Modified | `/` | Redirect to `/products` |
| Header | Modified | (component) | Add search trigger |
| Product Search | New | (modal) | Command palette for search |
| User Profile | New | `/user/profile` | View/edit profile |
| Order History | New | `/user/orders` | List past orders |
| Admin Layout | New | `/admin/*` | Protected admin wrapper |
| Admin Products | New | `/admin/products` | Product list |
| Admin Product Form | New | `/admin/products/new`, `/admin/products/[id]/edit` | Add/edit product |

## 3.5 UI Consistency Requirements

| ID | Requirement |
|----|-------------|
| CR-UI-1 | All new pages must use the `.wrapper` class for main content containers |
| CR-UI-2 | All colors must use CSS variables - no arbitrary Tailwind colors |
| CR-UI-3 | All headings must use typography utilities (`.h1-bold`, `.h2-bold`, `.h3-bold`) |
| CR-UI-4 | All forms must use React Hook Form + Zod validation + shadcn Form components |
| CR-UI-5 | All loading states must use Skeleton components |
| CR-UI-6 | All success/error feedback must use Sonner toast notifications |
| CR-UI-7 | Admin dashboard must match the existing visual style |
| CR-UI-8 | Search command palette must support keyboard navigation |
| CR-UI-9 | Mobile responsiveness required for all new screens |

---
