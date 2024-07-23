import AddTaskForm from "./AddTaskForm";
import TaskRow from "./TaskRow";
import { getTasks } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { isLicensed, canCreateTasks, canEditTask } from "./security";

export default async function Home() {
  const tasks = await getTasks()

  return (
    <div className='flex flex-col'>
      {!isLicensed() && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Account not licensed</AlertTitle>
          <AlertDescription>
            Please contact your administrator for access to this team list.
          </AlertDescription>
        </Alert>
      )}
      <AddTaskForm disabled={!canCreateTasks()} />
      <div className='flex flex-col gap-2 p-2'>
        {tasks.map(task =>
          <TaskRow key={task.id} task={task} disabled={!canEditTask(task.created_by_id)} />
        )}
      </div>
    </div>
  );
}
