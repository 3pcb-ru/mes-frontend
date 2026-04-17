# GRVT MES: The Lightweight MES for Agile Factories

![Status: Phase 1 Foundation](https://img.shields.io/badge/Status-Phase%201%20Foundation-blue)
![Tech: React 19 + Vite 8 + Tailwind 4](https://img.shields.io/badge/Tech-React%2019%20%2B%20Vite%208%20%2B%20Tailwind%204-cyan)
![Package: pnpm](https://img.shields.io/badge/Package-pnpm-orange)

**GRVT MES** is a cloud-native Manufacturing Execution System designed specifically for SMEs. It bridges the gap between manual shop floor management and bloated ERP systems, providing a lightweight, ISA-95 compliant solution for modern factories.

---

## 🚀 Key Features

- **🤖 AI Vibe Engine**: Natural language UI generation with secure sandboxed rendering and real-time block interaction.
- **📦 Warehouse & Inventory**: Multi-facility container tracking, warehouse modeling, and real-time inventory visibility.
- **⚡ Production Execution**: Real-time WIP tracking, work order orchestration, and transactional job reporting.
- **📋 Product & BOM Intelligence**: Automated quantity calculations, version-controlled BOMs, and seamless Excel imports.
- **🔌 Connectivity Hub**: Live machine status and factory floor monitoring via MQTT and WebSocket-driven updates.
- **🔐 Multi-tenant RBAC**: Secure organization-scoped data isolation with fine-grained role-based access control.
- **🌍 Global Localization**: Trilingual interface out-of-the-box (English, Russian, Turkish).

## 🛠️ Technology Stack

- **Frontend**: [React](https://reactjs.org/) (v19)
- **Build Tool**: [Vite](https://vitejs.dev/) (v8)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4 optimized)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Motion](https://motion.dev/)
- **Visuals**: [Recharts](https://recharts.org/) & [XYFlow](https://reactflow.dev/) (Diagrams)
- **Localization**: [i18next](https://www.i18next.com/)

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [pnpm](https://pnpm.io/) (v9 or higher)

### Installation & Local Development

1. **Clone the repository**:
    ```bash
    git clone [repository-url]
    cd mes-frontend
    ```

2. **Install dependencies**:
    ```bash
    pnpm install
    ```

3. **Run development server**:
    ```bash
    pnpm dev
    ```

The application will be available at `http://localhost:5173`.

---

## 📐 Project Structure

```text
src/
├── app/                  # App shell & routing
├── assets/               # Static assets & icons
├── features/             # Domain-driven modules (Vibe, Warehouse, BOM, etc.)
│   └── <feature>/
│       ├── components/   # Feature-specific UI
│       ├── services/     # API interaction layer
│       ├── store/        # Zustand state models
│       └── types/        # Zod schemas & TS interfaces
├── shared/               # Universal UI, hooks, and utilities
└── styles/               # Global CSS & Tailwind configuration
```

## 📜 Engineering Protocol

This repository follows the **MES Agent Protocol**. All contributors (including AI agents) must adhere to the `IMPLEMENTATION_CHECKLIST.md`.

- **Vibe-Trace**: Every architectural shift is documented in the `.trace/` directory.
- **Clean Code**: Zero `any` policy, Zod-first types, and strict localization hooks.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


Built with ❤️ for agile manufacturing.
