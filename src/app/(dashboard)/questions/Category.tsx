"use client";

import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppProvider";
import {
  useSwapQuestions,
  useDeleteQuestion,
  useActivateQuestion,
} from "@/hooks/useQuestion";
import { CategoricalQuestionsComponentProps } from "@/types/components";
import { CategoricQuestions, GlobalQuestion } from "@/types/global";
import { APIResponse } from "@/types/hooks";
import { cn } from "@/lib/utils";

const Category: React.FC<CategoricalQuestionsComponentProps> = ({ category }) => {
  const [draggedQuestion, setDraggedQuestion] = useState<GlobalQuestion | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<string | undefined>(undefined);

  const { pushToast, showWarning } = useAppContext();
  const router = useRouter();

  const { mutate: swapQuestions, isPending: isSwapping } = useSwapQuestions({
    onSuccess: (data: APIResponse<unknown>) =>
      pushToast({ message: data.message, type: "SUCCESS" }),
    onError: (err: Error) => pushToast({ message: err.message, type: "ERROR" }),
  });

  const { mutateAsync: deleteQuestion, isPending: isDeleting } = useDeleteQuestion({
    onSuccess: (data: APIResponse<unknown>) =>
      pushToast({ message: data.message, type: "SUCCESS" }),
    onError: (err: Error) => pushToast({ message: err.message, type: "ERROR" }),
  });

  const { mutateAsync: toggleActive, isPending: isActivating } = useActivateQuestion({
    onSuccess: (data: APIResponse<unknown>) =>
      pushToast({ message: data.message, type: "SUCCESS" }),
    onError: (err: Error) => pushToast({ message: err.message, type: "ERROR" }),
  });

  const handleSwap = (questionId: number, targetId: number) => {
    if (questionId === targetId) return;
    swapQuestions({ aQuestionId: questionId, bQuestionId: targetId });
  };

  const handleDragStart = (question: GlobalQuestion, category?: string) => {
    setDraggedQuestion(question);
    setDraggedCategory(category);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (targetQuestion: GlobalQuestion, targetCategory?: string) => {
    if (!draggedQuestion || draggedCategory !== targetCategory) {
      setDraggedQuestion(null);
      setDraggedCategory(undefined);
      return;
    }

    if (targetQuestion === draggedQuestion) {
      setDraggedQuestion(null);
      setDraggedCategory(undefined);
      return;
    }

    handleSwap(draggedQuestion.id, targetQuestion.id);
    setDraggedQuestion(null);
    setDraggedCategory(undefined);
  };

  const moveQuestion = (
    category: CategoricQuestions,
    questionId: number,
    direction: "up" | "down"
  ) => {
    const currentIndex = category.questions.findIndex((q) => q.id === questionId);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= category.questions.length) return;

    handleSwap(category.questions[currentIndex].id, category.questions[targetIndex].id);
  };

  const handleEdit = (id: number) => router.push(`/questions/edit/${id}`);

  const handleDelete = (id: number) => {
    showWarning({
      message: 'Are you sure you want to delete this question?',
      btn1: 'Cancel',
      btn2: 'Delete',
      handleBtn2: () => deleteQuestion(id),
    });
  };

  const handleToggleActive = (id: number) => {
    toggleActive(id);
  };

  const isPending = isSwapping || isDeleting || isActivating;

  return (
    <div className="bg-face mb-2 border border-border rounded-lg shadow-sm overflow-hidden">
      {category.category && (
        <div className="bg-main px-4 sm:px-6 py-4">
          <h2 className="font-heading text-lg sm:text-xl font-semibold text-white">
            {category.category}
          </h2>
          <p className="mt-1 text-sm text-white opacity-90">
            {category.questions.length} question
            {category.questions.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      <div className="p-3 sm:p-6">
        {category.questions.length > 0 && (
          <div className="space-y-3">
            {category.questions.map((question, index) => (
              <div
                key={question.id}
                draggable={!isPending}
                onDragStart={() => handleDragStart(question, category.category)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(question, category.category)}
                className={cn(
                  "bg-back p-3 sm:p-4 border border-border rounded-lg transition-all duration-300",
                  draggedQuestion?.id === question.id
                    ? "opacity-50 scale-95"
                    : "hover:border-main hover:shadow-md",
                  isPending ? "cursor-wait" : "cursor-move"
                )}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <GripVertical className="h-5 w-5 text-text-muted transition-colors duration-300 hover:text-main" />
                    </div>

                    <h3 className="flex-1 min-w-0 break-words font-body leading-snug text-sm sm:text-base text-text font-semibold">
                      {question.question}
                    </h3>

                    <span className="flex-shrink-0 bg-border px-2 py-1 rounded-md text-xs font-medium text-text-muted whitespace-nowrap">
                      #{question.order}
                    </span>
                  </div>

                  <p className="pl-7 sm:pl-8 text-text-muted text-xs sm:text-sm leading-relaxed">
                    {question.answer}
                  </p>

                  <div className="pl-7 sm:pl-8 pt-2 border-t border-border flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleActive(question.id)}
                      disabled={isPending}
                      className={cn(
                        "px-2 sm:px-3 py-1 flex-shrink-0 rounded-md text-xs font-medium transition-all duration-300 transform cursor-pointer",
                        question.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-200 hover:scale-105"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105"
                      )}
                      title={
                        question.isActive
                          ? "Click to deactivate"
                          : "Click to activate"
                      }
                    >
                      {question.isActive ? "Active" : "Inactive"}
                    </button>

                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => moveQuestion(category, question.id, "up")}
                        disabled={index === 0 || isPending}
                        className="p-1.5 sm:p-1.5 bg-border rounded-md transition-all duration-300 cursor-pointer hover:bg-main hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>

                      <button
                        onClick={() => moveQuestion(category, question.id, "down")}
                        disabled={index === category.questions.length - 1 || isPending}
                        className="p-1.5 sm:p-1.5 bg-border rounded-md transition-all duration-300 cursor-pointer hover:bg-main hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>

                      <button
                        onClick={() => handleEdit(question.id)}
                        disabled={isPending}
                        className="p-1.5 sm:p-1.5 bg-border rounded-md transition-all duration-300 cursor-pointer hover:bg-orange-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Edit question"
                      >
                        <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(question.id)}
                        disabled={isPending}
                        className="p-1.5 sm:p-1.5 bg-border rounded-md transition-all duration-300 cursor-pointer hover:bg-red-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete question"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
