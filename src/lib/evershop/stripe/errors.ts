export class StripeGatewayError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'StripeGatewayError';
  }
}

export class StripeConfigurationError extends StripeGatewayError {
  constructor(message: string) {
    super(message);
    this.name = 'StripeConfigurationError';
  }
}

export interface StripeRequestErrorOptions {
  status: number;
  requestId?: string;
  type?: string;
  rawBody: unknown;
}

export class StripeRequestError extends StripeGatewayError {
  public readonly status: number;
  public readonly requestId?: string;
  public readonly type?: string;
  public readonly rawBody: unknown;

  constructor(message: string, options: StripeRequestErrorOptions) {
    super(message);
    this.name = 'StripeRequestError';
    this.status = options.status;
    this.requestId = options.requestId;
    this.type = options.type;
    this.rawBody = options.rawBody;
  }
}

export class StripeSignatureVerificationError extends StripeGatewayError {
  constructor(message: string) {
    super(message);
    this.name = 'StripeSignatureVerificationError';
  }
}
