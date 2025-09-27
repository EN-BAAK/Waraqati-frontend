"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Clock,
  DollarSign,
  FileText,
  HelpCircle,
  CheckSquare,
  List,
  Trash2,
  Pencil,
} from "lucide-react";
import EmptyElement from "@/components/EmptyElement";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoadingPage from "@/components/LoadingPage";
import { useDeleteServiceById, useGetServiceById } from "@/hooks/useService";
import { QUESTION_TYPE, RequiredDoc, ServiceQuestion } from "@/types/global";
import { APIResponse } from "@/types/hooks";
import { useAppContext } from "@/contexts/AppProvider";

const ServicePage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: service, isLoading, error } = useGetServiceById(Number(id));
  const { pushToast, showWarning } = useAppContext()

  const onDeleteSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
    router.replace(`/services`);
  }

  const onDeleteError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const { isPending: isDeletePending, mutateAsync: deleteMutation, } = useDeleteServiceById({ onSuccess: onDeleteSuccess, onError: onDeleteError })

  const handleGoBack = () => router.back();

  const handleEdit = () => {
    router.push(`/services/edit/${id}`);
  };

  const handleDelete = () => {
    showWarning({
      message: "Are you sure you want to delete this service?",
      btn1: "Cancel",
      btn2: "Delete",
      handleBtn2: () => deleteMutation(Number(id))
    })
  };

  if (isLoading) return <LoadingPage />;

  if (error || !service?.data)
    return (
      <EmptyElement
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
    );

  const serviceData = service.data;

  const getQuestionIcon = (type: QUESTION_TYPE) => {
    switch (type) {
      case QUESTION_TYPE.MultiChoice:
        return <CheckSquare className="w-4 h-4 text-main" />;
      case QUESTION_TYPE.Number:
        return <List className="w-4 h-4 text-main" />;
      default:
        return <FileText className="w-4 h-4 text-main" />;
    }
  };

  const getQuestionTypeBadge = (type: QUESTION_TYPE) => {
    const variants: Record<
      QUESTION_TYPE,
      { label: string; variant: "default" | "secondary" | "outline" }
    > = {
      [QUESTION_TYPE.Text]: { label: "Text", variant: "secondary" },
      [QUESTION_TYPE.MultiChoice]: { label: "Multiple Choice", variant: "default" },
      [QUESTION_TYPE.Number]: { label: "Number", variant: "outline" },
    };

    const { label, variant } = variants[type];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="bg-face m-0 p-3 sm:p-6 min-h-screen rounded-2xl shadow-sm overflow-auto">
      <div className="max-w-5xl m-auto p-0 flex flex-col gap-6 sm:gap-8">

        <div className="bg-face m-0 p-0 border border-border rounded-lg overflow-hidden">
          <div className="bg-back m-0 p-4 sm:p-6 flex justify-between items-center border-b border-border">
            <h2 className="m-0 p-0 text-left font-semibold text-xl text-text">
              {serviceData.title}
            </h2>
            <div className="m-0 p-0 flex items-center gap-2">
              <Button
                onClick={handleEdit}
                variant="ghost"
                size="icon"
                disabled={isDeletePending}
                className="bg-transparent m-0 p-2 flex justify-center items-center border-0 rounded-lg text-center font-medium text-sm text-text cursor-pointer transition duration-300 hover:bg-main/10"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="icon"
                disabled={isDeletePending}
                className="bg-transparent m-0 p-2 flex justify-center items-center border-0 rounded-lg text-center font-medium text-sm text-red-600 cursor-pointer transition duration-300 hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="m-0 p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
            <p className="m-0 p-0 text-left font-normal text-sm sm:text-base text-text-muted leading-relaxed">
              {serviceData.description}
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
                    {serviceData.duration}
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
                    ${serviceData.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-face m-0 p-0 border border-border rounded-lg overflow-hidden">
          <div className="bg-back m-0 p-4 sm:p-6 border-b border-border">
            <h3 className="m-0 p-0 text-left font-semibold text-lg text-text flex items-center gap-2">
              <FileText className="w-5 h-5 text-main" />
              Required Documents
            </h3>
          </div>

          <div className="m-0 p-4 sm:p-6 flex flex-col gap-2 sm:gap-3">
            {serviceData.requiredDocs?.map((doc: RequiredDoc) => (
              <div
                key={`required-docs-${doc.id}`}
                className="bg-back m-0 p-2 sm:p-3 flex items-center gap-3 border border-border rounded-lg"
              >
                <div className="bg-main w-2 h-2 m-0 p-0 rounded-full flex-shrink-0" />
                <span className="m-0 p-0 text-left font-medium text-sm sm:text-base text-text">
                  {doc.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-face m-0 p-0 border border-border rounded-lg overflow-hidden">
          <div className="bg-back m-0 p-4 sm:p-6 border-b border-border">
            <h3 className="m-0 p-0 text-left font-semibold text-lg text-text flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-main" />
              Application Questions
            </h3>
          </div>

          <div className="m-0 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
            {serviceData.questions?.map((question: ServiceQuestion, index: number) => (
              <div
                key={`question-${question.id}`}
                className="bg-transparent m-0 p-3 sm:p-4 border border-border rounded-lg"
              >
                <div className="m-0 p-0 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                  <div className="m-0 p-0 flex flex-1 items-start gap-3">
                    <div className="bg-main/10 m-0 mt-0.5 p-1.5 rounded-lg">
                      {getQuestionIcon(question.type)}
                    </div>
                    <div className="m-0 p-0 flex-1">
                      <p className="m-0 p-0 text-left font-medium text-sm sm:text-base text-text mb-1 sm:mb-2">
                        {index + 1}. {question.question}
                      </p>
                      {question.choices && (
                        <div className="m-0 p-0 flex flex-col gap-1 ml-4">
                          {question.choices.map((choice, choiceIndex) => (
                            <div
                              key={choiceIndex}
                              className="m-0 p-0 flex items-center gap-2 text-left font-normal text-xs sm:text-sm text-text-muted"
                            >
                              <div className="bg-text-muted w-1.5 h-1.5 m-0 p-0 rounded-full" />
                              <span>{choice}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="m-0 p-0">{getQuestionTypeBadge(question.type)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
