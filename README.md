# ⛳ Nexus: Golf Charity & Subscription Platform

Nexus is a premium, localized platform designed for the Indian golfing community. It combines competition with charitable impact, allowing users to track their scores, enter monthly draws, and support humanitarian causes through their subscriptions.

## 🌟 Key Features

### 🇮🇳 Full Indian Localization
- **Currency**: Entire platform is localized to **INR (₹)**.
- **Pricing**: Automated subscription tiers (₹1,699/mo & ₹16,999/yr) tailored for the Indian market.
- **Formatting**: Revenue, payouts, and winnings are all displayed in standard Indian numbering.

### 💳 Subscription & Impact System
- **Tiered Access**: Monthly and Yearly plans that unlock the full platform potential.
- **Charity Integration**: 10% of every subscription is automatically funneled into a charity pool.
- **Cause Selection**: Users can choose specific humanitarian partners (e.g., Green Fairways, Youth Golf) to support.

### 🏌️ Score Tracking & Monthly Draws
- **Scorecards**: Users enter up to 5 weekly scores to qualify for the monthly draw.
- **Automated Draws**: A sophisticated backend engine that matches user scores against winning numbers.
- **Rollover Logic**: Unclaimed jackpot pools automatically roll over to the next month, increasing the engagement.

### 🛡️ Secure Admin Console
- **User Management**: Dedicated portal to manage roles, view detailed stats, and promote administrators.
- **Verification Engine**: Admin workflow to review photo-proofs from winners before releasing payouts.
- **Charity Management**: Register and track the performance of different charitable partners.

## 💳 Payment Gateway Status

> [!IMPORTANT]
> **Production Integration**: The platform is fully connected to the Razorpay payment infrastructure.
> **Current Mode**: Due to the standard **3-day review period** required by Indian payment providers for live activation, the gateway is currently operating in a **High-Fidelity Mock Mode**.
> 
> When you click "Activate," you will see a premium "Setting up your UI" animation that simulates the secure redirection and verification process. Once the live review is complete, the `pricing/page.tsx` logic can be toggled to live mode with a single configuration change.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (Turbopack), React 19, Tailwind CSS.
- **Animations**: Framer Motion for a premium, alive UI.
- **Database**: Supabase (PostgreSQL) with Row-Level Security (RLS).
- **Authentication**: Supabase Auth (Email/Password focused).
- **Payments**: Razorpay Integration (Ready for Live).

## 🚀 Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up your `.env.local` with Supabase and Razorpay keys.
4. Run the development server: `npm run dev`.
5. Access the nexus at `http://localhost:3000`.

---
*Built with ❤️ for the Indian Golfing Community.*
