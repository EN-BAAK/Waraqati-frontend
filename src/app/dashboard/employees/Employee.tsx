import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import UserAvatar from '@/components/UserAvatar'
import { useAppContext } from '@/contexts/AppProvider'
import { useDeleteEmployeeById } from '@/hooks/useEmployee'
import { handlePhoneCall } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { EmployeeRowProps } from '@/types/components'
import { APIResponse } from '@/types/hooks'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Employee: React.FC<EmployeeRowProps> = ({ employee }) => {
  const { showWarning, pushToast } = useAppContext()
  const router = useRouter();

  const onDeleteSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
  }

  const onDeleteError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const { mutateAsync: deleteMutateAsync, isPending: isDeletePending } = useDeleteEmployeeById({ onSuccess: onDeleteSuccess, onError: onDeleteError })

  const handleEditClient = (id: number) => router.push(`employees/edit/${id}`);
  const handleExploreEmployee = (id: number) => router.push(`employees/${id}`)

  const handleDelete = async (id: number) => {
    showWarning({
      message: "Are you sure you want to delete this employee?",
      btn1: "Cancel",
      btn2: "Delete",
      handleBtn2: () => deleteMutateAsync(id)
    })
  };

  return (
    <TableRow

      className={cn(
        "transition duration-300",
        employee.isVerified
          ? "hover:bg-gray-100"
          : "bg-gray-300 hover:bg-gray-100"
      )}
    >
      <TableCell className="text-center text-sm">
        {employee.id}
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-1">
          <UserAvatar firstName={employee.firstName} lastName={employee.lastName} id={employee.id} />

          <div>
            <div className="font-medium text-text">
              {employee.firstName} {employee.lastName}
            </div>
            <div className="text-xs text-text-muted">
              {employee.email}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <span
          className={cn(
            "px-3 py-1 rounded-full font-medium text-xs",
            employee.isAdmin
              ? "bg-main/10 text-main"
              : "bg-border text-text-muted"
          )}
        >
          {employee.isAdmin ? "Admin" : "Employee"}
        </span>
      </TableCell>

      <TableCell
        onClick={() => handlePhoneCall(employee.phone)}
        className="text-text hover:text-main transition duration-300 cursor-pointer">
        {employee.phone}
      </TableCell>
      <TableCell className="font-semibold text-green-600">
        +{employee.creditor}
      </TableCell>

      <TableCell className="font-semibold text-red-600">
        -{employee.debit}
      </TableCell>

      <TableCell>
        <span
          className={cn(
            "px-3 py-1 rounded-full font-medium text-xs",
            employee.isAvailable
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          )}
        >
          {employee.isAvailable ? "Available" : "Unavailable"}
        </span>
      </TableCell>

      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            className="bg-transparent shadow-none text-orange-500 hover:bg-orange-400 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-500"
            disabled={isDeletePending}
            onClick={() => handleEditClient(employee.id)}
          >
            <Pencil />
          </Button>

          <Button
            className="bg-transparent shadow-none text-red-500 hover:bg-red-500 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-500"
            disabled={isDeletePending}
            onClick={() => handleDelete(employee.id)}
          >
            <Trash2 />
          </Button>

          <Button
            className="bg-transparent shadow-none text-blue-500 hover:bg-blue-500 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-500"
            disabled={isDeletePending}
            onClick={() => handleExploreEmployee(employee.id)}
          >
            <Eye />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default Employee