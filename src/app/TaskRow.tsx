'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { FiCircle, FiCheckCircle } from "react-icons/fi";
import { auth } from '@clerk/nextjs/server';
import { Task, setTaskState, updateTask } from './actions';
import { ImInfo } from 'react-icons/im';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

type Props = {
  task: Task
}

function TaskRow({ task }: Props) {
  const [isDone, setIsDone] = useState(task.is_done)

  async function onCheckClicked() {
    await setTaskState(task.id, !isDone)
    setIsDone(!isDone)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    console.log(name, description)
    await updateTask(task.id, name, description)
    window.location.reload()
  }

  return (
    <div key={task.id} className={`group flex items-center transition-all w-full${isDone ? 'text-slate-500' : ''}`}>
      <Button variant='link' className='text-lg text-inherit' onClick={onCheckClicked}>
        { isDone ? <FiCheckCircle /> : <FiCircle /> }
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className={`flex-1 justify-start ${isDone && 'line-through'}`}>
            {task.name}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            Edit task
          </DialogHeader>
          <form onSubmit={onSubmit} className='flex flex-col gap-2'>
            <Label htmlFor="name">Name</Label>
            <Input type='text' name='name' defaultValue={task.name} />
            <Label htmlFor="Description">Description</Label>
            <Textarea name='description' defaultValue={task.description} />
            <Button type='submit'>Save</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TaskRow