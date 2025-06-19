"use server";
export async function verifyCode(code: string) {
  if (code === process.env.SECRET_CODE) {
    return true;
  }
  return false;
}
