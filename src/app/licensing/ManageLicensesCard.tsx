'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useOrganization, useUser } from '@clerk/nextjs'
import { Label } from '@radix-ui/react-label'
import React, { useState } from 'react'
import { getPortalUrl } from './actions'
import { ImSpinner } from 'react-icons/im'

type Props = {
  licensedUsersCount: number
  purchasedLicensesCount: number
}

function ManageLicensesCard({ licensedUsersCount, purchasedLicensesCount }: Props) {
  const { organization } = useOrganization()
  const [isLoading, setIsLoading] = useState(false)

  async function onManageSubscriptionClicked() {
    setIsLoading(true)
    const url = await getPortalUrl(organization?.id as string)
    window.location.href = url as string
  }

  return (
    <Card className='min-w-[350px] w-full'>
      <CardHeader>
        <CardTitle>
          {organization?.name} is using {licensedUsersCount} of {purchasedLicensesCount} available seats.
        </CardTitle>
      </CardHeader>
      <CardFooter>
        <Button onClick={onManageSubscriptionClicked}>
          {isLoading ? <ImSpinner className='animate-spin' /> : "Manage subscription"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ManageLicensesCard