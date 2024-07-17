import * as React from "react"
import Link from "next/link"
import { OrganizationSwitcher, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { metadata } from "@/app/layout"
import { Button } from "./ui/button"
import { auth } from "@clerk/nextjs/server"

function Navbar() {
  const { sessionClaims } = auth()

  return (
    <nav className="flex p-2 justify-between items-center bg-slate-100 border-b border-slate-200">
      <div className="flex items-center gap-2">
        <Link href="/">{ metadata.title as string }</Link>
      </div>
      <SignedIn>
        <div className="flex items-center gap-2">
          {sessionClaims?.org_role === "org:admin" && <Link href="/licensing">Licensing</Link>}
          <OrganizationSwitcher afterCreateOrganizationUrl={"/licensing"} />
          <UserButton />
        </div>
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in">Sign in</Link>
      </SignedOut>
    </nav>
  )
}

export default Navbar
