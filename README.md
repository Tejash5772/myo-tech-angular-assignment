# Advanced Angular Architecture Assignment

## 📌 Project Overview
This project is an advanced Angular application demonstrating highly scalable architectural patterns. It features a mock backend via `json-server`, dynamic component rendering, heavily nested reactive forms, custom RxJS operators, and optimistic UI updates. 

The architecture is designed with modularity, reusability, and strict type safety in mind, mimicking a production-ready enterprise environment.

## 🚀 Key Features Implemented

*   **Universal Data Grid:** A highly reusable, standalone data grid component (`<app-data-grid>`) supporting dynamic columns, pagination, column sorting, and custom cell rendering via `ng-template`.
*   **Complex Nested Forms (Order Entry):** A deeply nested Reactive Form featuring a `FormArray` for line items, real-time dynamic total calculations, and custom Async Validators for stock checking.
*   **Dynamic Schema-Driven Forms:** Forms generated dynamically from JSON configurations, including dependent dropdowns (e.g., Category -> SubCategory).
*   **Optimistic UI Deletion:** Soft-delete functionality that immediately updates the UI while triggering a 5-second RxJS countdown timer, allowing the user to "Undo" before the API `DELETE` request is finalized.
*   **Auto-Draft & State Recovery:** A service utilizing `localStorage` to automatically save form state (`$dirty` forms) and recover it if the user accidentally navigates away or refreshes the page.
*   **Route Guards & Resolvers:**
    *   `DirtyCheckGuard`: Prevents users from navigating away from unsaved forms.
    *   `DataResolver`: Prefetches paginated data before route activation to prevent UI layout shift.
*   **Centralized Error Handling & Feedback:** A global HTTP Interceptor that catches API errors and routes them to a centralized Toast Notification Service.
*   **Angular Proxy Configuration:** Seamless local development handling CORS and API routing via `proxy.conf.json`.

## 🛠 Tech Stack
*   **Framework:** Angular (Standalone Components API)
*   **State & Reactivity:** RxJS 
*   **Styling:** SCSS
*   **Mock Backend:** `json-server` (Running on port 3000)

## ⚙️ Setup and Installation

### 1. Prerequisites
Ensure you have Node.js and the Angular CLI installed on your local environment.

### 2. Install Dependencies
Clone the repository and install the required packages:
```bash
npm install

### 3. Start the Mock Database (`json-server`)
The application relies on `json-server` to mock API responses. The database schema is located in the root `db.json` file. Run the server on port 3000:
```bash
npm run backend

### 4. Run the Angular Application
The Angular workspace is configured with a `proxy.conf.json` file to route all `/api/*` requests to the `json-server`. 

Open a **new, separate terminal window** (keep the mock database running in the first one) and start the development server by running:
```bash
npm start