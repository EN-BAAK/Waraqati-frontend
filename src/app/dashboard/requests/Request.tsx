"use client"

import React from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Eye, X, RotateCcw, Star, ClipboardCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { handlePhoneCall } from "@/lib/helpers"
import UserAvatar from "@/components/UserAvatar"
import { useRequestStateTransaction } from "@/hooks/useRequests"
import { useAppContext } from "@/contexts/AppProvider"
import { APIResponse } from "@/types/hooks"
import { REQUESTS_STATE } from "@/types/global"
import { requestStateStyle, stateAccentLine } from "@/constants/global"
import { DashboardRequestRowProps } from "@/types/components"

const RequestRow: React.FC<DashboardRequestRowProps> = ({ request }) => {
  const router = useRouter()
  const { pushToast } = useAppContext()

  const onSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
  }

  const onError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const { mutateAsync: changeState, isPending } = useRequestStateTransaction({ onSuccess, onError })

  const handleExploreRequest = (id: number) => {
    router.push(`/requests/${id}`)
  }

  const handleChangeState = async (nextState: REQUESTS_STATE) => {
    await changeState({ requestId: request.id, state: nextState, role: "manager" })
  }

  const splitName = (fullName: string) => {
    const [firstName = "", ...rest] = fullName.split(" ")
    const lastName = rest.pop() || ""
    return { firstName, lastName }
  }

  const client = splitName(request.client.name)
  const employee = splitName(request.employee?.name ?? "")

  type ActionButton = {
    icon: React.ReactNode
    title: string
    action: () => void
    className: string
  }

  const getActionsByState = (
    state: REQUESTS_STATE,
  ): ActionButton[] => {
    switch (state) {
      case REQUESTS_STATE.IN_HOLD: {
        const actions: ActionButton[] = [
          {
            icon: <X className="w-3.5 h-3.5" />,
            title: "Cancel",
            action: () => handleChangeState(REQUESTS_STATE.CANCELED),
            className: "text-red-500 hover:bg-red-500 hover:text-white",
          },
          {
            icon: <RotateCcw className="w-3.5 h-3.5" />,
            title: "Move to Queue",
            action: () => handleChangeState(REQUESTS_STATE.IN_QUEUE),
            className: "text-amber-500 hover:bg-amber-500 hover:text-white",
          },
        ]
        return actions
      }

      case REQUESTS_STATE.IN_PROGRESS: {
        const actions: ActionButton[] = []
        actions.push(
          {
            icon: <X className="w-3.5 h-3.5" />,
            title: "Cancel",
            action: () => handleChangeState(REQUESTS_STATE.CANCELED),
            className: "text-red-500 hover:bg-red-500 hover:text-white",
          },
          {
            icon: <RotateCcw className="w-3.5 h-3.5" />,
            title: "Move to Queue",
            action: () => handleChangeState(REQUESTS_STATE.IN_QUEUE),
            className: "text-amber-500 hover:bg-amber-500 hover:text-white",
          }
        )
        return actions
      }

      case REQUESTS_STATE.FINISHED: {
        const actions: ActionButton[] = []
        actions.push(
          {
            icon: <ClipboardCheck className="w-3.5 h-3.5" />,
            title: "Review",
            action: () => handleChangeState(REQUESTS_STATE.REVIEWED),
            className: "text-purple-500 hover:bg-purple-500 hover:text-white",
          },
          {
            icon: <Star className="w-3.5 h-3.5" />,
            title: "Succeed",
            action: () => handleChangeState(REQUESTS_STATE.SUCCEED),
            className: "text-amber-500 hover:bg-amber-500 hover:text-white",
          }
        )
        return actions
      }

      case REQUESTS_STATE.REVIEWED: {
        const actions: ActionButton[] = []
        actions.push(
          {
            icon: <X className="w-3.5 h-3.5" />,
            title: "Cancel",
            action: () => handleChangeState(REQUESTS_STATE.CANCELED),
            className: "text-red-500 hover:bg-red-500 hover:text-white",
          },
          {
            icon: <RotateCcw className="w-3.5 h-3.5" />,
            title: "Move to Queue",
            action: () => handleChangeState(REQUESTS_STATE.IN_QUEUE),
            className: "text-amber-500 hover:bg-amber-500 hover:text-white",
          }
        )
        return actions
      }

      case REQUESTS_STATE.CANCELED: {
        return [
          {
            icon: <RotateCcw className="w-3.5 h-3.5" />,
            title: "Back to Queue",
            action: () => handleChangeState(REQUESTS_STATE.IN_QUEUE),
            className: "text-amber-500 hover:bg-amber-500 hover:text-white",
          },
        ]
      }

      default:
        return []
    }
  }

  const currentActions = getActionsByState(request.state)

  return (
    <TableRow className="hover:bg-gray-100 transition duration-300">
      <TableCell className="py-3 pl-4">
        <div className="flex items-center gap-2.5">
          <UserAvatar
            firstName={client.firstName}
            lastName={client.lastName}
            id={request.client.id}
          />
          <div className="min-w-0">
            <div className="font-medium text-sm text-text truncate leading-tight">
              {request.client.name}
            </div>
            <span
              onClick={() => handlePhoneCall(request.client.phone)}
              className="text-xs text-link hover:text-link-hover cursor-pointer transition-colors duration-200"
            >
              {request.client.phone}
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell className="py-3">
        {request.employee ? (
          <div className="flex items-center gap-2.5">
            <UserAvatar
              firstName={employee.firstName}
              lastName={employee.lastName}
              id={request.employee.id}
            />
            <div className="min-w-0">
              <div className="font-medium text-sm text-text truncate leading-tight">
                {request.employee.name}
              </div>
              <span
                onClick={() => handlePhoneCall(request.employee.phone)}
                className="text-xs text-link hover:text-link-hover cursor-pointer transition-colors duration-200"
              >
                {request.employee.phone}
              </span>
            </div>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-text-muted italic">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block" />
            Unassigned
          </span>
        )}
      </TableCell>

      <TableCell className="py-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-sm text-text leading-tight">
            {request.service}
          </span>
          <span className="text-xs text-text-muted">
            {request.category ?? "Uncategorized"}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <span
          className={cn(
            "px-3 py-1 rounded-full font-medium text-xs uppercase",
            requestStateStyle[request.state] ||
            "bg-gray-100 text-gray-800"
          )}
        >
          {request.state}
        </span>
      </TableCell>

      <TableCell className="py-3 text-xs text-text-muted whitespace-nowrap">
        {format(new Date(request.createdAt), "PPP p")}
      </TableCell>

      <TableCell className="py-3 pr-4">
        <div className="flex items-center justify-end gap-1">
          <Button
            className="bg-transparent shadow-none text-blue-500 hover:bg-blue-500 hover:text-face transition-all duration-300 cursor-pointer"
            onClick={() => handleExploreRequest(request.id)}
          >
            <Eye />
          </Button>

          {currentActions.map((btn, idx) => (
            <Button
              key={`actions-${idx}`}
              size="icon"
              variant="ghost"
              disabled={isPending}
              title={btn.title}
              className={cn(
                "bg-transparent shadow-none transition-all duration-300 group cursor-pointer",
                btn.className
              )}
              onClick={btn.action}
            >
              {btn.icon}
            </Button>
          ))}
        </div>
      </TableCell>
    </TableRow>
  )
}

export default RequestRow