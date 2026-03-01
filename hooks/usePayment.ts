import { useCallback } from "react";
import {
  paymentFailure,
  paymentStart,
  paymentSuccess,
  setOrderStatus,
  OrderStatus,
} from "@/store/slices/paymentSlice";
import { paymentsApi } from "@/hooks/api/payments/api";
import { useAppDispatch } from "@/store/hooks";

// Safely import useStripe — falls back to a no-op stub in Expo Go where
// native Stripe modules are unavailable.
type StripeModule = typeof import("@stripe/stripe-react-native");

let useStripe: () => ReturnType<StripeModule["useStripe"]>;
let initStripe: StripeModule["initStripe"] | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const stripe = require("@stripe/stripe-react-native") as StripeModule;
  useStripe = stripe.useStripe;
  initStripe = stripe.initStripe;
} catch {
  useStripe = () =>
    ({
      initPaymentSheet: async () => ({
        error: {
          message: "Stripe unavailable in Expo Go",
          code: "Failed",
        } as never,
      }),
      presentPaymentSheet: async () => ({
        error: {
          message: "Stripe unavailable in Expo Go",
          code: "Failed",
        } as never,
      }),
    }) as never;
}

const POLL_INTERVAL_MS = 2_000;
const POLL_MAX_ATTEMPTS = 15;
let activePublishableKey: string | null = null;

async function ensureStripeInitialized(publishableKey: string): Promise<void> {
  if (!publishableKey) {
    throw new Error("Missing Stripe publishable key");
  }
  if (!initStripe) {
    throw new Error("Stripe unavailable in Expo Go");
  }
  if (activePublishableKey === publishableKey) {
    return;
  }

  await initStripe({
    publishableKey,
    urlScheme: "oumischool",
  });
  activePublishableKey = publishableKey;
}

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
      createIntent: () => Promise<{
        clientSecret: string | null;
        orderId: string | null;
      }>,
    ): Promise<{ success: boolean; orderId: string | null }> => {
      dispatch(paymentStart());

      try {
        // 1. Get Stripe customer info
        const { customerId, ephemeralKeySecret, publishableKey } =
          await paymentsApi.getCustomer();
        await ensureStripeInitialized(publishableKey);

        // 2. Create the payment intent on backend
        const { clientSecret, orderId } = await createIntent();
        if (!clientSecret || !orderId) {
          dispatch(paymentFailure("Invalid payment intent"));
          return { success: false, orderId: null };
        }

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
        dispatch(paymentSuccess({ orderId, status: "PENDING" }));
        const finalStatus = await pollOrderStatus(orderId);
        dispatch(setOrderStatus(finalStatus));

        return { success: finalStatus === "PAID", orderId };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Payment failed";
        dispatch(paymentFailure(message));
        return { success: false, orderId: null };
      }
    },
    [initPaymentSheet, presentPaymentSheet, dispatch],
  );

  const payForSession = useCallback(
    (sessionData: Parameters<typeof paymentsApi.createSessionIntent>[0]) =>
      runPaymentSheet(() => paymentsApi.createSessionIntent(sessionData)),
    [runPaymentSheet],
  );

  const payForResource = useCallback(
    (resourceId: string) =>
      runPaymentSheet(() => paymentsApi.createResourceIntent({ resourceId })),
    [runPaymentSheet],
  );

  const payForSubscription = useCallback(
    async (
      planId: string,
    ): Promise<{ success: boolean; orderId: string | null }> => {
      try {
        const intent = await paymentsApi.createSubscriptionIntent({ planId });
        if (intent.immediate) {
          dispatch(paymentSuccess({ orderId: "", status: "PAID" }));
          return { success: true, orderId: null };
        }
        return runPaymentSheet(() =>
          Promise.resolve(
            intent as unknown as { clientSecret: string; orderId: string },
          ),
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Payment failed";
        dispatch(paymentFailure(message));
        return { success: false, orderId: null };
      }
    },
    [runPaymentSheet, dispatch],
  );

  return { payForSession, payForResource, payForSubscription };
}
