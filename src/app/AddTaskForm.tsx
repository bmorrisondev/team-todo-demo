'use client'
import React, { useEffect } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createTask } from './actions';

function AddTaskForm() {
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    await createTask(name)
    window.location.reload()
  }

  return (
    <form onSubmit={onSubmit} className='flex gap-2'>
      <Input autoFocus type='text' name='name' placeholder='What do you need to do?'/>
      <Button type='submit'>Add</Button>
    </form>
  )
}

export default AddTaskForm