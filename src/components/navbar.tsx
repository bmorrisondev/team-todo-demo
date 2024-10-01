"use client"
import * as React from "react"
import Link from "next/link"
import { OrganizationSwitcher, SignedIn, SignedOut, useAuth, UserButton } from "@clerk/nextjs"
import { KeyIcon } from "lucide-react"
import { ImSpinner } from "react-icons/im"

function Navbar() {
  const { has, isLoaded } = useAuth();

  if(!isLoaded) {
    return <ImSpinner />
  }

  const isAdmin = has({ role: "org:admin" });

  return (
    <nav className="flex p-2 justify-between items-center bg-slate-100 border-b border-slate-200">
      <div className="flex items-center gap-2">
        <Link href="/">Team Task</Link>
      </div>
      <SignedIn>
        <div className="flex items-center gap-2">
          <OrganizationSwitcher afterCreateOrganizationUrl={"/licensing"} />
          <UserButton>
            {isAdmin &&
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Licensing"
                  labelIcon={<KeyIcon className='w-[16px] h-[16px]' />}
                  href="/licensing" />
              </UserButton.MenuItems>
            }
          </UserButton>
        </div>
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in">Sign in</Link>
      </SignedOut>
    </nav>
  )
}

export default Navbar
