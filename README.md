# pos-order

Expo (React Native) app using Expo Router. Screens live in `src/app/`.

```bash
npm install
npm start        # then press i / a / w for iOS / Android / web
npx expo lint    # lint
npx tsc --noEmit # typecheck
npm test         # run tests (npm run test:watch to re-run on change)
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

## Tests

Jest (`jest-expo` preset) with React Native Testing Library. Tests sit next to the file they cover, as `<name>.test.ts(x)`.

`src/app/` only holds routes, because Expo Router treats every file there as a screen, so a test file there would become a route. Route files are one-line re-exports of screens that live in `src/features/`, for example `src/app/order.tsx` re-exports `src/features/order/order-screen.tsx`. That way screens are tested beside their code too. Navigation options such as screen titles belong in `src/app/_layout.tsx`.

Category display and filtering are covered at three levels:

- `src/features/menu/group-products.test.ts`: grouping logic (display order, empty categories skipped, filtering, sold-out items kept).
- `src/features/menu/components/category-filter.test.tsx`: filter buttons (labels in order, selected option disabled, `onChange` values).
- `src/features/order/order-screen.test.tsx`: the order screen, filtering to each category in turn.

The cart is covered the same way:

- `src/features/cart/cart-reducer.test.ts`: add (quantity increases, sold-out ignored), remove (one unit at a time, line dropped at zero), clear, and no mutation of the previous cart.
- `src/features/cart/totals.test.ts`: item count and total, including cases like `0.1 + 0.2` that would drift without summing in cents.
- `src/features/cart/components/cart-summary.test.tsx` and `src/features/menu/components/product-row.test.tsx`: summary text, "Clear" and "Add" behaviour, and no "Add" for sold-out items.
- `src/features/order/order-screen.test.tsx`: adding updates the summary, the cart survives filter changes, and "Clear" empties it.

`SectionList` renders lazily, so the screen tests assert on one category at a time rather than on the full "All" list.
