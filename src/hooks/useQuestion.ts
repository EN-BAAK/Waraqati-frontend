import {
  getAllQuestions,
  getActivatedQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  activateQuestion,
  swapQuestions,
  getQuestionById,
} from "@/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APIResponse, MutationFnType, MutationProps } from "@/types/hooks";
import {
  GlobalQuestionCreation,
  CategoricQuestions,
  updateItemWithType,
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

export const useGetQuestionById = (id: number) => {
  return useQuery({
    queryKey: ["questions", id],
    queryFn: () => getQuestionById(id),
    refetchOnMount: "always",
    retry: false,
  })
}

export const useCreateQuestion = ({
  onSuccess,
  onError,
}: MutationProps<Awaited<MutationFnType>, Error, GlobalQuestionCreation>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestion,
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<APIResponse<CategoricQuestions[]>>(
        ["questions"],
        (oldData) => {
          if (!oldData) return oldData;

          const createdQuestion = data.data;
          const categoryName = createdQuestion.category ?? "";

          const updatedCategories = [...oldData.data];

          if (categoryName && categoryName.trim() !== "") {
            const existingCategory = updatedCategories.find(
              (c) => c.category === categoryName
            );

            if (existingCategory) {
              existingCategory.questions = [
                ...existingCategory.questions,
                createdQuestion,
              ];
            } else {
              updatedCategories.push({
                category: categoryName,
                questions: [createdQuestion],
              });
            }
          } else {
            const uncategorized = updatedCategories.find((c) => !c.category);
            if (uncategorized) {
              uncategorized.questions = [
                ...uncategorized.questions,
                createdQuestion,
              ];
            } else {
              updatedCategories.push({
                category: "",
                questions: [createdQuestion],
              });
            }
          }

          return { ...oldData, data: updatedCategories };
        }
      );

      onSuccess?.(data, variables, context);
    },
    onError,
  });
};

export const useUpdateQuestion = ({
  onSuccess,
  onError,
}: MutationProps<
  Awaited<MutationFnType>,
  Error,
  updateItemWithType<Partial<GlobalQuestionCreation>>
>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateQuestion,
    onSuccess: (data, variables, context) => {
      const updated = data.data;
      const newCategory = updated.category ?? "";

      queryClient.setQueryData<APIResponse<CategoricQuestions[]>>(
        ["questions"],
        (oldData) => {
          if (!oldData) return oldData;

          let updatedCategories = oldData.data.map((cat) => ({
            ...cat,
            questions: cat.questions.filter((q) => q.id !== updated.id),
          }));

          if (newCategory && newCategory.trim() !== "") {
            const existingCategory = updatedCategories.find(
              (c) => c.category === newCategory
            );

            if (existingCategory) {
              existingCategory.questions = [
                ...existingCategory.questions,
                updated,
              ].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            } else {
              updatedCategories.push({
                category: newCategory,
                questions: [updated],
              });
            }
          } else {
            const uncategorized = updatedCategories.find((c) => !c.category);
            if (uncategorized) {
              uncategorized.questions = [
                ...uncategorized.questions,
                updated,
              ].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            } else {
              updatedCategories.push({
                category: "",
                questions: [updated],
              });
            }
          }

          updatedCategories = updatedCategories.filter(
            (c) => c.questions.length > 0
          );

          return { ...oldData, data: updatedCategories };
        }
      );

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
      queryClient.setQueryData<APIResponse<CategoricQuestions[]>>(
        ["questions"],
        (oldData) => {
          if (!oldData) return oldData;

          const updatedCategories = oldData.data
            .map((cat) => ({
              ...cat,
              questions: cat.questions.filter((q) => q.id !== questionId),
            }))
            .filter((cat) => cat.questions.length > 0);

          return { ...oldData, data: updatedCategories };
        }
      );

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
}: MutationProps<
  Awaited<MutationFnType>,
  Error,
  { aQuestionId: number; bQuestionId: number }
>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ aQuestionId: a, bQuestionId: b }) => swapQuestions(a, b),
    onSuccess: (data, { aQuestionId: a, bQuestionId: b }, context) => {
      queryClient.setQueryData<APIResponse<CategoricQuestions[]>>(["questions"], (oldData) => {
        if (!oldData) return oldData;

        const updatedCategories = oldData.data.map((cat) => {
          const indexA = cat.questions.findIndex((q) => q.id === a);
          const indexB = cat.questions.findIndex((q) => q.id === b);

          if (indexA === -1 || indexB === -1) return cat;

          const newQuestions = [...cat.questions];
          const questionA = newQuestions[indexA];
          const questionB = newQuestions[indexB];

          const orderA = questionA.order;
          const orderB = questionB.order;

          newQuestions[indexA] = { ...questionB, order: orderA };
          newQuestions[indexB] = { ...questionA, order: orderB };

          return { ...cat, questions: newQuestions };
        });

        return { ...oldData, data: updatedCategories };
      });

      onSuccess?.(data, { aQuestionId: a, bQuestionId: b }, context);
    },
    onError,
  });
};
