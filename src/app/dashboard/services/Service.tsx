import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { useAppContext } from '@/contexts/AppProvider'
import { useDeleteServiceById } from '@/hooks/useService'
import { formatBalance } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { ServiceRowProps } from '@/types/components'
import { APIResponse } from '@/types/hooks'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Service: React.FC<ServiceRowProps> = ({ service }) => {
  const router = useRouter();
  const { showWarning, pushToast } = useAppContext();

  const onDeleteSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
  }
  const onDeleteError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }


  const { isPending: isDeletePending, mutateAsync: deleteMutation, } = useDeleteServiceById({ onSuccess: onDeleteSuccess, onError: onDeleteError })

  const handleEditService = (id: number) => router.push(`services/edit/${id}`);
  const handleExploreService = (id: number) => router.push(`services/${id}`);
  const handleDelete = async (id: number) => {
    showWarning({
      message: "Are you sure you want to delete this service?",
      btn1: "Cancel",
      btn2: "Delete",
      handleBtn2: () => deleteMutation(id),
    });
  };


  return (
    <TableRow className={cn("transition duration-300 hover:bg-gray-100")} >
      <TableCell className="text-center text-sm">{service.id}</TableCell>

      <TableCell className="font-medium text-text">
        <p>{service.title}</p>
        <span className="text-text-muted text-xs">{service.category}</span>
      </TableCell>

      <TableCell className="text-sm text-text-muted max-w-xs truncate">
        {service.description}
      </TableCell>
      <TableCell>{service.duration}</TableCell>

      <TableCell className="font-semibold text-green-600">
        {formatBalance(service.price)}
      </TableCell>

      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            className="bg-transparent shadow-none text-orange-500 hover:bg-orange-400 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-500"
            disabled={isDeletePending}
            onClick={() => handleEditService(service.id)}
          >
            <Pencil className="w-4 h-4" />
          </Button>

          <Button
            className="bg-transparent shadow-none text-red-500 hover:bg-red-500 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-500"
            disabled={isDeletePending}
            onClick={() => handleDelete(service.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <Button
            className="bg-transparent shadow-none text-blue-500 hover:bg-blue-500 hover:text-face transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-500"
            disabled={isDeletePending}
            onClick={() => handleExploreService(service.id)}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default Service