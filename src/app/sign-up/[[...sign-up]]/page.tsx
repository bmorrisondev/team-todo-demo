import { SignUp } from '@clerk/nextjs'
import React from 'react'

function SignUpPage() {
  return (
    <div className='flex flex-col items-center gap-4'>
      <SignUp />
    </div>
  )
}

export default SignUpPage