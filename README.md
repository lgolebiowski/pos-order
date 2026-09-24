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
- `src/features/cart/components/cart-summary.test.tsx` and `src/features/menu/components/product-row.test.tsx`: summary text, "Clear", and the product row: "Add" when not in the cart, "−" / quantity / "+" once it is, no buttons for sold-out items.
- `src/features/order/order-screen.test.tsx`: adding updates the summary, "+" and "−" change the quantity shown next to the product, removing the last one brings back "Add", the cart survives filter changes, and "Clear" empties it.

The order summary:

- `src/features/cart/cart-context.test.tsx`: one cart shared by every component inside `CartProvider`, `initialCart`, and a clear error outside the provider.
- `src/features/order/order-summary-screen.test.tsx`: lines with quantity × price and line totals, item count and total, and every submit state (empty, loading, success, error, retry). The API is mocked with a promise the test settles by hand, so the loading state can be checked mid-request.
- `src/features/order/submit-order.test.ts`: the mock API's delay and empty-order rejection, using fake timers.
- `src/features/order/use-submit-order.test.tsx`: the submit hook, including a double tap that arrives before the button re-renders as disabled.
- `src/features/order/components/order-header-button.test.tsx`: header button label and count, disabled when empty, navigates to `/summary`.
- `src/features/order/order-flow.test.tsx`: boots the real routes (with the provider and header button from `_layout.tsx`), adds items, opens the summary from both "Review order" and the header button, submits, and starts a new order.

Shared UI components:

- `src/components/ui/button.test.tsx`: accessible name (title or `accessibilityLabel`), press and disabled behaviour, the primary / secondary / ghost colours in light and dark mode, and sizes.
- `src/components/ui/chip.test.tsx`: selected state exposed to accessibility tools, presses, and selected / unselected colours in light and dark mode.

`SectionList` renders lazily, so the screen tests assert on one category at a time rather than on the full "All" list.

## Cart and order summary

The cart lives in `CartProvider` (`src/features/cart/cart-context.tsx`), wrapped around the app in `src/app/_layout.tsx`. Screens read it with `useCart()`, so the order screen (`/order`) and the summary (`/summary`) share the same cart. The state logic is still the plain reducer in `cart-reducer.ts`.

The "Order" button in the order screen's header (`src/features/order/components/order-header-button.tsx`, set as `headerRight` in `_layout.tsx`) and "Review order" in the list both open the summary, which lists each item with quantity × price, its line total, and the order total. Both are disabled while the cart is empty, and the header button shows the item count, e.g. "Order (3)".

## Submitting an order

`submitOrder` (`src/features/order/submit-order.ts`) is a mocked API: it waits about 1.5 s, then returns a confirmation. It rejects an empty order. `useSubmitOrder` (`use-submit-order.ts`) tracks `idle → submitting → success | error`, blocks a second submit while one is in flight, and clears the cart only on success.

The summary screen shows:

| State | Shows |
|---|---|
| Empty | "Your order is empty." and "Back to menu". No submit button. |
| Ready | Items, totals, "Submit order". |
| Loading | Spinner, "Submitting your order…", button disabled. |
| Error | The failure message as an accessibility alert, items kept, "Try again". |
| Success | "Order placed!", order number and total, "Start new order" (back to the menu with an empty cart). |
