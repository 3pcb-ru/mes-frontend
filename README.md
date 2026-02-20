# GRVT MES: The Lightweight MES for Agile Factories

![Status: Phase 1 Foundation](https://img.shields.io/badge/Status-Phase%201%20Foundation-blue)
![Tech: React + Vite + Tailwind](https://img.shields.io/badge/Tech-React%20%2B%20Vite%20%2B%20Tailwind-cyan)

**GRVT MES** is a cloud-native Manufacturing Execution System designed specifically for SMEs. It bridges the gap between manual shop floor management and bloated ERP systems, providing a lightweight, ISA-95 compliant solution for modern factories.

---

## 🚀 Key Features

- **Standalone Mode**: Manage products, BOMs, and work orders directly without needing an ERP.
- **BOM Management**: Import Excel BOMs, manage revisions, and validate data with ease.
- **Real-time Execution**: Track WIP, start/stop jobs, and report scrap with transactional integrity.
- **Machine Registry**: Register assets and monitor live status via WebSocket-driven updates.
- **ISA-95 Compliant**: Designed to operate strictly at Level 3 (MOM), ensuring industry-standard compatibility.
- **Modern UI/UX**: Built with a focus on speed, clarity, and accessibility.

## 🛠️ Technology Stack

- **Frontend**: [React](https://reactjs.org/) (v18)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4 optimized)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (Shadcn UI inspired)
- **Routing**: [React Router](https://reactrouter.com/) (v6)
- **Motion**: [Motion](https://motion.dev/) (Framer Motion)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```text
src/
├── app/
│   ├── components/       # Functional sections (Hero, Architecture, etc.)
│   │   └── ui/           # Reusable UI component library (Button, Card, etc.)
│   ├── pages/            # Multi-page views (Home, About)
│   └── App.tsx           # Main application shell & routing
├── assets/               # Static assets & icons
├── styles/               # Global CSS & Tailwind configuration
└── main.tsx              # Entry point
```

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository**:

    ```bash
    git clone [repository-url]
    cd mes-frontend
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Run the development server**:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

## 🗺️ Roadmap

- [x] **Phase 1: Foundation** - User & Factory Mgmt, BOM Import, Manual Execution, Dashboard.
- [ ] **Phase 2: Connectivity** - MQTT Events, Traceability, Material Tracking.
- [ ] **Phase 3: Quality** - Quality Gates, Pass/Fail Checks, Defect Codes.
- [ ] **Phase 4: Scale** - Telemetry (ClickHouse), Deep Analytics, Performance KPIs.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for agile manufacturing.
