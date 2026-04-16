# MES Agent Protocol — Implementation Checklist

> **Status**: MANDATORY
> All AI agents and developers MUST complete every applicable section before marking any task `done`.
> These rules are non-negotiable and reflect the standards of a lead full-stack engineer, product manager, security engineer, and architect working simultaneously.

---

## 🔍 Phase 0 · Discovery (Before You Think About Code)

### Codebase Context

- [ ] Read any Knowledge Items (KIs) relevant to the task domain before starting.
- [ ] Audit existing files in the target area. Never create duplicate components, services, or stores.
- [ ] Check if a shared component (`/src/shared/`) already solves part of the problem.
- [ ] Confirm the existing feature directory structure under `/src/features/<domain>/`:
    ```
    /components   ← UI components for this feature only
    /hooks        ← (if needed) feature-specific hooks
    /services     ← All API calls, typed service classes
    /store        ← Zustand store (MANDATORY for any business logic)
    /types        ← TypeScript interfaces and DTOs
    ```
- [ ] **Zod Schema Sync**: Locate the Zod schema for the target domain in `/types/<feature>.schema.ts`. If it doesn't exist, create it based on the backend API signature.
- [ ] **Lazy Loading Audit**: Check if the new feature/page is a heavy dependency. If it's a new route or a massive modal/charting tool, it **must** be flagged for lazy loading in Phase 1.
- [ ] **Manifest Consultation** : Before proposing a solution, the agent MUST read `COMPONENTS_MANIFEST.json` (UI) and `API_MANIFEST.json` (Data).
- [ ] **Hard Halt** : If the user's request requires data not present in the API Manifest, the agent must stop the process and output: `STATUS: DATA_NOT_FOUND` and list the missing endpoints.
- [ ] **No Duplication** : If a page with a similar name/purpose exists in the manifest, the agent must stop the process and suggest modifying the existing one instead of creating a new one.

### Architectural Pre-flight

- [ ] Every page-level state must live in a **Zustand store** (`/store/<feature>.store.ts`). Zero business logic in component local state.
- [ ] Simple UI-only state (modal open/close, hover) MAY use `useState` in components.
- [ ] All API calls go exclusively through `apiClient` (`/src/shared/lib/api-client.ts`). Never use raw `fetch`, `axios`, or XHR directly.
- [ ] Review `MODULE_ACTIONS_CONFIG` and update it if the new feature requires new permission controls.

### Security Pre-flight (The CSO's Gate)

- [ ] No user-supplied data is ever rendered with `dangerouslySetInnerHTML` or unescaped interpolation.
- [ ] Tokens are never hardcoded, logged to `console.log`, or exposed in error messages.
- [ ] API errors display user-friendly messages via `sonner` toast. Raw API error objects are never exposed to the UI.
- [ ] New form inputs must validate on the client before submission, leveraging TypeScript types and falsy guards.

---

## 🛠️ Phase 1 · Development (Writing Code)

### Clean Code Commandments

- [ ] **Zero `any`**: Every variable, prop, and API response must be strictly typed. Use the types from `/features/<domain>/types/`. A stray `any` is a bug waiting to happen.
- [ ] **Component Naming**: PascalCase for components (`UserProfileCard`), camelCase for functions/variables (`handleToggleStatus`), SCREAMING_SNAKE_CASE for constants (`MODULE_ACTIONS_CONFIG`).
- [ ] **File Naming**: kebab-case for all files (`user-profile-card.tsx`, `auth.store.ts`).
- [ ] **Single Responsibility**: If a component does more than one thing, split it. Components render UI. Stores hold logic. Services call APIs.
- [ ] **No Inline Hardcoded Strings in JSX**: Every user-visible string goes through `t('key', 'English fallback')` from `react-i18next`.
- [ ] **Zod-First Types**: TypeScript types must be inferred from Zod schemas whenever possible:
      `export type User = z.infer<typeof UserSchema>;`
- [ ] **Lazy Route Implementation**: New routes in `App.tsx` (or your router config) must use `React.lazy(() => import(...))` and be wrapped in a `<Suspense>` boundary with a skeleton fallback.

### State Management (Zustand Standard)

- [ ] New Zustand stores follow the established pattern from `auth.store.ts`:
    ```ts
    interface FeatureState {
      // Explicit state
      // Explicit actions with typed signatures
    }
    export const useFeatureStore = create<FeatureState>()(...);
    ```
