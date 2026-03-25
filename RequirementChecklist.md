# 1. Dock Widget (Embeddable)
A floating button that expands into a panel showing the user's stacks.
## Must Have:
    - [✓] Minimize/expand states with smooth animations
    - [✓] Can be embedded into third-party websites without conflicts: using web component with shadow mode to prevent css conflicts
    - [✓] Responsive (mobile + desktop)
## Nice To Have:
    - [✓] Use Web Component (Shadow DOM for style isolation): can isolate css in web components 
    - [✓] Theme support (light/dark)
## Example Usage:
    - [✓] `<wishlist-dock data-theme="dark"></wishlist-dock>`

# 2. Stack Management
Users can create and organize collections.
## Stack Fields:
    - [✓] Cover: Image/color (can be randomly generated - random color, gradient, or placeholder image)
    - [✓] Name: Stack title
## Must Have:
    - [✓] Create/delete stacks
    - [✓] View list of stacks with card counts
    - [✓] Click to view stack contents

# 3. Card Management
Display and manage items within stacks.
## Card Fields:
    - [✓] Cover: Image (required)
    - [✓] Name: Card title (required)
    - [✓] Description: Brief description (optional)
    - [✓] Selected Stack: Which stack this card belongs to (required)

## Must Have:
    - [✓] Add/remove cards
    - [✓] Display all card fields (cover, name, description)
    - [✓] Move cards between stacks (drag & drop or select different stack)
    - [✓] Swipe Mode: Cards displayed in swipeable stack (like Tinder/card deck)
        - [✓] Use a library to support swiping cards
        - [✓] Swipe left/right to navigate through cards
        - [✓] Opens when clicking on a stack
        - [✓] Show card counter

# 4. State & Data
## Must Have:
    - [✓] State management solution: using zustands 
    - [✓] Optimistic UI updates: Update UI immediately, sync with API later
    - [✓] API layer for CRUD operations (use fake/mock API service if needed): real API / real BE
## Nice To Have:
    - [✓] Data persistence (localStorage, IndexedDB, or similar): using local storage
    - [✓] Loading and error states: show error toast
## Important - Optimistic UI:
    - [✓] When user adds/removes cards: Update UI instantly
    - [✓] When user creates/deletes stacks: Update UI instantly
    - [✓] Sync with backend in the background: Optimistic Update
    - [✓] Handle API failures gracefully (rollback with error message): Optimistic Update
    - [-] Show sync indicators when needed

# 5.Technical Requirements
## Required:
    - [✓] React 18+
    - [✓] Embeddable component: Web Component
    - [✓] Modern CSS: Tailwinds, Liguid Glass UI
    - [✓] Clean, maintainable code structure
## You Decide:
    - [✓] State management approach: Zustands
    - [✓] Styling solution: Tailwinds, self built components with Liquid Glass style 
    - [✓] Libraries/tools to use: Rsbuild, pnpm, ...
    - [✓] How to split and organize features: feature slicing patterns
    - [✓] Code splitting strategy: split code by feature, split SwipeableCardDeck to reduce initial code loading

# 6.Optional Enhancements
Pick any that showcase your strengths:
    - [-] Unit/integration tests: add unit test for shared component 
    - [✓] Code splitting & lazy loading
    - [✓] Advanced animations
    - [✓] Accessibility features
    - [✓] Offline support
    - [✓] Search/filter functionality
    - [✓] Keyboard shortcuts: ctrl+F to open search, esc to close search, esc to close popup 

# Notes:
- [✓] : fully support
- [-] : partial support 
- [ ] : not yet support