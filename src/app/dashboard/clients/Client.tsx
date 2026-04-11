import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import UserAvatar from '@/components/UserAvatar'
import { useAppContext } from '@/contexts/AppProvider'
import { useDeleteClientById, useUpdateClientSpecialization } from '@/hooks/useClient'
import { handlePhoneCall } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { ClientRowProps } from '@/types/components'
import { SEX } from '@/types/global'
import { APIResponse } from '@/types/hooks'
import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { BsStar, BsStarFill } from 'react-icons/bs'

const Client: React.FC<ClientRowProps> = ({ client }) => {
  const { showWarning, pushToast } = useAppContext()
  const router = useRouter();

  const onDeleteSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
  }

  const onDeleteError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const onUpdateSpecializationSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
  }

  const onUpdateSpecializationError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const { mutateAsync: deleteMutateAsync, isPending: isDeletePending } = useDeleteClientById({ onSuccess: onDeleteSuccess, onError: onDeleteError })
  const { mutateAsync: updateSpecializationMutateAsync, isPending: isUpdateSpecializationPending } = useUpdateClientSpecialization({ onSuccess: onUpdateSpecializationSuccess, onError: onUpdateSpecializationError })

  const handleEditClient = (id: number) => router.push(`clients/edit/${id}`);

  const handleDelete = async (id: number) => {
    showWarning({
      message: "Are you sure you want to delete this client?",
      btn1: "Cancel",
      btn2: "Delete",
      handleBtn2: () => deleteMutateAsync(id)
    })
  };

  const handleUpdateSpecialization = async (id: number, isSpecial: boolean) => {
    const reversedSpecialization = !isSpecial
    updateSpecializationMutateAsync({ userId: id, isSpecial: reversedSpecialization })
  }

  return (
    <TableRow
      className={cn(
        "transition duration-300",
        client.isVerified
          ? client.isSpecial
            ? "bg-yellow-200 hover:bg-yellow-300"
            : ""
          : client.isSpecial
            ? "bg-yellow-200/50 text-gray-700 hover:bg-yellow-300/60"
            : "bg-gray-300 hover:bg-gray-200"
      )}
    >
      <TableCell className="text-sm">
        <div className="flex items-center justify-center gap-1">
          {client.isSpecial ? (
            <BsStarFill
              onClick={() => handleUpdateSpecialization(client.id, client.isSpecial)}
              size={16}
              className="text-yellow-400 cursor-pointer hover:text-yellow-500 transition-colors"
            />
          ) : (
            <BsStar
              onClick={() => handleUpdateSpecialization(client.id, client.isSpecial)}
              size={16}
              className="text-yellow-400 cursor-pointer hover:text-yellow-500 transition-colors"
            />
          )}
          {client.id}
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-1">
          <UserAvatar firstName={client.firstName} lastName={client.lastName} id={client.id} />

          <div>
            <div className="font-medium text-text">
              {client.firstName} {client.lastName}
            </div>
            <div className="text-xs text-text-muted">
              {client.email}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell
        onClick={() => handlePhoneCall(client.phone)}
        className="text-text hover:text-main transition duration-300 cursor-pointer">
        {client.phone}
      </TableCell>
      <TableCell>{client.country}</TableCell>
      <TableCell>{client.age}</TableCell>
      <TableCell>
        <span
          className={cn(
            "px-3 py-1 rounded-full font-medium text-xs",
            client.sex === SEX.Male
              ? "bg-main/10 text-main"
              : client.sex === SEX.Female
                ? "bg-red-200 text-red-500"
                : "bg-green-100 text-green-500"
          )}
        >
          {client.sex}
        </span>
      </TableCell>
      <TableCell className="font-semibold text-green-600">+{client.creditor}</TableCell>
      <TableCell className="font-semibold text-red-600">-{client.debit}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            className="bg-transparent shadow-none text-orange-500 hover:bg-orange-400 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDeletePending || isUpdateSpecializationPending}
            onClick={() => handleEditClient(client.id)}
          >
            <Pencil />
          </Button>

          <Button
            className="bg-transparent shadow-none text-red-500 hover:bg-red-500 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDeletePending || isUpdateSpecializationPending}
            onClick={() => handleDelete(client.id)}
          >
            <Trash2 />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default Client