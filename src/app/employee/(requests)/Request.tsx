"use client"

import React from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Eye, Wrench } from "lucide-react"

import { cn } from "@/lib/utils"
import { handlePhoneCall, requestStateStyle } from "@/lib/helpers"
import { RequestRowProps } from "@/types/components"
import UserAvatar from "@/components/UserAvatar"
import { useWorkOnDemand } from "@/hooks/useRequests"
import { useAppContext } from "@/contexts/AppProvider"
import { APIResponse } from "@/types/hooks"

const RequestRow: React.FC<RequestRowProps> = ({ request }) => {
  const router = useRouter()
  const { pushToast } = useAppContext()

  const onSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
    router.replace("/employee/holding-requests")
  }

  const onError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const { mutate: workOnDemand, isPending } = useWorkOnDemand({ onSuccess, onError });

  const handleExploreRequest = (id: number) => {
    router.push(`/employee/requests/${id}`)
  }

  const [firstName = "", ...rest] = request.client.name.split(" ")
  const lastName = rest.pop() || ""

  return (
    <TableRow className="hover:bg-gray-100 transition duration-300">
      <TableCell>
        <div className="flex items-center gap-2">
          <UserAvatar
            firstName={firstName}
            lastName={lastName}
            id={request.client.id}
          />

          <div>
            <div className="font-medium text-text">
              {request.client.name}
            </div>

            <span onClick={() => handlePhoneCall(request.client.phone)} className="text-xs text-link cursor-pointer transition duration-300">
              {request.client.phone}
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium text-text">
            {request.service}
          </span>
          <span className="text-xs text-text-muted">
            {request.category || "Uncategorized"}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <span
          className={cn(
            "px-3 py-1 rounded-full font-medium text-xs uppercase",
            requestStateStyle[request.state] || "bg-gray-100 text-gray-800"
          )}
        >
          {request.state}
        </span>
      </TableCell>

      <TableCell className="text-sm text-text-muted">
        {format(new Date(request.createdAt), "PPP p")}
      </TableCell>

      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            className="bg-transparent shadow-none text-blue-500 hover:bg-blue-500 hover:text-face transition-all duration-300 cursor-pointer"
            onClick={() => handleExploreRequest(request.id)}
          >
            <Eye />
          </Button>

          <Button
            disabled={isPending}
            className="bg-transparent shadow-none text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 cursor-pointer"
            onClick={() => workOnDemand({ requestId: request.id })}
          >
            <Wrench className={cn(isPending && "animate-spin")} />
          </Button>
        </div>
      </TableCell>

    </TableRow>
  )
}

export default RequestRow