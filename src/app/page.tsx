import { auth } from "@clerk/nextjs/server";
import AddTaskForm from "./AddTaskForm";
import TaskRow from "./TaskRow";
import { getTasks } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default async function Home() {
  let canEdit = false
  const { sessionClaims } = auth();
  if(!sessionClaims?.org_id) {
    canEdit = true
  }
  if (sessionClaims?.org_id && sessionClaims?.org_permissions?.includes('org:tasks:edit')) {
    canEdit = true
  }

  let isLicensed = false
  // @ts-ignore
  if(sessionClaims?.org_metadata && sessionClaims?.org_metadata.isLicensed) {
    isLicensed = true
  }
  // This is a personal account
  if(!sessionClaims?.org_id) {
    isLicensed = true
  }

  const getCurrentlyLicensedUsersCount = async function () {
    // TODO: if assigned ? license count, disable everything
  }

  const tasks = await getTasks()

  return (
    <div className='flex flex-col'>
      {!isLicensed && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Account not licensed</AlertTitle>
          <AlertDescription>
            Please contact your administrator for access to this team list.
          </AlertDescription>
        </Alert>
      )}
      <AddTaskForm disabled={!canEdit || !isLicensed} />
      <div className='flex flex-col gap-2 p-2'>
        {tasks.map(task => <TaskRow key={task.id} task={task} disabled={!canEdit || !isLicensed} />)}
      </div>
    </div>
  );
}
