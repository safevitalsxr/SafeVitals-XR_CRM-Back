# SafeVitals XR - Frontend Web Application

<div align="center">
  <h3>The modern command center for managing our entire workforce, keeping everyone safe, aligned, and productive.</h3>
</div>

---

## 📖 Overview

**SafeVitals XR** is an enterprise-grade Workforce and Employee Management dashboard built with modern web technologies. This frontend application provides seamless integration with the SafeVitals backend CRM to manage employees, access requests, ticketing, attendance, schedules, and spatial computing (XR) settings.

The login experience features a fully interactive, professional 3D VR Headset model rendered using WebGL, establishing the cutting-edge aesthetic of the platform.

## ✨ Key Features

- **Immersive 3D Experience:** Interactive, physics-based 3D VR headset on the login screen using `@react-three/fiber`.
- **Advanced Dashboard UI:** Sleek, modern, and highly responsive glassmorphic dashboard built on Tailwind CSS and `shadcn/ui`.
- **Employee Management:** Complete CRUD operations, lifecycle controls (Suspend/Hard Delete), and real-time contact updates.
- **Role-Based Access Control:** Strict permission scopes for System Administrators, Managers, and standard employees.
- **Mock Service Worker Integration:** Fully functional mock API layer utilizing MSW for rapid frontend development without backend dependencies.

## 🚀 Technology Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix Primitives)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **3D Rendering:** [Three.js](https://threejs.org/) & [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/)
- **API Mocking:** [MSW (Mock Service Worker)](https://mswjs.io/)

## 🛠️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and npm installed.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/safevitalsxr/SafeVitals-XR_CRM-Back.git
cd SafeVitals-XR_CRM-Back
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Build for Production

To generate an optimized production build:

```bash
npm run build
npm run start
```

## 🔒 Security & Code Quality

- **ESLint & Prettier** are integrated for enforcing code quality.
- **Strict TypeScript** configuration ensures type safety across the entire application.

---
*Property of Safe Vitals Inc. All Rights Reserved.*
