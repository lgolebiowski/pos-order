# pos-order

Expo (React Native) app using Expo Router. Screens live in `src/app/`.

```bash
npm install
npm start        # then press i / a / w for iOS / Android / web
npx expo lint    # lint
npx tsc --noEmit # typecheck
```

## Mock product data

`src/data/products.ts` holds a mocked list of school canteen products, used until a real backend exists.

```ts
type Product = {
  id: string;
  name: string;
  category: 'main' | 'snack' | 'drink' | 'dessert';
  price: number;
  isAvailable: boolean;
};
```

- Prices are in AUD.
- A few items have `isAvailable: false`, to cover the sold-out state in the UI.
