// app/create-video/page.tsx (SERVER COMPONENT)
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db" // your "server-only" db import is safe in a server component
import { getAuthSession } from "@/lib/auth"
import CreateVideoClient from "./create-video"

export default async function CreateVideoPage() {
  // 1. Check session on the server
  const session = await getAuthSession()
  if (!session) {
    redirect("/login")
  }
  const userId = session.user.id

  // 2. Fetch modules from DB on the server
  const modules = await prisma.videoModule.findMany({
    where: { userId },
    select: { id: true, name: true },
  })

  // 3. Pass data as props to the client component
  return (
    <CreateVideoClient userId={userId} modules={modules} />
  )
}
