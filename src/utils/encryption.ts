/**
 * Simple encryption utility for localStorage sensitive data
 * Uses Web Crypto API for AES-GCM encryption
 *
 * Note: This provides obfuscation rather than true security since
 * the key is derived client-side. For production, use server-side
 * secret management.
 */

// Derive a key from a passphrase using PBKDF2
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Generate a device-specific passphrase
function getDevicePassphrase(): string {
  // Combine multiple browser fingerprint elements
  const elements = [
    navigator.userAgent,
    navigator.language,
    screen.width.toString(),
    screen.height.toString(),
    new Date().getTimezoneOffset().toString(),
    'pulse-encryption-v1',
  ];
  return elements.join('|');
}

// Get or create a persistent salt for this device
function getOrCreateSalt(): Uint8Array {
  const SALT_KEY = 'pulse_encryption_salt';
  const existingSalt = localStorage.getItem(SALT_KEY);

  if (existingSalt) {
    return new Uint8Array(JSON.parse(existingSalt));
  }

  const newSalt = crypto.getRandomValues(new Uint8Array(16));
  localStorage.setItem(SALT_KEY, JSON.stringify(Array.from(newSalt)));
  return newSalt;
}

/**
 * Encrypt a string value
 */
export async function encrypt(plaintext: string): Promise<string> {
  try {
    const salt = getOrCreateSalt();
    const key = await deriveKey(getDevicePassphrase(), salt);

    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(plaintext)
    );

    // Combine IV and ciphertext
    const combined = new Uint8Array(iv.length + new Uint8Array(ciphertext).length);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    // Return as base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('[Encryption] Failed to encrypt:', error);
    throw error;
  }
}

/**
 * Decrypt a string value
 */
export async function decrypt(encryptedData: string): Promise<string> {
  try {
    const salt = getOrCreateSalt();
    const key = await deriveKey(getDevicePassphrase(), salt);

    // Decode base64
    const combined = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map((c) => c.charCodeAt(0))
    );

    // Extract IV and ciphertext
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('[Encryption] Failed to decrypt:', error);
    throw error;
  }
}

/**
 * Check if a string appears to be encrypted (base64 with minimum length)
 */
export function isEncrypted(value: string): boolean {
  if (!value || value.length < 20) {return false;}
  try {
    atob(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Encrypt an object's sensitive fields
 */
export async function encryptSensitiveFields<T extends Record<string, unknown>>(
  obj: T,
  sensitiveKeys: string[]
): Promise<T> {
  const result = { ...obj };

  for (const key of sensitiveKeys) {
    const value = result[key];
    if (typeof value === 'string' && value && !isEncrypted(value)) {
      (result as Record<string, unknown>)[key] = await encrypt(value);
    }
  }

  return result;
}

/**
 * Decrypt an object's sensitive fields
 */
export async function decryptSensitiveFields<T extends Record<string, unknown>>(
  obj: T,
  sensitiveKeys: string[]
): Promise<T> {
  const result = { ...obj };

  for (const key of sensitiveKeys) {
    const value = result[key];
    if (typeof value === 'string' && value && isEncrypted(value)) {
      try {
        (result as Record<string, unknown>)[key] = await decrypt(value);
      } catch {
        // If decryption fails, keep the original value
        console.warn(`[Encryption] Failed to decrypt field: ${key}`);
      }
    }
  }

  return result;
}
