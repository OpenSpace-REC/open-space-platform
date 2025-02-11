import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY || "your-32-byte-secret-key"; // Must be 32 characters

export function encryptToken(token: string): string {
  return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
}

export function decryptToken(encryptedToken: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
