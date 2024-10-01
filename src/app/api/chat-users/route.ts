import { getAuth, clerkClient } from '@clerk/nextjs/server'

export async function PSOT(req: Request) {
  const { userIds } = await req.json()
  const users = await clerkClient().users.getUserList({
    userId: userIds
  })
  console.log("users", users)
  return new Response(JSON.stringify(userIds), { status: 200 })
}