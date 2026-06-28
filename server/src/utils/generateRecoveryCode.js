// Generate a random recovery code in format XXXX-XXXX-XXXX
import crypto from "crypto";

const generateRecoveryCode = () => {
  const bytes = crypto.randomBytes(6);
  const hex = bytes.toString("hex").toUpperCase();
  return `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
};

export default generateRecoveryCode;
