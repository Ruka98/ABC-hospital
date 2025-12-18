import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/actions/auth"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
  const user = await getCurrentUser()
  if (user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Registration Closed</CardTitle>
          <CardDescription>
            Patient accounts are provisioned by hospital administrators. Please contact the admin team to receive your
            login credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button className="w-full">Back to Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