- [ ] Persist only what is necessary (never sensitive data like raw user objects unless already established).
- [ ] Provide a clean accessor hook (`useFeature()`) that deconstructs the store for consumers.

### API & Data Layer

- [ ] All service methods are `async` and return typed promises: `Promise<MyType>`.
- [ ] Wrap API calls defensively:
    ```ts
    const data = await apiClient.get<MyType>('/endpoint');
    const items = Array.isArray(data) ? data : ((data as any)?.data ?? []);
    ```
- [ ] Record all unexpected error shapes to `console.error()` and throw a normalized user-visible message.
- [ ] **Runtime Validation**: Use `apiClient`'s generic parser to validate incoming data against its Zod schema.
- [ ] **Safe Parsing**: Use `.safeParse()` inside the `apiClient` wrapper to handle validation failures gracefully. If validation fails, log the `error.format()` to the console but return a sanitized fallback to prevent UI crashes.

### Localization (i18n — The Trilingual Rule)

- [ ] **English first**: Write the English key and fallback text. Then translate to Russian and Turkish.
- [ ] Translate ALL of: labels, tooltips, toast messages, modal titles, empty states, loading states, and error messages.
- [ ] Locale files follow the existing nesting structure:
    ```
    dashboard.<module>.table.<column>
    dashboard.<module>.actions.<action>
    dashboard.<module>.messages.<message>
    ```
- [ ] After adding keys to `en.json`, sync `ru.json` and `tr.json` immediately in the same commit.

### UI / Dark Theme Enforcement

- [ ] Use established Tailwind tokens: `slate-950` (background), `slate-900/50` (cards), `slate-800` (borders), `slate-400` (muted text), `white` (primary text).
- [ ] Use `brand-primary` gradient for interactive accents (buttons, focus rings).
- [ ] Icon actions use: `cyan` (info/view), `purple` (role/settings), `emerald` (success/active), `amber` (warning/pending), `red` (danger/delete).
- [ ] Skeleton loaders are MANDATORY for all async data views. No raw "Loading..." text.
- [ ] Every list/table must have a designed **Empty State** (icon + descriptive message + optional CTA button).
- [ ] Every interactive button must have a `title` attribute for tooltip/accessibility.
- [ ] Never use `opacity-50` for a disabled/restricted action — use `opacity-[0.15]` and `cursor-not-allowed`.

### Responsiveness Matrix (Mobile-First)

- [ ] Design for **375px** first. Scale up with `sm:`, `md:`, `lg:`, `xl:`.
- [ ] Mobile priority: Avatar/Identity column + Actions column are ALWAYS visible.
- [ ] Secondary columns (IDs, dates, metadata) use `hidden sm:table-cell` or `hidden lg:table-cell`.
- [ ] Touch targets must be minimum `h-8 w-8` for icon buttons.
- [ ] Never use fixed widths (`w-[300px]`) for containers. Use `min-w`, `max-w`, or `flex`/`grid` auto-sizing.

---

## 🔬 Phase 2 · Verification (Breaking Your Own Work)

### Manual Testing Scenario (No Test Suite Present)

> Since the project does not have Vitest/Jest, agents MUST create and document a manual verification scenario. This can be a checklist in the PR description or a dev note in the walkthrough.

- [ ] Describe the **Happy Path**: "User opens X, does Y, sees Z result."
- [ ] Describe **2+ Edge Cases**: What happens with empty data? What happens with a network error? What happens with a system-protected resource?
- [ ] Describe the **Failure Path**: What does the user see if the API returns a 500 error?
- [ ] Where possible, create a temporary `<!-- DEV CHECK: ... -->` comment in code to mark what to visually verify. Remove before final commit.

### Multi-Language Verification

- [ ] Set `i18n` to `ru` in the app settings. Walk through the changed UI. No `[dashboard.module.key]` should be visible.
- [ ] Set `i18n` to `tr`. Repeat the same walkthrough.
- [ ] Check all new `title` tooltips on buttons are also translated.

### Accessibility & Functionality

