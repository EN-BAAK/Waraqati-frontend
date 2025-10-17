"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, FormikHelpers } from "formik";
import InputField from "@/components/forms/InputField";
import SubmitButton from "@/components/forms/SubmitButton";
import BackgroundImage from "@/assets/background.png";
import { useAppContext } from "@/contexts/AppProvider";
import { useCreateQuestion } from "@/hooks/useQuestion";
import { APIResponse } from "@/types/hooks";
import { GlobalQuestionCreation } from "@/types/global";
import { questionValidationSchema } from "@/constants/formValidation";
import { initialQuestion } from "@/constants/formValues";
import CheckboxField from "@/components/forms/CheckboxField";

const QuestionAddPage: React.FC = () => {
  const router = useRouter();
  const { pushToast } = useAppContext();

  const { mutateAsync } = useCreateQuestion({
    onSuccess: (resp: APIResponse<unknown>) => {
      pushToast({ message: resp.message, type: "SUCCESS" });
      router.replace("/questions");
    },
    onError: (err: Error) => {
      pushToast({ message: err.message, type: "ERROR" });
    },
  });

  const onSubmit = async (
    values: GlobalQuestionCreation,
    formik: FormikHelpers<GlobalQuestionCreation>
  ) => {
    await mutateAsync({
      question: values.question,
      answer: values.answer,
      isActive: values.isActive,
      order: values.order,
      categoryId: values.categoryId || undefined,
    });

    formik.resetForm();
    formik.setSubmitting(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-2">
      <div className="p-2 sm:p-4 md:p-8 flex items-center justify-center">
        <div className="bg-face w-full max-w-xl p-2 sm:p-4 md:p-8 rounded-2xl shadow-xl">
          <h1 className="mb-6 pb-4 border-b border-border text-center font-heading text-3xl text-main">
            Add Question
          </h1>
          <p className="mb-6 text-center text-text-muted">
            Create a new question by filling out the form below.
          </p>

          <Formik
            initialValues={initialQuestion}
            validationSchema={questionValidationSchema}
            onSubmit={onSubmit}
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

                <InputField
                  name="order"
                  type="number"
                  label="Order"
                  placeholder="Set question order"
                />

                <InputField
                  name="categoryId"
                  type="number"
                  label="Category ID (optional)"
                  placeholder="Enter category ID if applicable"
                />

                <CheckboxField
                  label="Active"
                  name="isActive"
                />

                <SubmitButton
                  isSubmitting={isSubmitting}
                  isDirty={dirty}
                  isValid={isValid}
                  label="Create Question"
                  submittingLabel="Creating..."
                  disabledLabel="Complete the form"
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
            Add and manage questions for your service categories with ease.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionAddPage;
