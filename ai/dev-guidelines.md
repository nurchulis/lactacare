# AI & Developer Guidelines

**CRITICAL RULES FOR FUTURE DEVELOPMENT:**

1. **Do NOT Break Simplicity:** 
   - Never add a feature if it requires a tutorial.
   - Never introduce complex forms for core actions.
   - If a new feature adds friction to the main screen, it must be reconsidered.

2. **Keep Interactions Under 2 Taps:**
   - The user must be able to log an action within 2 seconds of opening the app.
   - Avoid modals or dialogs that interrupt the main workflow.

3. **Preserve Offline-First Behavior:**
   - The app must NEVER show a loading spinner waiting for a network request to save a log.
   - All data writing must happen locally first (Optimistic UI), with remote sync occurring transparently in the background.

4. **Avoid Unnecessary Complexity:**
   - Do not add heavy libraries (e.g., massive charting libraries) unless absolutely necessary.
   - Keep the bundle size small to ensure the app loads instantly, even on older mobile devices.

5. **Maintain the Aesthetic:**
   - Stick to the defined pastel color palette.
   - Keep the tone emotionally supportive, friendly, and non-clinical. No harsh red error messages unless it's a critical expiration warning.
