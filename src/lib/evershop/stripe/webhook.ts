import {
  StripeGatewayConfig,
  StripeWebhookEvent,
  StripeWebhookValidationResult,
} from './types';
import { StripeSignatureVerificationError } from './errors';

interface StripeSignatureParts {
  timestamp: number;
  signatures: string[];
}

function parseSignatureHeader(header: string | null | undefined): StripeSignatureParts | null {
  if (!header) {
    return null;
  }

  const segments = header.split(',');
  const timestampSegment = segments.find((segment) => segment.startsWith('t='));
  const signatureSegments = segments
    .filter((segment) => segment.startsWith('v1='))
    .map((segment) => segment.replace('v1=', '').trim())
    .filter(Boolean);

  if (!timestampSegment || signatureSegments.length === 0) {
    return null;
  }

  const timestamp = Number(timestampSegment.replace('t=', ''));
  if (Number.isNaN(timestamp)) {
    return null;
  }

  return {
    timestamp,
    signatures: signatureSegments,
  };
}

function toHex(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  const hex: string[] = [];
  bytes.forEach((byte) => {
    hex.push(byte.toString(16).padStart(2, '0'));
  });
  return hex.join('');
}

async function computeHmacSha256(secret: string, payload: string) {
  const subtle = globalThis.crypto?.subtle;

  if (!subtle) {
    throw new StripeSignatureVerificationError(
      'Web Crypto API is not available to compute the Stripe webhook signature',
    );
  }

  const encoder = new TextEncoder();
  const key = await subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await subtle.sign('HMAC', key, encoder.encode(payload));
  return toHex(signature);
}

function safeCompare(expected: string, actual: string) {
  if (expected.length !== actual.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < expected.length; index += 1) {
    mismatch |= expected.charCodeAt(index) ^ actual.charCodeAt(index);
  }

  return mismatch === 0;
}

function parsePayload(payload: string): StripeWebhookEvent | undefined {
  try {
    return JSON.parse(payload) as StripeWebhookEvent;
  } catch (error) {
    console.warn('Unable to parse Stripe webhook payload', error);
    return undefined;
  }
}

function normalisePayload(payload: string | Uint8Array) {
  if (typeof payload === 'string') {
    return payload;
  }

  const decoder = new TextDecoder();
  return decoder.decode(payload);
}

export async function validateStripeWebhookEvent(
  payload: string | Uint8Array,
  signatureHeader: string | null | undefined,
  config: StripeGatewayConfig,
  toleranceInSeconds = 300,
): Promise<StripeWebhookValidationResult> {
  const normalisedPayload = normalisePayload(payload);
  const parsedSignature = parseSignatureHeader(signatureHeader);

  if (!parsedSignature) {
    return { valid: false, reason: 'invalid-signature-header' };
  }

  const { timestamp, signatures } = parsedSignature;
  const currentTimestamp = Math.floor(Date.now() / 1000);

  if (Math.abs(currentTimestamp - timestamp) > toleranceInSeconds) {
    return { valid: false, reason: 'timestamp-out-of-range' };
  }

  const signedPayload = `${timestamp}.${normalisedPayload}`;
  const expectedSignature = await computeHmacSha256(config.webhookSecret, signedPayload);

  const valid = signatures.some((candidate) => safeCompare(candidate, expectedSignature));

  if (!valid) {
    return { valid: false, reason: 'signature-mismatch' };
  }

  const event = parsePayload(normalisedPayload);

  if (!event) {
    return { valid: false, reason: 'invalid-payload' };
  }

  return { valid: true, event };
}
