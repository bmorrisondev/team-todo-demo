import { SignIn } from '@clerk/nextjs'
import React from 'react'

function SignInPage() {

  return (
    <div className='flex flex-col items-center gap-4'>
      <SignIn />
    </div>
  )
}

export default SignInPage