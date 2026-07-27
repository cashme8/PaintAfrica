# PaintAfrica — Product Requirements Document (PRD)

**Version:** 1.0 (MVP)
**Status:** Draft — Phase 1 (Product Planning)
**Owner:** Founder / Product

---

## 1. Problem Statement

Small African printing businesses and freelance graphic designers rely almost entirely on
walk-in customers, WhatsApp, and word-of-mouth. This means:

- Customers can't easily discover or compare printing businesses and designers.
- Printing businesses have unpredictable order flow and no digital storefront.
- Designers struggle to find paying clients and showcase work.
- There is no shared system for tracking order status, files, or communication.

**PaintAfrica** solves this by being a marketplace that connects Customers, Designers, and
Printing Businesses in one platform — from design request to finished physical product.

## 2. Goals (MVP)

1. Let a Customer request a printing service and upload their design/brief online.
2. Let a Printing Business receive, accept/reject, and manage those orders through a dashboard.
3. Let a Designer offer design services and receive/deliver design requests.
4. Give Admin the tools to approve businesses and keep the marketplace healthy.
5. Ship something real, usable, and demoable within 30 days — not a mockup.

## 3. Non-Goals (explicitly out of scope for MVP / V1)

- In-app payments (Phase 2+ — MVP tracks payment status manually / "pay on delivery/pickup")
- Real-time chat (MVP uses simple threaded messages per order, not WebSocket live chat)
- Delivery/logistics management
- Mobile native apps (MVP is responsive web only)
- Multi-currency / multi-country tax handling
- Rating-weighted search ranking algorithms (basic reviews only)

## 4. Target Users & Personas

| Persona | Description | Primary Need |
|---|---|---|
| **Customer (Amina)** | Small business owner needing 500 flyers for an event | Fast, reliable quote & order tracking |
| **Printing Business (KampalaPrints)** | Local print shop with a shop-front, wants more online orders | A digital storefront + order pipeline |
| **Designer (Kwame)** | Freelance graphic designer | Discoverable portfolio + design job requests |
| **Admin (PaintAfrica ops)** | Platform operator | Vet businesses, monitor health of marketplace |

## 5. User Roles & Capabilities

### Customer
- Register / log in
- Browse service catalog (by category, business, or designer)
- Submit an order request with specs + uploaded files
- Track order status (Pending → Accepted → In Production → Ready → Completed)
- Message the business/designer about an order
- View order history
- Leave a review after completion
- (Future) Pay online

### Printing Business
- Register a business profile (name, location, logo, categories offered)
- Create/manage service listings with pricing
- Receive and view incoming order requests
- Accept / reject orders
- Update order status/progress
- Message customers
- View basic order analytics

### Graphic Designer
- Create a public portfolio (bio, sample works, skills)
- Offer design service listings
- Receive & accept design requests
- Upload completed design deliverables
- Message customers

### Admin
- View/manage all users
- Approve or suspend business & designer accounts
- Monitor all orders platform-wide
- Manage/curate global service categories
- View basic platform analytics (users, orders, GMV proxy)

## 6. Key User Stories

**Customer**
- As a customer, I want to browse printing services by category so I can find what I need quickly.
- As a customer, I want to upload my design file when placing an order so the business has what they need to produce it.
- As a customer, I want to see the live status of my order so I know when it will be ready.
- As a customer, I want to message the business directly about my order so I can clarify details.

**Printing Business**
- As a business owner, I want to list my services with prices so customers can order directly.
- As a business owner, I want to see new order requests in one place so I don't miss any.
- As a business owner, I want to accept or reject an order so I only commit to work I can deliver.
- As a business owner, I want to update order status so the customer stays informed.

**Designer**
- As a designer, I want a portfolio page so customers can see my work before hiring me.
- As a designer, I want to receive design requests so I can grow my client base.

**Admin**
- As an admin, I want to approve new business accounts so only legitimate businesses appear publicly.
- As an admin, I want to view all orders so I can spot and resolve disputes.

## 7. MVP Scope Summary

**In scope (V1):**
Auth + roles, service catalog, order request + file upload, order status pipeline,
business dashboard, designer portfolio + requests, basic messaging (per-order thread),
admin approval + monitoring, reviews (post-completion).

**Explicitly deferred (V2+):**
Online payments, real-time chat, logistics/delivery tracking, notifications
(email/SMS/push), advanced analytics, multi-language support.

## 8. Success Metrics (MVP)

- Time to first order (customer signs up → places order)
- % of orders accepted by businesses within 24h
- # of active businesses with ≥1 completed order/month
- Repeat order rate

## 9. Business Decisions

**Confirmed (2026-07-20):**

1. **Approval flow:** ✅ Businesses and designers require Admin approval
   (`is_approved = true`) before their profile or listings appear publicly.
   They can still complete their profile and add listings while pending,
   but those stay hidden from the catalog/search until approved.
2. **Pricing model:** ✅ Quote-based. Customer submits specs on an order
   request; the business/designer reviews and responds with a quote
   (`orders.quoted_amount`); customer confirms to move the order to
   `accepted`. `services.base_price` is shown as an estimated/starting price
   in the catalog, not a locked price.
3. **Payments:** ✅ Offline for MVP (cash/mobile money on pickup or
   delivery). The provider manually marks the order's payment as `paid` in
   the system (`payments.status`) — no payment gateway integration in V1.

**Still open — using sensible defaults below until you say otherwise:**

4. **File types:** Defaulting to accepting PDF, JPG, PNG, AI, PSD, and CDR,
   max 25MB per file. Tell me if any of these should be excluded or the
   limit changed.
5. **Geography:** Defaulting to single-country launch (you tell me which)
   with a free-text `location` field on businesses for now, rather than
   building full multi-country/multi-currency support in V1.
6. **Business verification:** Defaulting to self-reported profile info
   (name, location, phone) reviewed manually by Admin at approval time —
   no automated document/ID verification in V1.
