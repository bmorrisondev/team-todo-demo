import { getOneTask } from "@/app/actions";
import { currentUser } from '@clerk/nextjs/server'
import { Liveblocks } from "@liveblocks/node";

export async function POST(req: Request) {
  const user = await currentUser()
  if(!user) {
    return new Response("Not authorized", { status: 401 })
  }
  // 'room' = 'room_${taskId}
  const { room } = await req.json()

  const taskId = room.split("_")[1]

  const task = await getOneTask(+taskId)
  if(!task) {
    return new Response("Not authorized", { status: 401 })
  }

  const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
  });
  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.fullName,
      avatar: user.imageUrl
    }
  });

  session.allow(room, session.FULL_ACCESS)
  const { body, status } = await session.authorize()

  return new Response(body, { status })
}