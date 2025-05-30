# LocalTalent Frontend

This is the frontend for the **LocalTalent** platform, built using **React**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. The application serves three distinct user roles:

- 👤 **User** — Can browse services and make bookings
- 🎨 **Freelancer** — Can create and manage services
- 🛠️ **Admin** — Can approve or reject services and manage platform data

---

## 🚀 Tech Stack

- **React** + **TypeScript**
- **React Router DOM** — Routing & layout management
- **Axios** — API integration
- **Tailwind CSS** — Styling
- **shadcn/ui** — UI components
- **Zod** — Form validation

---

## 📁 Project Structure

```
src/
├── components/       # Shared UI components
├── layouts/          # PublicLayout, AdminLayout, AuthLayout
├── pages/            # Route-level components (login, register, dashboard, etc.)
├── lib/              # API helper, Axios instance
├── features/         # Feature modules (auth, service, booking, etc.)
├── main.tsx          # Entry point for app
├── App.tsx           # Manage All Routes


```

---

## 🔐 Authentication

- Uses **access token** (stored in `localStorage`) and **refresh token** (stored in **HTTP-only cookie**)
- Refresh logic handled via Axios interceptors(test once if response is failed with 401 status code) and Auth Context(While page Reloading)
- Automatically logs out on invalid refresh or token expiry

---

## 📦 Environment Variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 📦 Installation

```bash
git clone https://github.com/your-username/local-talent-frontend.git
cd local-talent-frontend
npm install
```

---

## 🧪 Running Locally

```bash
npm run dev
```

Visit [http://localhost:8080](http://localhost:8080)

---

## 📲 API Communication

All API requests go through a centralized Axios wrapper:

- Automatic access token header
- Refreshes token on 401
- Handles toast success/error feedback for POST/PUT/DELETE

> Helper located in `src/lib/api.ts` and `api.helper.ts`

---

## 📁 Pages Overview

| Page            | Path                       | Access                |
| --------------- | -------------------------- | --------------------- |
| Home            | `/`                        | Public                |
| Login           | `/login`                   | Public                |
| Register        | `/register`                | Public                |
| Contact         | `/contact`                 | Public                |
| About           | `/about`                   | Public                |
| Services List   | `/services`                | Public                |
| Service Detail  | `/services/:id`            | Public                |
| Dashboard       | `/admin`                   | Auth Only             |
| Service List    | `/admin/services`          | Admin/Freelancer Only |
| Edit Service    | `/admin/services/:id/edit` | Freelancer Only       |
| Booking List    | `/admin/booking`           | Auth Only             |
| User Management | `/admin/user`              | Admin Only            |

---

## 🧠 Features

- 📦 Modular layout support (Auth / Public / Admin)
- 🔄 Dynamic table for data lists with search, paginate, action buttons
- 📤 Image uploads with preview (via Sharp & Multer in backend)
- 🔐 Role-based access and UI
- ⚙️ Reusable Axios & toast wrapper for clean logic

---

## 👤 Test Users

| Role       | Email                                             | Password      |
| ---------- | ------------------------------------------------- | ------------- |
| Admin      | [admin@demo.com](mailto:admin@demo.com)           | Password\@123 |
| Freelancer | [freelancer@demo.com](mailto:freelancer@demo.com) | Password\@123 |
| User       | [user@demo.com](mailto:user@demo.com)             | Password\@123 |

---

## 🛠️ Build for Production

```bash
npm run build
```
