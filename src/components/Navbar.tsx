"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

function Navbar() {
  // const {data: session} = useSession();
  const result = useSession();
  const session = result.data;
  //const user = session?.user as User;
  const user: User = session?.user as User;

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="https://mystery-message-git-main-alok-kumar-ojhas-projects.vercel.app/"
          className="text-xl font-bold tracking-tight"
        >
          MysteryMessage
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session ? (
            <>
              <span className="hidden text-sm text-muted-foreground md:block">
                Welcome, {user?.username || user?.email}
              </span>

              <Button variant="outline" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="https://mystery-message-git-main-alok-kumar-ojhas-projects.vercel.app/sign-in">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
