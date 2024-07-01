import AddTaskForm from "./AddTaskForm";
import TaskRow from "./TaskRow";
import { getTasks } from "./actions";
import { getUserInfo } from "./security";

export default async function Home() {
  const { canEdit } = getUserInfo()
  const tasks = await getTasks()

  return (
    <div className='flex flex-col'>
      <AddTaskForm disabled={!canEdit} />
      <div className='flex flex-col gap-2 p-2'>
        {tasks.map(task => <TaskRow key={task.id} task={task} disabled={!canEdit} />)}
      </div>
    </div>
  );
}
