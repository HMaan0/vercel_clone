import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
export function decryptEnv(text: string) {
  if (ENCRYPTION_KEY) {
    const textParts = text.split(":");
    const textPartsShift = textParts.shift();
    if (textPartsShift) {
      const iv = Buffer.from(textPartsShift, "hex");
      const encryptedText = Buffer.from(textParts.join(":"), "hex");
      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(ENCRYPTION_KEY, "hex"),
        iv
      );
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    }
    return "";
  } else {
    return "";
  }
}
