'use client'

import DocumentCard from "./Document"
import { RequiredDoc } from "@/types/global"
import EmptyElement from "@/components/EmptyElement"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import LoadingPage from "@/components/LoadingPage"
import { useGetAllRequiredDocuments } from "@/hooks/useRequiredDocuments"

const RequiredDocumentsPage: React.FC = () => {
  const { data, isFetching } = useGetAllRequiredDocuments()
  const router = useRouter();

  const handleAdd = () => router.push("/dashboard/required-documents/add");

  return (
    <div className="bg-face max-h-full p-6 rounded-2xl shadow-sm overflow-hidden">
      <h1 className="mb-4 font-semibold text-2xl text-text">Required Documents</h1>

      <div className="h-[calc(100vh-180px)] min-w-full max-w-[calc(100vw-400px)] rounded-lg overflow-x-auto overflow-hidden">
        {
          isFetching
            ? <LoadingPage />
            : (!data?.data || !data.data.length)
              ? <EmptyElement
                msg="There are no required documents yet"
                action={
                  <Button
                    className="bg-main hover:bg-main-hover text-face"
                    onClick={handleAdd}
                  >
                    Add Document
                  </Button>
                }
              />
              : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto max-h-full">
                {
                  data.data.map((doc: RequiredDoc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))
                }
              </div>
        }
      </div>

      <Button
        onClick={handleAdd}
        className="bg-main hover:bg-main-hover py-1 px-4 rounded absolute bottom-5 right-5 cursor-pointer"
      >
        Add
      </Button>
    </div>
  )
}

export default RequiredDocumentsPage