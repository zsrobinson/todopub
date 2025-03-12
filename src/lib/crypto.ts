// used chatgpt to write this tbh, just trying to get it working
// probably not best practice to use it for crypto stuff but idk it either

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlEncode(data: Uint8Array): string {
  return btoa(String.fromCharCode(...data))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(base64Url: string): Uint8Array {
  base64Url = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64Url);
  return new Uint8Array([...binary].map((char) => char.charCodeAt(0)));
}

async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000, // High iteration count for security
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(text: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(text)
  );

  // Concatenate salt, iv, and encrypted data into a single buffer
  const combined = new Uint8Array(
    salt.length + iv.length + encryptedData.byteLength
  );
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encryptedData), salt.length + iv.length);

  return base64UrlEncode(combined);
}

export async function decrypt(
  encryptedBase64Url: string,
  password: string
): Promise<string> {
  const combined = base64UrlDecode(encryptedBase64Url);

  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const encryptedData = combined.slice(28);

  const key = await deriveKey(password, salt);

  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedData
  );

  return decoder.decode(decryptedData);
}
