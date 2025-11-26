import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import DashboardClient from "@/components/dashboard/dashboard-client"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("authToken")?.value

  if (!token) {
    redirect("/login")
  }

  return <DashboardClient token={token} />
}
