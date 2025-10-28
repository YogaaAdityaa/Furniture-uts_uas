# UTS Project - Database (Expo App)

> Expo React Native project for UTS, featuring a furniture shopping experience with cart, checkout, and product browsing.

---

## � Workspace Structure

```
├── app/                # Main app screens & routing
│   ├── _layout.tsx
│   ├── cart.tsx
│   ├── checkout.tsx
│   ├── modal.tsx
│   ├── (tabs)/         # Tab navigation & screens
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── search.tsx
│   └── product/
│       └── [id].tsx    # Product detail page
├── assets/             # Images & static assets
├── components/         # Reusable UI components
│   ├── FurnitureCard.tsx
│   ├── haptic-tab.tsx
│   ├── parallax-scroll-view.tsx
│   └── ui/
├── constants/          # Theme and constants
├── data/               # Data files
├── hooks/              # Custom React hooks
├── lib/                # Service & utility libraries
│   ├── furniture-service.ts
│   ├── order-service.ts
│   └── supabase.ts
├── scripts/            # Project scripts
├── store/              # State management (e.g., shopping-list)
├── utils/              # Utility functions
├── app.json            # Expo config
├── package.json        # NPM dependencies
├── tsconfig.json       # TypeScript config
└── README.md           # Project info
```

---

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the app**
   ```bash
   npx expo start
   ```
   - Scan the QR code with Expo Go, or run on an emulator/simulator.

---

## 🛒 Main Features

- Product listing & detail view
- Shopping cart & checkout flow
- Tab navigation (Home, Search, etc.)
- Themed UI components
- State management with custom store
- Integration with Supabase (see `lib/supabase.ts`)

---

## 🛠 Development

- Edit screens in the `app/` directory (uses [file-based routing](https://docs.expo.dev/router/introduction/)).
- Add or update UI in `components/`.
- Manage state in `store/`.
- Utility and service logic in `lib/` and `utils/`.

### Reset Project
To reset to a blank app structure:
```bash
npm run reset-project
```
This will move starter code to `app-example/` and create a blank `app/` directory.

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Supabase Docs](https://supabase.com/docs)

---

## 👥 Community

- [Expo on GitHub](https://github.com/expo/expo)
- [Expo Discord](https://chat.expo.dev)
