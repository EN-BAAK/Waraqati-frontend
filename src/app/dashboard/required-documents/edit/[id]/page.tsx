"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Formik, Form, FormikHelpers } from "formik";
import InputField from "@/components/forms/InputField";
import SubmitButton from "@/components/forms/SubmitButton";
import BackgroundImage from "@/assets/background.png";
import { useAppContext } from "@/contexts/AppProvider";
import { APIResponse } from "@/types/hooks";
import LoadingPage from "@/components/LoadingPage";
import EmptyElement from "@/components/EmptyElement";
import { Button } from "@/components/ui/button";
import { useGetRequiredDocumentById, useUpdateRequiredDoc } from "@/hooks/useRequiredDocuments";
import { RequiredDocCreation } from "@/types/global";
import { requiredDocCreationValidationSchema } from "@/constants/formValidation";

const RequiredDocumentEditPage: React.FC = () => {
  const { pushToast } = useAppContext();
  const router = useRouter();
  const params = useParams();
  const docId = Number(params?.id);

  const { data, isLoading } = useGetRequiredDocumentById(docId);
  const document = data?.data;

  const onSuccess = (resp: APIResponse<unknown>) => {
    pushToast({ message: resp.message, type: "SUCCESS" });
    router.replace("/dashboard/required-documents");
  }
  const onError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" });
  }

  const { mutateAsync } = useUpdateRequiredDoc({ onSuccess, onError });

  const handleGoBack = () => router.back();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!document)
    return (
      <EmptyElement
        msg="There is no required document"
        action={
          <Button
            className="bg-main hover:bg-main-hover text-face transition duration-300 cursor-pointer"
            onClick={handleGoBack}
          >
            Go back
          </Button>
        }
      />
    );

  const onSubmit = async (values: RequiredDocCreation, formik: FormikHelpers<RequiredDocCreation>,) => {
    const { resetForm, setSubmitting } = formik;
    await mutateAsync({ id: docId, data: values });

    resetForm();
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-2">
      <div className="p-2 sm:p-4 md:p-8 flex items-center justify-center">
        <div className="bg-face w-full max-w-xl p-2 sm:p-4 md:p-8 rounded-2xl shadow-xl">
          <h1 className="mb-6 pb-4 border-b border-border text-center font-heading text-3xl text-main">
            Edit Required Document
          </h1>
          <p className="mb-6 text-center text-text-muted">
            Update the document details below.
          </p>

          <Formik
            onSubmit={(values, helpers) => onSubmit(values, helpers)}
            enableReinitialize
            initialValues={document}
            validationSchema={requiredDocCreationValidationSchema}
          >
            {({ isSubmitting, dirty, isValid }) => (
              <Form className="space-y-6">
                <InputField
                  name="label"
                  type="text"
                  label="Document Label"
                  placeholder="Enter document label"
                />

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
          <p className="leading-relaxed text-lg text-face/90">
            Edit required document details to keep your workflow accurate and up to date.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequiredDocumentEditPage;