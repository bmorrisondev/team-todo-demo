'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useOrganization, useUser } from '@clerk/nextjs'
import { Label } from '@radix-ui/react-label'
import React, { useState } from 'react'
import { getCheckoutUrl } from './actions'
import { ImSpinner } from 'react-icons/im'

function PurchaseLicensesCard() {
  const [count, setCount] = useState(1)
  const { organization } = useOrganization()
  const [isLoading, setIsLoading] = useState(false)

  async function onPurchaseClicked() {
    setIsLoading(true)
    const url = await getCheckoutUrl(organization?.id as string, count)
    window.location.href = url as string
  }

  return (
    <Card className='min-w-[350px]'>
      <CardHeader>
        <CardTitle>
          Purchase licenses for {organization?.name}.
        </CardTitle>
        <CardDescription>
          You'll need to purchase licenses before you can use Team Task.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='flex gap-2 items-baseline'>
          <Input min={1} className="w-[75px]" type="number" onChange={e => setCount(e.target.valueAsNumber)} value={count} />
          <span className="uppercase text-xs text-gray-600">users @ $2/user/mo</span>
        </div>
        <div className="items-baseline flex gap-2">
          <span>Total:</span>
          <Label className='font-bold text-xl'>${count * 2}.00/month</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={isLoading} onClick={onPurchaseClicked}>
          {isLoading ? <ImSpinner className='animate-spin' /> : "Purchase via Stripe"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PurchaseLicensesCard