import { auth } from "@clerk/nextjs/server";

type GetUserInfoResult = {
  userId: string;
  ownerId: string;
}

export function getUserInfo(): GetUserInfoResult {
  const { sessionClaims } = auth();
  if (!sessionClaims) {
    throw new Error('No session claims');
  }
  return {
    userId: sessionClaims.sub,
    ownerId: sessionClaims.org_id ? sessionClaims.org_id : sessionClaims.sub,
  }
}