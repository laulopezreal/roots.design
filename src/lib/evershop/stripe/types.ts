export type StripeCaptureMethod = 'automatic' | 'manual';

export interface StripeGatewayConfig {
  /**
   * Stripe secret key used to authenticate server side requests.
   */
  secretKey: string;
  /**
   * Stripe publishable key exposed to the client so that Stripe.js can be initialised.
   */
  publishableKey: string;
  /**
   * Webhook secret for validating the events coming from Stripe.
   */
  webhookSecret: string;
  /**
   * Default currency used when creating payment intents (e.g. `usd`).
   */
  currency: string;
  /**
   * Capture method controls if Stripe should capture the payment automatically
   * or the capture will be executed manually after the order is processed.
   */
  captureMethod?: StripeCaptureMethod;
  /**
   * Optional metadata that is always sent alongside the payment intent.
   */
  metadata?: Record<string, string>;
  /**
   * Enable the automatic payment methods feature from Stripe.
   */
  automaticPaymentMethods?: boolean;
  /**
   * Define the list of payment method types that should be available when
   * automatic payment methods are disabled.
   */
  paymentMethodTypes?: string[];
}

export interface StripeOrderSummary {
  /** Internal identifier used by Evershop. */
  id: string;
  /** Human friendly order number displayed to the customer. */
  orderNumber?: string;
  /** Total amount of the order expressed in major units (e.g. dollars). */
  grandTotal: number;
  /** ISO-4217 currency code that should be used for the payment. */
  currency?: string;
  /** Email of the customer placing the order. */
  customerEmail?: string;
  /** Optional name of the customer. */
  customerName?: string;
  /**
   * Return URL is used by Stripe to redirect the customer back to the storefront
   * once the payment flow is completed.
   */
  returnUrl?: string;
  /** Extra metadata you want to persist in Stripe dashboard. */
  metadata?: Record<string, string | number | null | undefined>;
  /** Description that should be visible on the bank statement. */
  description?: string;
}

export interface CreatePaymentIntentOptions {
  /** Payment method identifier collected on the client. */
  paymentMethodId?: string;
  /**
   * When true the payment intent will not be confirmed right away. The caller
   * can confirm it later by using {@link StripePaymentGateway.confirmPaymentIntent}.
   */
  confirm?: boolean;
  /**
   * Optional idempotency key. Reusing the same key allows us to safely retry a request.
   */
  idempotencyKey?: string;
  /**
   * Explicit capture method that overrides the default provided in the configuration.
   */
  captureMethod?: StripeCaptureMethod;
}

export interface PaymentIntentResult {
  id: string;
  clientSecret: string;
  status: string;
  amount: number;
  currency: string;
  requiresAction: boolean;
  nextAction?: string;
  raw: Record<string, unknown>;
}

export interface CaptureResult {
  id: string;
  status: string;
  amountCaptured: number;
  raw: Record<string, unknown>;
}

export interface RefundResult {
  id: string;
  status: string;
  amountRefunded: number;
  raw: Record<string, unknown>;
}

export interface StripeWebhookEvent<T = Record<string, unknown>> {
  id: string;
  type: string;
  data: T;
  apiVersion?: string;
  created: number;
}

export interface StripeWebhookValidationResult<T = Record<string, unknown>> {
  valid: boolean;
  event?: StripeWebhookEvent<T>;
  reason?: string;
}
