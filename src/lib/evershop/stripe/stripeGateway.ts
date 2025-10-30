import { createStripeClient } from './client';
import {
  CaptureResult,
  CreatePaymentIntentOptions,
  PaymentIntentResult,
  RefundResult,
  StripeGatewayConfig,
  StripeOrderSummary,
} from './types';
import { StripeConfigurationError, StripeGatewayError } from './errors';

const STRIPE_PAYMENT_INTENT_PATH = '/payment_intents';
const STRIPE_REFUND_PATH = '/refunds';

function assertConfig(config: StripeGatewayConfig) {
  if (!config.secretKey) {
    throw new StripeConfigurationError('Stripe secret key is missing');
  }

  if (!config.publishableKey) {
    throw new StripeConfigurationError('Stripe publishable key is missing');
  }

  if (!config.webhookSecret) {
    throw new StripeConfigurationError('Stripe webhook secret is missing');
  }

  if (!config.currency) {
    throw new StripeConfigurationError('Stripe currency is missing');
  }
}

function toMinorUnits(amount: number) {
  return Math.round(amount * 100);
}

function appendMetadata(
  params: URLSearchParams,
  metadata?: Record<string, string | number | null | undefined>,
) {
  if (!metadata) {
    return;
  }

  Object.entries(metadata).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    params.append(`metadata[${key}]`, String(value));
  });
}

function getPaymentIntentNextAction(intent: Record<string, unknown>) {
  const nextAction = intent?.next_action as Record<string, unknown> | undefined;
  if (!nextAction) {
    return undefined;
  }

  return (nextAction.type as string | undefined) ?? undefined;
}

function normalisePaymentIntent(intent: Record<string, unknown>): PaymentIntentResult {
  const amount = Number(intent.amount ?? 0);
  const clientSecret = (intent.client_secret as string | undefined) ?? '';
  const currency = (intent.currency as string | undefined) ?? '';
  const status = (intent.status as string | undefined) ?? 'unknown';

  return {
    id: (intent.id as string | undefined) ?? '',
    clientSecret,
    status,
    amount,
    currency,
    requiresAction: status === 'requires_action' || status === 'requires_source_action',
    nextAction: getPaymentIntentNextAction(intent),
    raw: intent,
  };
}

function normaliseCaptureResult(intent: Record<string, unknown>): CaptureResult {
  return {
    id: (intent.id as string | undefined) ?? '',
    status: (intent.status as string | undefined) ?? 'unknown',
    amountCaptured: Number(intent.amount_received ?? intent.amount_capturable ?? 0),
    raw: intent,
  };
}

function normaliseRefund(refund: Record<string, unknown>): RefundResult {
  return {
    id: (refund.id as string | undefined) ?? '',
    status: (refund.status as string | undefined) ?? 'unknown',
    amountRefunded: Number(refund.amount ?? 0),
    raw: refund,
  };
}

export class StripePaymentGateway {
  private readonly client = createStripeClient(this.config);

  constructor(private readonly config: StripeGatewayConfig) {
    assertConfig(config);
  }

  async createPaymentIntent(
    order: StripeOrderSummary,
    options: CreatePaymentIntentOptions = {},
  ): Promise<PaymentIntentResult> {
    const params = new URLSearchParams();
    const currency = order.currency ?? this.config.currency;
    const amountInMinorUnits = toMinorUnits(order.grandTotal);

    if (amountInMinorUnits <= 0) {
      throw new StripeGatewayError(
        'Cannot create a payment intent for an order with a grand total lower or equal to zero.',
      );
    }

    params.append('amount', String(amountInMinorUnits));
    params.append('currency', currency.toLowerCase());

    const captureMethod = options.captureMethod ?? this.config.captureMethod;
    if (captureMethod) {
      params.append('capture_method', captureMethod);
    }

    if (options.paymentMethodId) {
      params.append('payment_method', options.paymentMethodId);
    }

    if (typeof options.confirm !== 'undefined') {
      params.append('confirm', String(options.confirm));
    }

    if (order.returnUrl) {
      params.append('return_url', order.returnUrl);
    }

    if (order.customerEmail) {
      params.append('receipt_email', order.customerEmail);
    }

    if (order.description) {
      params.append('description', order.description);
    }

    if (this.config.automaticPaymentMethods) {
      params.append('automatic_payment_methods[enabled]', 'true');
    } else if (this.config.paymentMethodTypes?.length) {
      this.config.paymentMethodTypes.forEach((type, index) => {
        params.append(`payment_method_types[${index}]`, type);
      });
    }

    appendMetadata(params, {
      ...this.config.metadata,
      ...order.metadata,
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
    });

    const rawIntent = await this.client.request<Record<string, unknown>>(
      STRIPE_PAYMENT_INTENT_PATH,
      {
        body: params,
        idempotencyKey: options.idempotencyKey,
      },
    );

    return normalisePaymentIntent(rawIntent);
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId?: string) {
    const params = new URLSearchParams();

    if (paymentMethodId) {
      params.append('payment_method', paymentMethodId);
    }

    const rawIntent = await this.client.request<Record<string, unknown>>(
      `${STRIPE_PAYMENT_INTENT_PATH}/${paymentIntentId}/confirm`,
      {
        body: params,
      },
    );

    return normalisePaymentIntent(rawIntent);
  }

  async capturePaymentIntent(paymentIntentId: string, amount?: number): Promise<CaptureResult> {
    const params = new URLSearchParams();

    if (typeof amount === 'number') {
      params.append('amount_to_capture', String(toMinorUnits(amount)));
    }

    const rawIntent = await this.client.request<Record<string, unknown>>(
      `${STRIPE_PAYMENT_INTENT_PATH}/${paymentIntentId}/capture`,
      {
        body: params,
      },
    );

    return normaliseCaptureResult(rawIntent);
  }

  async cancelPaymentIntent(paymentIntentId: string, reason?: string): Promise<PaymentIntentResult> {
    const params = new URLSearchParams();

    if (reason) {
      params.append('cancellation_reason', reason);
    }

    const rawIntent = await this.client.request<Record<string, unknown>>(
      `${STRIPE_PAYMENT_INTENT_PATH}/${paymentIntentId}/cancel`,
      {
        body: params,
      },
    );

    return normalisePaymentIntent(rawIntent);
  }

  async refundPayment(paymentIntentId: string, amount?: number, reason?: string): Promise<RefundResult> {
    const params = new URLSearchParams();
    params.append('payment_intent', paymentIntentId);

    if (typeof amount === 'number') {
      params.append('amount', String(toMinorUnits(amount)));
    }

    if (reason) {
      params.append('reason', reason);
    }

    const rawRefund = await this.client.request<Record<string, unknown>>(STRIPE_REFUND_PATH, {
      body: params,
    });

    return normaliseRefund(rawRefund);
  }
}
