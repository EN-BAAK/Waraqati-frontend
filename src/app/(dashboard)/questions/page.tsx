"use client"

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { useGetAllQuestions, useSwapQuestions } from '@/hooks/useQuestion';
import { useAppContext } from '@/contexts/AppProvider';
import { CategoricQuestions, GlobalQuestion } from '@/types/global';
import { APIResponse } from '@/types/hooks';
import LoadingPage from '@/components/LoadingPage';
import EmptyElement from '@/components/EmptyElement';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function QuestionsPage() {
  const [draggedQuestion, setDraggedQuestion] = useState<GlobalQuestion | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);

  const { data, isFetching } = useGetAllQuestions();
  const { pushToast } = useAppContext();
  const router = useRouter()

  const handleAddQuestion = () => router.push("/questions/add");

  const handleSwap = (questionId: number, targetId: number) => {
    if (questionId === targetId) return;
    swapQuestions({ a: questionId, b: targetId });
  };

  const handleDragStart = (question: GlobalQuestion, category: string) => {
    setDraggedQuestion(question);
    setDraggedCategory(category);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetQuestion: GlobalQuestion, targetCategory: string) => {
    if (!draggedQuestion || draggedCategory !== targetCategory) {
      setDraggedQuestion(null);
      setDraggedCategory(null);
      return;
    }

    handleSwap(draggedQuestion.id, targetQuestion.id);
    setDraggedQuestion(null);
    setDraggedCategory(null);
  };

  const moveQuestion = (category: CategoricQuestions, questionId: number, direction: 'up' | 'down') => {
    const currentIndex = category.questions.findIndex((q) => q.id === questionId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= category.questions.length) return;

    handleSwap(category.questions[currentIndex].id, category.questions[targetIndex].id);
  };

  const onSwapSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
  }

  const onSwapError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const { mutate: swapQuestions, isPending } = useSwapQuestions({ onSuccess: onSwapSuccess, onError: onSwapError });

  return (
    <div className="bg-face max-h-full p-6 rounded-2xl shadow-sm overflow-hidden">
      <h1 className="mb-2 font-semibold text-2xl text-text">Questions</h1>

      <div className="h-[calc(100vh-180px)] min-w-full max-w-[calc(100vw-400px)] rounded-lg overflow-x-auto overflow-hidden">
        {
          isFetching
            ? <LoadingPage />
            : (!data?.data || !data.data.length)
              ? <EmptyElement
                msg="There are no clients yet"
                action={
                  <Button
                    className="bg-main p-2 rounded-md shadow-sm text-face cursor-pointer transition duration-300 hover:bg-main-hover"
                    onClick={handleAddQuestion}
                  >
                    Add Question
                  </Button>
                }
              />
              : <React.Fragment>
                {
                  data.data.map((category: CategoricQuestions) => (
                    <div
                      key={category.category}
                      className="bg-face border border-border rounded-lg shadow-sm overflow-hidden"
                    >
                      <div className="bg-main px-6 py-4">
                        <h2 className="font-heading font-semibold text-xl text-white">
                          {category.category}
                        </h2>
                        <p className="mt-1 text-sm text-white opacity-90">
                          {category.questions.length} question{category.questions.length !== 1 ? 's' : ''}
                        </p>
                      </div>

                      <div className="p-6">
                        {category.questions.length === 0 ? (
                          <p className="py-8 text-center text-text-muted">No questions in this category</p>
                        ) : (
                          <div className="space-y-3">
                            {category.questions
                              .sort((a, b) => a.order - b.order)
                              .map((question, index) => (
                                <div
                                  key={question.id}
                                  draggable={!isPending}
                                  onDragStart={() => handleDragStart(question, category.category)}
                                  onDragOver={handleDragOver}
                                  onDrop={() => handleDrop(question, category.category)}
                                  className={`bg-back border border-border rounded-lg p-4 transition-all ${draggedQuestion?.id === question.id
                                    ? 'opacity-50'
                                    : 'hover:border-main'
                                    } ${isPending ? 'cursor-wait' : 'cursor-move'}`}
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0">
                                      <GripVertical className="h-5 w-5 text-text-muted" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="mb-2 flex items-start justify-between gap-4">
                                        <h3 className="font-body font-semibold text-text">
                                          {question.question}
                                        </h3>
                                        <div className="flex flex-shrink-0 items-center gap-2">
                                          <span
                                            className={`rounded px-2 py-1 text-xs font-medium ${question.isActive
                                              ? 'bg-green-100 text-green-800'
                                              : 'bg-gray-100 text-gray-800'
                                              }`}
                                          >
                                            {question.isActive ? 'Active' : 'Inactive'}
                                          </span>
                                          <span className="rounded bg-border px-2 py-1 text-xs font-medium text-text-muted">
                                            Order: {question.order}
                                          </span>
                                        </div>
                                      </div>

                                      <p className="mb-3 text-sm text-text-muted">{question.answer}</p>

                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => moveQuestion(category, question.id, 'up')}
                                          disabled={index === 0 || isPending}
                                          className="p-1 rounded hover:bg-border disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                          title="Move up"
                                        >
                                          <ChevronUp className="h-4 w-4 text-text-muted" />
                                        </button>
                                        <button
                                          onClick={() => moveQuestion(category, question.id, 'down')}
                                          disabled={index === category.questions.length - 1 || isPending}
                                          className="p-1 rounded hover:bg-border disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                          title="Move down"
                                        >
                                          <ChevronDown className="h-4 w-4 text-text-muted" />
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
                  ))
                }
              </React.Fragment>}
      </div>
    </div>

  );
}
