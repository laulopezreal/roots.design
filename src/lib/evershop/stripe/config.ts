import { StripeConfigurationError } from './errors';
import { StripeGatewayConfig } from './types';

export interface StripeConfigEnvironment {
  STRIPE_SECRET_KEY?: string;
  STRIPE_PUBLISHABLE_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_CURRENCY?: string;
  STRIPE_CAPTURE_METHOD?: string;
}

function normaliseCaptureMethod(value?: string) {
  if (!value) {
    return undefined;
  }

  const captureMethod = value.toLowerCase();
  if (captureMethod !== 'automatic' && captureMethod !== 'manual') {
    throw new StripeConfigurationError(
      `Unsupported Stripe capture method "${value}". Valid options are "automatic" or "manual".`,
    );
  }

  return captureMethod;
}

export function buildStripeGatewayConfigFromEnv(
  env: StripeConfigEnvironment,
  overrides: Partial<StripeGatewayConfig> = {},
): StripeGatewayConfig {
  const config: StripeGatewayConfig = {
    secretKey: env.STRIPE_SECRET_KEY ?? overrides.secretKey ?? '',
    publishableKey: env.STRIPE_PUBLISHABLE_KEY ?? overrides.publishableKey ?? '',
    webhookSecret: env.STRIPE_WEBHOOK_SECRET ?? overrides.webhookSecret ?? '',
    currency: env.STRIPE_CURRENCY ?? overrides.currency ?? '',
    captureMethod:
      (overrides.captureMethod ?? normaliseCaptureMethod(env.STRIPE_CAPTURE_METHOD)) ?? undefined,
    metadata: overrides.metadata,
    automaticPaymentMethods: overrides.automaticPaymentMethods,
    paymentMethodTypes: overrides.paymentMethodTypes,
  };

  return config;
}
