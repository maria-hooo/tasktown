import Link from "next/link";
import { Container, Card, Button } from "@/components/ui";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <Container>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">TaskTown</h1>
          <p className="text-gray-600">A simple full-stack tasks app you can deploy on AWS tomorrow.</p>
        </div>
        <div className="flex gap-2">
          {session ? (
            <Link href="/dashboard"><Button>Go to Dashboard</Button></Link>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost">Login</Button></Link>
              <Link href="/register"><Button>Create account</Button></Link>
            </>
          )}
        </div>
      </div>

      <Card>
        <h2 className="text-xl font-semibold">What you get</h2>
        <ul className="mt-3 list-disc pl-5 text-gray-700">
          <li>Email/password authentication (NextAuth Credentials)</li>
          <li>PostgreSQL database with Prisma</li>
          <li>Secure API routes for task CRUD</li>
          <li>Clean Tailwind UI (fast to extend)</li>
        </ul>
      </Card>
    </Container>
  );
}
