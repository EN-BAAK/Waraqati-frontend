import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { useAppContext } from "@/contexts/AppProvider"
import { useCreateRequest } from "@/hooks/useRequests"
import { formatBalance } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import { ServiceRowProps } from "@/types/components"
import { APIResponse } from "@/types/hooks"
import { Clock } from "lucide-react"
import React from "react"

const Service: React.FC<ServiceRowProps> = ({ service }) => {
  const { pushToast } = useAppContext()

  const onSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
  }
  const onError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const { mutateAsync, isPending } = useCreateRequest({ onSuccess, onError })

  const handleCreateRequest = async () => {
    return await mutateAsync(service.id)
  }

  return (
    <Card
      className={cn(
        "bg-face flex flex-col border border-border rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-heading font-semibold text-text text-base">
              {service.title}
            </h3>

            <span className="text-text-muted text-xs">
              {service.category}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1">
        <p className="text-text-muted text-sm line-clamp-2">
          {service.description}
        </p>

        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center flex-1 gap-1 text-text-muted">
            <Clock className="w-4 h-4" />
            {service.duration}
          </div>

          <div className="font-semibold text-green-600">
            {formatBalance(service.price)}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button disabled={isPending} onClick={handleCreateRequest} className="bg-main hover:bg-main-hover cursor-pointer">Request</Button>
      </CardFooter>
    </Card>
  )
}

export default Service