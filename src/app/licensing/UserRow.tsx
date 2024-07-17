'use client'
import { TableCell, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { toggleUserLicense } from './actions'

// 👉 Define the necessary props we need to render the component
type Props = {
  name: string
  id: string
  orgId: string
  emailAddress?: string
  isLicensed: boolean
  disabled?: boolean
}

function UserRow({ name, id, orgId, isLicensed, emailAddress, disabled }: Props) {

  async function onToggleUserLicense() {
    try {
      await toggleUserLicense(orgId, id, !isLicensed)
      window.location.reload()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <TableRow>
      <TableCell className="flex flex-col">
        <span>{name}</span>
        <span className="text-xs italic text-gray-600">{id}</span>
      </TableCell>

      <TableCell>{emailAddress}</TableCell>

      <TableCell className="text-right">
        <Switch onCheckedChange={onToggleUserLicense} checked={isLicensed} disabled={disabled} aria-readonly />
      </TableCell>
    </TableRow>
  )
}

export default UserRow