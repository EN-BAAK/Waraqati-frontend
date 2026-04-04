"use client"

import React from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Eye, Wrench, X, Play, Check, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { handlePhoneCall } from "@/lib/helpers"
import { RequestRowProps } from "@/types/components"
import UserAvatar from "@/components/UserAvatar"
import { useRequestStateTransaction } from "@/hooks/useRequests"
import { useAppContext } from "@/contexts/AppProvider"
import { APIResponse } from "@/types/hooks"
import { REQUESTS_STATE, ROLE } from "@/types/global"
import { requestStateStyle } from "@/constants/global"

const RequestRow: React.FC<RequestRowProps> = ({ request }) => {
  const router = useRouter()
  const { pushToast, user } = useAppContext()

  const onSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
    router.replace("/requests/tasks")
  }

  const onError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const { mutateAsync: changeState, isPending } = useRequestStateTransaction({ onSuccess, onError, })

  const handleExploreRequest = (id: number) => {
    router.push(`/requests/${id}`)
  }

  const role = user?.role === ROLE.CLIENT ? "client" : "employee"

  const handleChangeState = async (nextState: REQUESTS_STATE) => {
    await changeState({ requestId: request.id, state: nextState, role: "employee" })
  }

  const [firstName = "", ...rest] = request.client.name.split(" ")
  const lastName = rest.pop() || ""

  type ActionButton = {
    icon: React.ReactNode
    title: string
    action: () => void,
    className: string
  }

  const getActionsByState = (
    state: REQUESTS_STATE,
    role: "employee" | "client"
  ): ActionButton[] => {
    if (role === "client") return [];

    switch (state) {

      case REQUESTS_STATE.IN_QUEUE: {
        const actions: ActionButton[] = []

        actions.push({
          icon: <Wrench className="text-green-600 group-hover:text-white" />,
          title: "Work on demand",
          action: () => handleChangeState(REQUESTS_STATE.IN_HOLD),
          className: "hover:bg-green-600"
        })

        return actions
      }

      case REQUESTS_STATE.IN_HOLD: {
        const actions: ActionButton[] = []

        actions.push(
          {
            icon: <X className="text-red-500 group-hover:text-white" />,
            title: "Cancel",
            action: () => handleChangeState(REQUESTS_STATE.CANCELED),
            className: "hover:bg-red-500",
          },
          {
            icon: <RotateCcw className="text-yellow-500 group-hover:text-white" />,
            title: "Move to Queue",
            action: () => handleChangeState(REQUESTS_STATE.IN_QUEUE),
            className: "hover:bg-yellow-500",
          }
        )

        actions.push({
          icon: <Play className="text-blue-500 group-hover:text-white" />,
          title: "Start Progress",
          action: () => handleChangeState(REQUESTS_STATE.IN_PROGRESS),
          className: "hover:bg-blue-500",
        })
        return actions
      }

      case REQUESTS_STATE.IN_PROGRESS: {
        const actions: ActionButton[] = []

        actions.push({
          icon: <Check className="text-green-600 group-hover:text-white" />,
          title: "Finish",
          action: () => handleChangeState(REQUESTS_STATE.FINISHED),
          className: "hover:bg-green-600",
        })

        return actions
      }

      case REQUESTS_STATE.FINISHED: {
        const actions: ActionButton[] = []

        actions.push({
          icon: <Play className="text-blue-500 group-hover:text-white" />,
          title: "Back to Progress",
          action: () => handleChangeState(REQUESTS_STATE.IN_PROGRESS),
          className: "hover:bg-blue-500",
        })

        return actions
      }

      case REQUESTS_STATE.REVIEWED: {
        const actions: ActionButton[] = []

        actions.push({
          icon: <Check className="text-green-600 group-hover:text-white" />,
          title: "Finish",
          action: () => handleChangeState(REQUESTS_STATE.FINISHED),
          className: "hover:bg-green-600",
        })

        return actions
      }

      default:
        return []
    }
  }

  const currentActions = getActionsByState(request.state, role)

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

            <span
              onClick={() => handlePhoneCall(request.client.phone)}
              className="text-xs text-link cursor-pointer transition duration-300"
            >
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
            requestStateStyle[request.state] ||
            "bg-gray-100 text-gray-800"
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

          {currentActions.map((btn, idx) => (
            <Button
              key={`actions-${idx}`}
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