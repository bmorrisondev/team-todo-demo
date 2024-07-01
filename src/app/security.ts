import { auth } from "@clerk/nextjs/server";

type GetUserInfoResult = {
  userId: string;
}

export function getUserInfo(): GetUserInfoResult {
  const { sessionClaims } = auth();
  if (!sessionClaims) {
    throw new Error('No session claims');
  }
  return {
    userId: sessionClaims.sub,
  }
}