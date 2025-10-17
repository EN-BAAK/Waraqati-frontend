import {
  getAllQuestions,
  getActivatedQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  activateQuestion,
  swapQuestions,
} from "@/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APIResponse, MutationFnType, MutationProps } from "@/types/hooks";
import {
  GlobalQuestion,
  GlobalQuestionCreation,
  CategoricQuestions,
  updateItemWithFormData,
} from "@/types/global";

export const useGetAllQuestions = () =>
  useQuery({
    queryKey: ["questions"],
    queryFn: getAllQuestions,
    retry: false,
  });

export const useGetActivatedQuestions = () =>
  useQuery({
    queryKey: ["questions-active"],
    queryFn: getActivatedQuestions,
    retry: false,
  });

export const useCreateQuestion = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, GlobalQuestionCreation>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestion,
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<APIResponse<CategoricQuestions[]>>(["questions"], (oldData) => {
        if (!oldData) return oldData;

        const createdQuestion = data.data as GlobalQuestion;
        const categoryName = data.category ?? null;

        const updatedCategories = [...oldData.data];

        if (categoryName) {
          const existingCategory = updatedCategories.find(
            (c) => c.category === categoryName
          );
          if (existingCategory) {
            existingCategory.questions = [createdQuestion, ...existingCategory.questions];
          } else {
            updatedCategories.unshift({
              category: categoryName,
              questions: [createdQuestion],
            });
          }
        } else {
          const uncategorized = updatedCategories.find((c) => !c.category);
          if (uncategorized) {
            uncategorized.questions = [createdQuestion, ...uncategorized.questions];
          } else {
            updatedCategories.unshift({ category: "", questions: [createdQuestion] });
          }
        }

        return { ...oldData, data: updatedCategories };
      });

      onSuccess?.(data, variables, context);
    },
    onError,
  });
};

export const useUpdateQuestion = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, updateItemWithFormData>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateQuestion,
    onSuccess: (data, variables, context) => {
      const updated = data.data as GlobalQuestion;
      const newCategory = data.category ?? null;

      queryClient.setQueryData<APIResponse<CategoricQuestions[]>>(["questions"], (oldData) => {
        if (!oldData) return oldData;

        let updatedCategories = oldData.data.map((cat) => ({
          ...cat,
          questions: cat.questions.filter((q) => q.id !== updated.id),
        }));

        if (newCategory) {
          const existingCategory = updatedCategories.find(
            (c) => c.category === newCategory
          );
          if (existingCategory) {
            existingCategory.questions = [updated, ...existingCategory.questions];
          } else {
            updatedCategories.unshift({
              category: newCategory,
              questions: [updated],
            });
          }
        } else {
          const uncategorized = updatedCategories.find((c) => !c.category);
          if (uncategorized) {
            uncategorized.questions = [updated, ...uncategorized.questions];
          } else {
            updatedCategories.unshift({ category: "", questions: [updated] });
          }
        }

        updatedCategories = updatedCategories.filter(
          (c) => c.questions.length > 0
        );

        return { ...oldData, data: updatedCategories };
      });

      onSuccess?.(data, variables, context);
    },
    onError,
  });
};


export const useDeleteQuestion = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, number>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuestion,
    onSuccess: (data, questionId, context) => {
      queryClient.setQueryData<APIResponse<CategoricQuestions[]>>(["questions"], (oldData) => {
        if (!oldData) return oldData;

        const updatedCategories = oldData.data
          .map((cat) => ({
            ...cat,
            questions: cat.questions.filter((q) => q.id !== questionId),
          }))
          .filter((cat) => cat.questions.length > 0);

        return { ...oldData, data: updatedCategories };
      });

      onSuccess?.(data, questionId, context);
    },
    onError,
  });
};

export const useActivateQuestion = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, number>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateQuestion,
    onSuccess: (data, questionId, context) => {
      queryClient.setQueryData<APIResponse<CategoricQuestions[]>>(["questions"], (oldData) => {
        if (!oldData) return oldData;

        const updatedCategories = oldData.data.map((cat) => ({
          ...cat,
          questions: cat.questions.map((q) =>
            q.id === questionId ? { ...q, isActive: !q.isActive } : q
          ),
        }));

        return { ...oldData, data: updatedCategories };
      });

      onSuccess?.(data, questionId, context);
    },
    onError,
  });
};

export const useSwapQuestions = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, { a: number; b: number }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ a, b }) => swapQuestions(a, b),
    onSuccess: (data, { a, b }, context) => {
      queryClient.setQueryData<APIResponse<CategoricQuestions[]>>(["questions"], (oldData) => {
        if (!oldData) return oldData;

        const updatedCategories = oldData.data.map((cat) => {
          const indexA = cat.questions.findIndex((q) => q.id === a);
          const indexB = cat.questions.findIndex((q) => q.id === b);

          if (indexA === -1 || indexB === -1) return cat;

          const newQuestions = [...cat.questions];
          const temp = newQuestions[indexA];

          newQuestions[indexA] = { ...newQuestions[indexB], order: temp.order };
          newQuestions[indexB] = { ...temp, order: newQuestions[indexA].order };

          return { ...cat, questions: newQuestions };
        });

        return { ...oldData, data: updatedCategories };
      });

      onSuccess?.(data, { a, b }, context);
    },
    onError,
  });
};