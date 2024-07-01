import { auth } from "@clerk/nextjs/server";

type GetUserInfoResult = {
  userId: string;
  ownerId: string;
  canEdit: boolean;
}

export function getUserInfo(): GetUserInfoResult {
  const { sessionClaims } = auth();
  if (!sessionClaims) {
    throw new Error('No session claims');
  }
  let canEdit = false;
  if(!sessionClaims.org_id) {
    canEdit = true;
  }
  if(sessionClaims.org_id && sessionClaims.org_permissions?.includes('org:tasks:edit')) {
    canEdit = true;
  }
  return {
    userId: sessionClaims.sub,
    ownerId: sessionClaims.org_id ? sessionClaims.org_id : sessionClaims.sub,
    canEdit
  }
}