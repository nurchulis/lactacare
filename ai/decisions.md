# Technical & Product Decisions

- **Why No Authentication (MVP)?**
  - **Reason:** Simplicity and friction reduction. A sleepy mother at 3 AM should not have to remember a password to log a feeding. The app must work instantly upon opening.

- **Why Offline-First?**
  - **Reason:** Reliability. The app must function seamlessly whether the user is in a hospital room with poor reception or a nursery. The MVP relies solely on local storage.

- **Why Minimal UI?**
  - **Reason:** Cognitive load. The core demographic is physically and mentally exhausted. Complex forms, unnecessary graphs, or dense navigation were explicitly excluded in favor of 3 massive action buttons.

- **Why Zustand over Redux/Context?**
  - **Reason:** Zustand provides incredibly simple boilerplate-free state management with built-in persistence middlewares, perfectly matching the lightweight nature of this app.

- **Why Tailwind CSS?**
  - **Reason:** Rapid prototyping and easy implementation of the required "pastel, non-clinical" design aesthetic using generic utility classes without maintaining separate CSS files.
