import { useRef, useState } from 'react';

import { useCart } from '@/features/cart/cart-context';

import { submitOrder, type OrderConfirmation } from './submit-order';

export type SubmitOrderState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; confirmation: OrderConfirmation }
  | { status: 'error'; message: string };

export function useSubmitOrder() {
  const { cart, dispatch } = useCart();
  const [state, setState] = useState<SubmitOrderState>({ status: 'idle' });
  const inFlight = useRef(false);

  async function submit({ simulateFailure = false }: { simulateFailure?: boolean } = {}) {
    if (inFlight.current || cart.lines.length === 0) return;

    inFlight.current = true;
    setState({ status: 'submitting' });
    try {
      const confirmation = await submitOrder(cart, { simulateFailure });
      dispatch({ type: 'clear' });
      setState({ status: 'success', confirmation });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong.';
      setState({ status: 'error', message });
    } finally {
      inFlight.current = false;
    }
  }

  /** Clears a previous error so the screen shows the normal submit state again. */
  function reset() {
    if (!inFlight.current) setState({ status: 'idle' });
  }

  return { state, submit, reset };
}
