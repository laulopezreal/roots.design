import { StripeGatewayConfig } from './types';
import { StripeRequestError } from './errors';

const STRIPE_API_BASE_URL = 'https://api.stripe.com/v1';

export interface StripeRequestOptions {
  method?: 'GET' | 'POST';
  body?: URLSearchParams | string;
  idempotencyKey?: string;
}

export interface StripeClient {
  request<T>(path: string, options?: StripeRequestOptions): Promise<T>;
}

function resolveBody(body?: URLSearchParams | string) {
  if (!body) {
    return undefined;
  }

  if (typeof body === 'string') {
    return body;
  }

  return body.toString();
}

function resolveHeaders(config: StripeGatewayConfig, options?: StripeRequestOptions) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${config.secretKey}`,
  };

  if (options?.body instanceof URLSearchParams) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  if (options?.idempotencyKey) {
    headers['Idempotency-Key'] = options.idempotencyKey;
  }

  return headers;
}

function extractStripeErrorDetails(body: Record<string, unknown>) {
  const error = body?.error as Record<string, unknown> | undefined;
  return {
    type: (error?.type as string | undefined) ?? 'unknown_error',
    message: (error?.message as string | undefined) ?? 'Unknown Stripe error',
  };
}

export function createStripeClient(config: StripeGatewayConfig): StripeClient {
  return {
    async request<T>(path: string, options?: StripeRequestOptions): Promise<T> {
      const url = `${STRIPE_API_BASE_URL}${path}`;
      const response = await fetch(url, {
        method: options?.method ?? 'POST',
        headers: resolveHeaders(config, options),
        body: resolveBody(options?.body),
      });

      const responseBody = (await response.json()) as Record<string, unknown>;

      if (!response.ok) {
        const { type, message } = extractStripeErrorDetails(responseBody);
        throw new StripeRequestError(message, {
          status: response.status,
          type,
          requestId: response.headers.get('request-id') ?? undefined,
          rawBody: responseBody,
        });
      }

      return responseBody as T;
    },
  };
}
