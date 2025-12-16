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
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <p className="mt-1 text-gray-600">
            Hi student, this is a simple task management web application built for a university project.
          </p>
        </div>

        <div className="flex gap-2">
          {session ? (
            <Link href="/dashboard">
              <Button>Go to dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Create account</Button>
              </Link>
            </>
          )}
        </div>
      </div>

    </Container>
  );
}
