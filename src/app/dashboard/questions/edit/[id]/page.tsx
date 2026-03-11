"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Formik, Form, FormikHelpers } from "formik";
import InputField from "@/components/forms/InputField";
import SubmitButton from "@/components/forms/SubmitButton";
import BackgroundImage from "@/assets/background.png";
import CheckboxField from "@/components/forms/CheckboxField";
import SelectorField from "@/components/forms/SelectorField";
import { useAppContext } from "@/contexts/AppProvider";
import { useGetQuestionById, useUpdateQuestion, } from "@/hooks/useQuestion";
import { useGetAllCategoriesIdentities } from "@/hooks/useCategory";
import { APIResponse } from "@/types/hooks";
import { questionEditValidationSchema } from "@/constants/formValidation";
import LoadingPage from "@/components/LoadingPage";
import EmptyElement from "@/components/EmptyElement";
import { Button } from "@/components/ui/button";
import { Category, GlobalQuestionCreation } from "@/types/global";

const QuestionEditPage: React.FC = () => {
  const { pushToast } = useAppContext();
  const router = useRouter();
  const params = useParams();
  const questionId = Number(params?.id);

  const { data: questionData, isLoading } = useGetQuestionById(questionId);
  const { data: categoriesData } = useGetAllCategoriesIdentities();

  const { mutateAsync } = useUpdateQuestion({
    onSuccess: (resp: APIResponse<unknown>) => {
      pushToast({ message: resp.message, type: "SUCCESS" });
      router.replace("/questions");
    },
    onError: (err: Error) =>
      pushToast({ message: err.message, type: "ERROR" }),
  });

  const handleGoBack = () => router.back();

  const question = questionData?.data;

  const categoryOptions =
    categoriesData?.data?.map((cat: Omit<Category, "desc">) => ({
      key: cat.title,
      value: cat.id,
    })) || [];

  if (isLoading) return <LoadingPage />;

  if (!question)
    return (
      <EmptyElement
        msg="There is no question"
        action={
          <Button
            onClick={handleGoBack}
            className="bg-main hover:bg-main-hover text-face transition duration-300 cursor-pointer"
          >
            Go back
          </Button>
        }
      />
    );

  const onSubmit = async (
    values: GlobalQuestionCreation,
    formik: FormikHelpers<GlobalQuestionCreation>,
    initialValues: GlobalQuestionCreation
  ) => {
    const { resetForm, setSubmitting } = formik;
    const formData: Partial<GlobalQuestionCreation> = { answer: undefined, categoryId: undefined, isActive: undefined, question: undefined }

    if (values.question !== initialValues.question) {
      formData.question = values.question
    }

    if (values.answer !== initialValues.answer) {
      formData.answer = values.answer
    }

    if (values.isActive !== initialValues.isActive) {
      formData.isActive = values.isActive
    }

    if (values.categoryId !== initialValues.categoryId)
      formData.categoryId = values.categoryId || -1

    await mutateAsync({ id: questionId, data: formData });
    resetForm();
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-2">
      <div className="p-2 sm:p-4 md:p-8 flex items-center justify-center">
        <div className="bg-face w-full max-w-xl p-2 sm:p-4 md:p-8 rounded-2xl shadow-xl">
          <h1 className="mb-6 pb-4 border-b border-border text-center font-heading text-3xl text-main">
            Edit Question
          </h1>
          <p className="mb-6 text-center text-text-muted">
            Update the question details below.
          </p>

          <Formik
            onSubmit={(values, helpers) =>
              onSubmit(values, helpers, question)
            }
            enableReinitialize
            initialValues={question}
            validationSchema={questionEditValidationSchema}
          >
            {({ isSubmitting, dirty, isValid }) => (
              <Form className="space-y-6">
                <InputField
                  name="question"
                  type="text"
                  label="Question"
                  placeholder="Enter your question"
                />

                <InputField
                  name="answer"
                  type="text"
                  label="Answer"
                  placeholder="Enter the answer"
                />

                <SelectorField
                  name="categoryId"
                  label="Category"
                  options={categoryOptions}
                  inputClasses="bg-white"
                  styles="w-full"
                />

                <CheckboxField label="Active" name="isActive" innerDivStyle="cursor-pointer" labelStyle="cursor-pointer" />

                <SubmitButton
                  isSubmitting={isSubmitting}
                  isDirty={dirty}
                  isValid={isValid}
                  label="Save Changes"
                  submittingLabel="Saving..."
                  disabledLabel="No changes made"
                  className="bg-main hover:bg-main-hover w-full py-3 px-4 rounded-lg shadow-md font-medium text-white transition-all"
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <div
        className="bg-no-repeat bg-center bg-cover p-10 hidden xl:flex flex-col justify-center items-center rounded relative text-white overflow-hidden"
        style={{ backgroundImage: `url(${BackgroundImage.src})` }}
      >
        <div className="bg-gradient-to-br from-main/80 via-main/60 to-main/80 absolute inset-0"></div>

        <div className="max-w-md relative z-10 text-center">
          <h2 className="mb-6 font-heading font-extrabold text-5xl text-face drop-shadow-lg">
            Waraqati
          </h2>
          <div className="bg-main h-1 w-16 mb-6 mx-auto rounded-full"></div>
          <p className="text-lg text-face/90 leading-relaxed">
            Edit your questions to keep your service content updated.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditPage;