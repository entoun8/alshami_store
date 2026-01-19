# 2. Requirements

## 2.1 Functional Requirements

| ID | Requirement |
|----|-------------|
| **FR1** | The system shall redirect requests to `/` directly to `/products`, bypassing the current hero/banner landing page |
| **FR2** | The system shall provide a search input in the header that filters products by name as the user types |
| **FR3** | The system shall display a user profile page at `/user/profile` showing the authenticated user's name, email, profile image, and saved shipping address |
| **FR4** | The system shall allow authenticated users to edit their profile information (name, shipping address) |
| **FR5** | The system shall display an order history page at `/user/orders` listing all past orders for the authenticated user |
| **FR6** | The order history shall show order ID, date, status (paid/unpaid), total, and item count with links to individual order details |
| **FR7** | The system shall expose a Route Handler at `/api/webhooks/stripe/route.ts` that receives Stripe `payment_intent.succeeded` events (Note: Route Handler required - Server Actions cannot receive external webhooks) |
| **FR8** | Upon receiving a successful payment webhook, the system shall update the corresponding order's `isPaid` to `true` and set `paidAt` timestamp |
| **FR9** | The system shall send an order confirmation email to the customer after successful payment, including order ID, items purchased, shipping address, and total |
| **FR10** | The system shall provide an admin dashboard at `/admin` restricted to users with `role: 'admin'` (products only for MVP) |
| **FR11** | The admin dashboard shall allow CRUD operations on products: create, read, update, and delete |
| **FR12** | The admin dashboard shall support image upload to Supabase Storage when creating/editing products |
| **FR13** | The system shall display a delete confirmation dialog before removing any product |

## 2.2 Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| **NFR1** | Product search results shall appear within 200ms of user input (client-side filtering) |
| **NFR2** | Order confirmation emails shall be sent within 5 seconds of webhook receipt |
| **NFR3** | The admin dashboard shall load product list within 2 seconds for up to 500 products |
| **NFR4** | All new features shall maintain existing page load performance (< 3 seconds) |
| **NFR5** | The application shall achieve 99.9% uptime when deployed to Vercel |
| **NFR6** | All user data access shall be protected by Supabase Row Level Security (RLS) policies |
| **NFR7** | The Stripe webhook endpoint shall verify request signatures to prevent spoofing |
| **NFR8** | Admin routes shall return 403 Forbidden for non-admin users |
| **NFR9** | Email delivery rate shall exceed 99% (handled by Resend) |
| **NFR10** | The system shall function correctly in both development and production environments using environment variables |

## 2.3 Compatibility Requirements

| ID | Requirement |
|----|-------------|
| **CR1** | **Existing API Compatibility:** All existing data-service functions (`getProducts`, `getMyCart`, `getOrderById`, etc.) shall continue to function unchanged |
| **CR2** | **Database Schema Compatibility:** New features shall work with existing table schemas (`Product`, `cart`, `order`, `order_item`, `user_profile`); no breaking schema changes |
| **CR3** | **UI/UX Consistency:** All new UI components shall use shadcn/ui with New York style, follow existing color system (CSS variables only), and use the `.wrapper` class for layout |
| **CR4** | **Integration Compatibility:** Existing Google OAuth flow, Stripe checkout flow, and cart management shall remain fully functional after enhancements |
| **CR5** | **Route Compatibility:** Existing routes (`/products`, `/products/[slug]`, `/cart`, `/checkout/*`, `/order/[id]`) shall continue to work without modification |
| **CR6** | **Session Compatibility:** Cart session handling (cookie-based `sessionCartId` + user linking) shall remain intact |

---
