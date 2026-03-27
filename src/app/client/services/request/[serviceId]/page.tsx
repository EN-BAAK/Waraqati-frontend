"use client"

import React, { useMemo } from "react"
import { Formik, Form, FieldArray, FormikHelpers } from "formik"
import { useParams, useRouter } from "next/navigation"
import InputField from "@/components/forms/InputField"
import SelectorField from "@/components/forms/SelectorField"
import SubmitButton from "@/components/forms/SubmitButton"
import { useGetCategoricServiceById } from "@/hooks/useService"
import { useAppContext } from "@/contexts/AppProvider"
import { ClientDocument, DocumentType, QUESTION_TYPE, RequestCreation, RequiredDoc, ServiceQuestion } from "@/types/global"
import { APIResponse } from "@/types/hooks"
import { requestCreationValidationSchema } from "@/constants/formValidation"
import { useCreateRequest } from "@/hooks/useRequests"
import LoadingPage from "@/components/LoadingPage"
import EmptyElement from "@/components/EmptyElement"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, List } from "lucide-react"
import SelectDocumentField from "@/components/forms/SelectDocumentField"
import { useGetAllClientDocuments } from "@/hooks/useClientDocument"

const RequestServicePage: React.FC = () => {
  const { serviceId } = useParams()
  const router = useRouter()
  const { pushToast } = useAppContext()

  const { data: serviceData, isLoading: isCategoricServiceLoading, isError: isCategoricServiceError } = useGetCategoricServiceById(Number(serviceId))
  const { data: DocumentData, isLoading: isDocumentLoading } = useGetAllClientDocuments()

  const documents = DocumentData?.data || []
  const service = serviceData?.data

  const uploadedIds = new Set(documents.map((doc: ClientDocument) => doc.id));
  const requiredDocs = (service?.requiredDocs || []).filter((doc: ClientDocument) => !uploadedIds.has(doc.id));

  const isLoading = isCategoricServiceLoading || isDocumentLoading

  const onSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
    router.replace("/client/services")
  }

  const onError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const { mutateAsync } = useCreateRequest({ onSuccess, onError })

  const initialValues: RequestCreation = useMemo(() => {
    if (!service) {
      return { questions: [], documents: [] }
    }

    return {
      questions: service.questions.map((q: ServiceQuestion) => ({
        questionId: q.id,
        answer: "",
      })),
      documents: requiredDocs.map((doc: RequiredDoc) => ({
        documentId: doc.id,
        file: null,
      })),
    }
  }, [service, requiredDocs])

  const handleGoBack = () => router.back();

  const onSubmit = async (
    values: RequestCreation,
    formik: FormikHelpers<RequestCreation>
  ) => {
    const formData = new FormData();

    values.questions.forEach((q, index) => {
      formData.append(`questions[${index}].id`, String(q.questionId));
      formData.append(`questions[${index}].answer`, q.answer);
    });

    const documentsPayload = values.documents.map((doc) => ({
      documentId: doc.documentId,
    }));

    formData.append("documents", JSON.stringify(documentsPayload));

    values.documents.forEach((doc) => {
      if (doc.file) {
        formData.append("documentsFiles", doc.file);
      }
    });
    await mutateAsync({ serviceId: Number(serviceId), data: formData });

    formik.setSubmitting(false);
  };

  if (isLoading) return <LoadingPage />
  if (isCategoricServiceError || !service) return <EmptyElement
    msg="Service not found"
    action={
      <Button
        className="bg-main m-0 p-2 sm:p-3 flex justify-center items-center border-0 rounded-lg text-center font-medium text-base text-face hover:bg-main-hover"
        onClick={handleGoBack}
      >
        Go back
      </Button>
    }
  />

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-face space-y-8 w-full max-w-3xl p-6 md:p-10 rounded-2xl shadow-xl">

        <div>
          <h2 className="m-0 p-0 text-left font-semibold text-xl text-text">
            {service.title}
          </h2>

          <div className="m-0 flex flex-col gap-4 sm:gap-6">
            <p className="m-0 p-0 text-left font-normal text-sm sm:text-base text-text-muted leading-relaxed">
              {service.description}
            </p>

            <div className="m-0 p-0 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-transparent m-0 p-0 flex items-center gap-3">
                <div className="bg-main/10 m-0 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-main" />
                </div>
                <div className="m-0 p-0">
                  <p className="m-0 p-0 text-left font-medium text-xs sm:text-sm text-text-muted">
                    Processing Time
                  </p>
                  <p className="m-0 p-0 text-left font-semibold text-base sm:text-lg text-text">
                    {service.duration}
                  </p>
                </div>
              </div>

              <div className="bg-transparent m-0 p-0 flex items-center gap-3">
                <div className="bg-main/10 m-0 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-main" />
                </div>
                <div className="m-0 p-0">
                  <p className="m-0 p-0 text-left font-medium text-xs sm:text-sm text-text-muted">
                    Service Fee
                  </p>
                  <p className="m-0 p-0 text-left font-semibold text-base sm:text-lg text-text">
                    ${service.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {service.category && (
                <div className="bg-transparent m-0 p-0 flex items-center gap-3">
                  <div className="bg-main/10 m-0 p-2 rounded-lg">
                    <List className="w-5 h-5 text-main" />
                  </div>
                  <div className="m-0 p-0">
                    <p className="m-0 p-0 text-left font-medium text-xs sm:text-sm text-text-muted">
                      Category
                    </p>
                    <p className="m-0 p-0 text-left font-semibold text-base sm:text-lg text-text">
                      {service.category}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={requestCreationValidationSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, isSubmitting, dirty, isValid }) => (
            <Form className="space-y-8">
              {
                service.questions.length > 0 && <div>
                  <h2 className="font-semibold text-lg mb-4">Questions</h2>

                  <FieldArray name="questions">
                    {() => (
                      <div className="space-y-6">

                        {service.questions.map((q: ServiceQuestion, index: number) => {
                          const fieldName = `questions.${index}.answer`

                          if (q.type === QUESTION_TYPE.MultiChoice) {
                            return (
                              <SelectorField
                                key={`question-${q.id}`}
                                name={fieldName}
                                label={q.question}
                                options={q.choices!.map((c: string) => ({
                                  key: c,
                                  value: c,
                                }))}
                              />
                            )
                          }

                          return (
                            <InputField
                              key={`question-${q.id}`}
                              name={fieldName}
                              type={
                                q.type === QUESTION_TYPE.Number
                                  ? "number"
                                  : "text"
                              }
                              label={q.question}
                              placeholder="Enter your answer"
                            />
                          )
                        })}

                      </div>
                    )}
                  </FieldArray>
                </div>
              }

              {
                requiredDocs.length > 0 && <div>
                  <h2 className="font-semibold text-lg mb-4">
                    Required Documents
                  </h2>

                  <FieldArray name="documents">
                    {() => (
                      <div className="space-y-6">

                        {requiredDocs.map(
                          (doc: RequiredDoc, index: number) => (
                            <SelectDocumentField
                              key={`document-${doc.id}`}
                              acceptTypes={[DocumentType.IMAGE, DocumentType.PDF]}
                              value={values.documents[index]?.file ?? undefined}
                              setValue={(file) =>
                                setFieldValue(
                                  `documents.${index}.file`,
                                  file ?? null
                                )
                              }
                              label={doc.label}
                            />
                          )
                        )}
                      </div>
                    )}
                  </FieldArray>
                </div>
              }

              <SubmitButton
                isSubmitting={isSubmitting}
                isDirty={dirty}
                isValid={isValid}
                label="Submit Request"
                submittingLabel="Submitting..."
                disabledLabel="Complete the form"
                className="bg-main hover:bg-main-hover w-full py-3 px-4 rounded-lg shadow-md font-medium text-white transition-all"
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default RequestServicePage