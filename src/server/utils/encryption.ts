import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;
const ENCRYPT_METHOD = "aes-256-cbc";
const ENCODING = "hex";

export const encryption = () => {
  const encrypt = (text: string) => {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ENCRYPT_METHOD, Buffer.from(ENCRYPTION_KEY), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return [iv.toString(ENCODING), encrypted.toString(ENCODING)].join(":");
  };

  const decrypt = (text: string) => {
    const [ivEncoded, encryptedTextEncoded] = text.split(":");
    const iv = Buffer.from(ivEncoded, ENCODING);
    const encryptedText = Buffer.from(encryptedTextEncoded, ENCODING);
    const decipher = createDecipheriv(ENCRYPT_METHOD, Buffer.from(ENCRYPTION_KEY), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

    return decrypted.toString();
  };

  return { encrypt, decrypt };
};

