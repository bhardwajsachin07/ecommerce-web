# 🛍️ VINCERE - Premium Fashion E-Commerce

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-Auth-orange?style=for-the-badge&logo=firebase)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-blue?style=for-the-badge&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

---

## 📌 About

**VINCERE** is a premium fashion e-commerce platform with AR try-on capabilities. Built with **Next.js 14**, **TypeScript**, and **Tailwind CSS v4**, it delivers a modern, responsive shopping experience with features like virtual try-on, product comparison, and an admin dashboard.

---

## 🚀 Features

### Shopping Experience
- 🛒 **Cart & Checkout** — Full checkout flow with shipping, payment, and order review
- 🏷️ **Coupon Codes** — Apply `SAVE10` (10% off), `FLAT20` ($20 off), `FREESHIP` (free shipping) at checkout
- ❤️ **Wishlist** — Save products for later
- 👗 **Virtual Closet** — Keep outfits organized
- 🔍 **Product Quick View** — Preview product details without navigating away
- 📊 **Product Comparison** — Compare up to 4 products side-by-side
- 🔗 **Share Products** — Share via WhatsApp, Twitter, or copy link
- 👁️ **Recently Viewed** — Carousel of recently viewed products on homepage

### AR & Try-On
- 👗 **Virtual Try-On** — AR-powered clothing try-on experience
- 📷 **Try-On History** — View past try-on sessions

### User Features
- 🔑 **Authentication** — Email/password login & signup
- � **User Profiles** — Account management
- 📦 **Order Tracking** — Visual timeline (Placed → Processing → Shipped → Delivered)
- � **Advanced Search** — Filter by category, price, size, color, brand, and rating

### UI/UX
- 🌙 **Dark Mode** — Toggle between light and dark themes
- ⬆️ **Back to Top** — Floating scroll-to-top button
- 📱 **Responsive Design** — Optimized for desktop and mobile
- ✨ **Animations** — Smooth transitions, parallax hero, glassmorphism effects

### Admin
- 📊 **Admin Dashboard** — Product, order, and user management (login: `admin@example.com`, password: `password123`)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + custom components |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) (with localStorage persistence) |
| **Authentication** | Mock auth (expandable to Firebase) |
| **Fonts** | Inter + Playfair Display |
| **Analytics** | Vercel Analytics |

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/bhardwajsachin07/ecommerce-web.git
cd ecommerce-web

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── men/                # Men's collection
│   ├── women/              # Women's collection
│   ├── accessories/        # Accessories
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   ├── orders/             # Order history
│   ├── admin/              # Admin dashboard
│   └── ...                 # Other pages
├── components/             # React components
│   ├── ui/                 # Reusable UI primitives (50+)
│   ├── product-card.tsx    # Product card with actions
│   ├── header.tsx          # Site header with navigation
│   ├── theme-toggle.tsx    # Dark mode toggle
│   └── ...                 # Feature components
├── lib/                    # State management & utilities
│   ├── store.ts            # Main Zustand store
│   ├── auth-store.ts       # Authentication store
│   └── utils.ts            # Utility functions
└── public/                 # Static assets & images
```
---

## 📄 License

This project is proprietary. All rights reserved.

© 2025 VINCERE
