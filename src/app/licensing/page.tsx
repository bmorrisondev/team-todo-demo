import { TableHeader, TableRow, TableHead, TableBody, Table } from '@/components/ui/table'
import React from 'react'
import UserRow from './UserRow'
import { auth, clerkClient } from '@clerk/nextjs/server'
import PurchaseLicensesCard from './PurchaseLicensesCard'
import ManageLicensesCard from './ManageLicensesCard'
import { neon } from '@neondatabase/serverless'

type UserRowViewModel = {
  id: string
  orgId: string
  email: string
  name: string
  isLicensed: boolean
}

const sql = neon(process.env.DATABASE_URL as string)

async function Licensing() {
  const { sessionClaims } = auth()

  // Load license count
  const [row] = await sql`select license_count from orgs where org_id=${sessionClaims?.org_id as string}`
  const currentLicenseCount = row.license_count
  let currentlyLicensedUsers = 0

  // Load users
  let res = await clerkClient.organizations.getOrganizationMembershipList({
    organizationId: sessionClaims?.org_id as string
  })
  const users: UserRowViewModel[] = []
  res.data.forEach(el => {
    let name = el.publicUserData?.firstName ? `${el.publicUserData?.firstName} ${el.publicUserData?.lastName}` : ''
    const isLicensed = el.publicMetadata?.isLicensed as boolean || false
    if(isLicensed) {
      currentlyLicensedUsers++
    }
    users.push({
      id: el.publicUserData?.userId as string,
      orgId: sessionClaims?.org_id as string,
      email: el.publicUserData?.identifier as string,
      name: name,
      isLicensed
    })
  })


  return (
    <main>
      <h1 className="my-2 text-2xl font-bold">Licensing</h1>
      <div className='flex justify-center mb-4'>
        {currentLicenseCount === 0 ? (
          <PurchaseLicensesCard />
        ) : (
          <ManageLicensesCard
            licensedUsersCount={currentlyLicensedUsers}
            purchasedLicensesCount={currentLicenseCount} />
        )}
      </div>
      {currentLicenseCount > 0 && (
        <>
        <h2 className="my-2 text-xl">Users</h2>
        <Table className="rounded-lg border border-gray-200">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">License enabled?</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((u) => (
              <UserRow
                key={u.id}
                id={u.id}
                orgId={u.orgId}
                name={u.name ? u.name : u.email}
                isLicensed={u.isLicensed}
                emailAddress={u.email}
                disabled={!u.isLicensed && (currentlyLicensedUsers >= currentLicenseCount)}
              />
            ))}
          </TableBody>
        </Table>
        </>
      )}
    </main>
  )
}

export default Licensing