- [ ] All interactive elements have unique, descriptive `id` attributes.
- [ ] Tab navigation works correctly through all new interactive elements.
- [ ] Restricted/disabled actions have correct `not-allowed` cursor and visually muted state.
- [ ] Modals, drawers, and dropdowns close correctly on `Escape` key (Radix handles this by default, verify it's not overridden).

### Security Spot-Check

- [ ] No user input is rendered without neutralization.
- [ ] No sensitive data (tokens, full user objects) is logged in any `console.log` statement.
- [ ] Error `catch` blocks call `console.error()` and show a `sonner` toast. They never show raw API error body to the user.
- [ ] Intent Scrubbing: Filter user input for "Prompt Injection" keywords (e.g., "ignore previous instructions", "export all users", "override system prompt", "bypass security").
- [ ] **Strict No-Code Policy**: Validate that neither the prompt nor the generated JSON contains JavaScript keywords (`function`, `class`, `eval`, `window`, `{}`).
- [ ] Schema Validation: The output JSON must strictly follow the `VibePageSchema` (Zod). Any extra properties are stripped.
- [ ] Action Restriction: Custom components are strictly "Action-Limited" (e.g., they can trigger existing store actions or refresh blocks but cannot write inline logic).
- [ ] **Manifest Parity**: Verify that both `COMPONENTS_MANIFEST` and `API_MANIFEST` were successfully passed to the agent during generation.
- [ ] **Frontend Pre-Sanitization**: Ensure the frontend strips potentially malicious patterns before the API request is even made.

### 🤖 Agent-Specific Live Testing (The 'Real User' Persona)

- [ ] **Persona Simulation**: You (the Agent) must simulate a user session. Perform the "Happy Path" and describe exactly which elements you clicked and the state changes you observed.
- [ ] **Zod Boundary Test**: Manually trigger a "Schema Mismatch" by mocking a malformed API response (if possible) to ensure the `apiClient` and toast notifications handle it without a white-screen error.
- [ ] **Suspense/Lazy Verification**: Throttling network to "Slow 4G" in the browser logs to verify that the Skeleton loader appears for lazy-loaded components.
- [ ] **Regression Walkthrough**: The Agent must "walk" through one _unrelated_ feature in the same domain to ensure no shared store logic or CSS classes were accidentally broken.
- [ ] **AI-Generated Content Audit**: If the feature involves AI-generated UI/content, verify that the output is deterministic and does not hallucinate non-existent API endpoints or UI components.

---

## 📦 Phase 3 · Finalization

- [ ] Database Sync: Ensure the `VibePageSchema` is saved to the DB with correct `creatorId` and `organizationId`.
- [ ] **Owner Sharing Verification**: If `isOwnerCreated` is true, verify that OTHER users in the same organization can retrieve and view the layout.
- [ ] **Modification Lock**: Verify that a non-owner/non-creator cannot update or delete a custom component owned by another user.
- [ ] Cache Busting: When a custom module is updated in the DB, trigger a refetch in the frontend `apiClient` to ensure the UI updates immediately without a hard refresh.
- [ ] Tenant Isolation Check: (Critical for MES) Verify that `custom_page_id: 101` belonging to Org A cannot be accessed by a user from Org B.

### Code Cleanup

- [ ] Remove all temporary comments (`TODO`, `FIXME`, `DEV CHECK`, `console.log`).
- [ ] Remove all unused imports.
- [ ] Verify no duplicate import statements were introduced (common agent error).
- [ ] Ensure the TypeScript build passes: `vite build` must complete without errors.

### Documentation

- [ ] Update or create `walkthrough.md` with a summary of what was built, what was tested, and what was verified.
- [ ] Update `COMPONENTS_MANIFEST.json` and `API_MANIFEST.json` with the new components and APIs. Make sure the documentation is up to date and correct and without any missing information.
- [ ] If the implementation impacted the table of contents of this checklist, update it.

---

## ⚠️ Hard Blockers (Agent Must Stop and Report)

These conditions require immediate escalation to the user before continuing:

1. **Schema Mismatch**: Backend API response shape does not match the TypeScript type in `/types/`.
2. **Missing Translation**: A required translation key mapping does not exist in the English source file.
3. **Architecture Conflict**: The task requires a pattern that contradicts these rules (e.g., "use raw fetch instead of apiClient").
4. **Destructive Change**: The implementation requires deleting or significantly restructuring a shared component used in 3+ places.
5. **Undocumented External Dependency**: The task requires adding a new `npm` package not already in `package.json`.
6. **Zod Validation Failure**: The API returns data that fails the Zod schema validation in a way that requires a schema update rather than a code fix.
7. **Hydration/Lazy Mismatch**: Lazy loading causes a "flicker" or layout shift that cannot be solved with the current Skeleton components.

---

> "Code is not just instructions for machines. It is communication to future developers, security engineers, and the users who rely on it. Write it as if your reputation depends on it. Because it does."
