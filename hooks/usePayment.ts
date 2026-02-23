import { useCallback } from "react";
import { useAppDispatch } from "@/store/hooks";

// Safely import useStripe — falls back to a no-op stub in Expo Go where
// native Stripe modules are unavailable.
let useStripe: () => ReturnType<
  typeof import("@stripe/stripe-react-native").useStripe
>;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  useStripe = require("@stripe/stripe-react-native").useStripe;
} catch {
  useStripe = () =>
    ({
      initPaymentSheet: async () => ({ error: { message: "Stripe unavailable in Expo Go", code: "Failed" } as never }),
      presentPaymentSheet: async () => ({ error: { message: "Stripe unavailable in Expo Go", code: "Failed" } as never }),
    }) as never;
}
import {
  paymentStart,
  paymentSuccess,
  paymentFailure,
  setOrderStatus,
  OrderStatus,
} from "@/store/slices/paymentSlice";
import { paymentsApi } from "@/hooks/api/payments/api";

const POLL_INTERVAL_MS = 2_000;
const POLL_MAX_ATTEMPTS = 15;

async function pollOrderStatus(orderId: string): Promise<OrderStatus> {
  for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    const order = await paymentsApi.getOrder(orderId);
    if (order.status === "PAID" || order.status === "FAILED") {
      return order.status as OrderStatus;
    }
  }
  return "PENDING";
}

export function usePayment() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const dispatch = useAppDispatch();

  /**
   * Generic PaymentSheet flow.
   * `createIntent` should call the appropriate backend endpoint and return
   * { clientSecret, orderId }.
   */
  const runPaymentSheet = useCallback(
    async (
      createIntent: () => Promise<{ clientSecret: string; orderId: string }>
    ): Promise<{ success: boolean; orderId: string | null }> => {
      dispatch(paymentStart());

      try {
        // 1. Get Stripe customer info
        const { customerId, ephemeralKeySecret, publishableKey } =
          await paymentsApi.getCustomer();

        // 2. Create the payment intent on backend
        const { clientSecret, orderId } = await createIntent();

        // 3. Initialize PaymentSheet
        const { error: initError } = await initPaymentSheet({
          customerId,
          customerEphemeralKeySecret: ephemeralKeySecret,
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: "OumiSchool",
          returnURL: "oumischool://payments/return",
          defaultBillingDetails: {},
        });

        if (initError) {
          dispatch(paymentFailure(initError.message));
          return { success: false, orderId };
        }

        // 4. Present PaymentSheet to user
        const { error: presentError } = await presentPaymentSheet();

        if (presentError) {
          if (presentError.code === "Canceled") {
            dispatch(paymentFailure("Payment cancelled"));
          } else {
            dispatch(paymentFailure(presentError.message));
          }
          return { success: false, orderId };
        }

        // 5. Poll backend for webhook-confirmed status
        dispatch(
          paymentSuccess({ orderId, status: "PENDING" })
        );
        const finalStatus = await pollOrderStatus(orderId);
        dispatch(setOrderStatus(finalStatus));

        return { success: finalStatus === "PAID", orderId };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Payment failed";
        dispatch(paymentFailure(message));
        return { success: false, orderId: null };
      }
    },
    [initPaymentSheet, presentPaymentSheet, dispatch]
  );

  const payForSession = useCallback(
    (sessionData: Parameters<typeof paymentsApi.createSessionIntent>[0]) =>
      runPaymentSheet(() => paymentsApi.createSessionIntent(sessionData)),
    [runPaymentSheet]
  );

  const payForResource = useCallback(
    (resourceId: string) =>
      runPaymentSheet(() => paymentsApi.createResourceIntent({ resourceId })),
    [runPaymentSheet]
  );

  const payForSubscription = useCallback(
    (planId: string) =>
      runPaymentSheet(() =>
        paymentsApi.createSubscriptionIntent({ planId })
      ),
    [runPaymentSheet]
  );

  return { payForSession, payForResource, payForSubscription };
}
