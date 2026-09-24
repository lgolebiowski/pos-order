# pos-order

A school canteen point-of-sale app built with Expo (React Native) and Expo Router. Staff browse the menu by category, build an order, review it and submit it to a mocked API.

```bash
npm install
npm start        # then press i / a / w for iOS / Android / web
npx expo lint    # lint
npx tsc --noEmit # typecheck
npm test         # run tests (npm run test:watch to re-run on change)
```

## Design decisions

- I used Expo with Expo Router (SDK 57), because it runs in Expo Go and provides hot reloading. File-based routing is a similar approach that I've taken in the order-dashboard app, to keep similar dev and user experience
- Code is grouped by feature to keep its logic, components and tests together. `src/app/` only holds routes, and each route is a one-line re-export of a screen from `src/features`.
- Expo Router treats every file in `src/app/` as a screen

- For cart state I used `useReducer` + React context rather than any state management - at this stage I decided to keep the state handling minimal.
- Prices stay in dollars to match the data, but totals are added up in whole cents. That avoids floating-point drift (`0.1 + 0.2`) in order totals

- As in the dashboard, for the same reasons I didn't bring in a component library. I wrote small `Button` and `Chip` components on top of `Pressable` and `StyleSheet`.
- The layout suits quick use at a counter: category pills in one horizontally scrolling row, and a bottom bar that stays in place with the running total and "Review order".
- Testing uses Jest (`jest-expo`) and React Native Testing Library.

What would I do next if I had more time ?

- Add the optional search feature
- Focus more on tablet experience as probably tablet is a preferred device in school cantines
- I'd work more on timeouts and retries as this might be the biggest pain point in such apps (I suppose)
- persist the cart across app restarts with AsyncStorage and add order history

// All the content below was created during developing the app for my documenting purposes (and potentially future me coming back to this code in some time), but feel free to take a look!

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
- `src/features/order/order-flow.test.tsx`: boots the real routes (with the provider from `_layout.tsx`), adds items, opens the summary with "Review order", submits, and starts a new order.

Shared UI components:

- `src/components/ui/button.test.tsx`: accessible name (title or `accessibilityLabel`), press and disabled behaviour, the primary / secondary / ghost colours in light and dark mode, and sizes.
- `src/components/ui/chip.test.tsx`: selected state exposed to accessibility tools, presses, and selected / unselected colours in light and dark mode.

`SectionList` renders lazily, so the screen tests assert on one category at a time rather than on the full "All" list.

## Cart and order summary

The cart lives in `CartProvider` (`src/features/cart/cart-context.tsx`), wrapped around the app in `src/app/_layout.tsx`. Screens read it with `useCart()`, so the order screen (`/order`) and the summary (`/summary`) share the same cart. The state logic is still the plain reducer in `cart-reducer.ts`.

"Review order" in the order screen's bottom bar opens the summary, which lists each item with quantity × price, its line total, and the order total. It is disabled while the cart is empty.

## Submitting an order

`submitOrder` (`src/features/order/submit-order.ts`) is a mocked API: it waits about 1.5 s, then returns a confirmation. It rejects an empty order. With `simulateFailure: true` it fails after the same delay instead. `useSubmitOrder` (`use-submit-order.ts`) tracks `idle → submitting → success | error`, blocks a second submit while one is in flight, and clears the cart only on success.

The summary screen shows:

| State   | Shows                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------- |
| Empty   | "Your order is empty." and "Back to menu". No submit button.                                      |
| Ready   | Items, totals, "Submit order".                                                                    |
| Loading | Spinner, "Submitting your order…", button disabled.                                               |
| Error   | The failure message as an accessibility alert, items kept, "Try again".                           |
| Success | "Order placed!", order number and total, "Start new order" (back to the menu with an empty cart). |

To exercise the failed request, turn on the "Simulate failed request" switch above the submit button. The button turns red and reads "Submit order failed". Submitting then fails after the normal delay and shows the error state. Turning the switch off removes the error message and brings back the normal "Submit order" button. The items stay in the order. The switch is disabled while a request is in flight.
