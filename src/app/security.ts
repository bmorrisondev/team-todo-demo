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

export function isLicensed() {
  const { sessionClaims } = auth();
  let isLicensed = false
  // @ts-ignore
  if(sessionClaims?.org_metadata && sessionClaims?.org_metadata.isLicensed) {
    isLicensed = true
  }
  // This is a personal account
  if(!sessionClaims?.org_id) {
    isLicensed = true
  }
  return isLicensed
}

export function canCreateTasks() {
  const { sessionClaims, has } = auth();
  if(!isLicensed()) return false
  let canCreateTasks = false
  // 👉 If there is no org, it's the user's personal account
  if(!sessionClaims?.org_id) {
    canCreateTasks = true
  }
  // 👉 Check to make sure the user has the 'org:tasks:edit' permission
  if (sessionClaims?.org_id && has({ permission: "org:tasks:edit" })) {
    canCreateTasks = true
  }
  return canCreateTasks
}

export function canEditTask(createdById: string) {
  if(!isLicensed()) return false
  const { userId, sessionClaims, has } = auth();
  let canEditTask = false
  // 👉 If there is no org, it's the user's personal account
  if(!sessionClaims?.org_id) {
    canEditTask = true
  } else {
    // 👉 If the user has the 'org:tasks:manage' permission, they can edit any task
    if(has({ permission: "org:tasks:manage" })) {
      canEditTask = true
      // 👉 If the user has the 'org:tasks:edit' permission AND the user IDs match, they can edit this task
    } else if(has({ permission: "org:tasks:edit" }) && createdById === userId) {
      canEditTask = true
    }
  }
  return canEditTask
}