"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, FormikHelpers } from "formik";
import InputField from "@/components/forms/InputField";
import SelectImageField from "@/components/forms/SelectImageField";
import SubmitButton from "@/components/forms/SubmitButton";
import BackgroundImage from "@/assets/background.png";
import { useAppContext } from "@/contexts/AppProvider";
import { useCreateCategory } from "@/hooks/useCategory";
import { APIResponse } from "@/types/hooks";
import { categoryValidationSchema } from "@/constants/formValidation";
import { initialCategory } from "@/constants/formValues";
import { CategoryCreation } from "@/types/global";

const CategoryAddPage: React.FC = () => {
  const router = useRouter();
  const { pushToast } = useAppContext();
  const [image, setImage] = useState<File | undefined>(undefined);

  const { mutateAsync } = useCreateCategory({
    onSuccess: (resp: APIResponse<unknown>) => {
      pushToast({ message: resp.message, type: "SUCCESS" });
      router.replace("/categories");
    },
    onError: (err: Error) => {
      pushToast({ message: err.message, type: "ERROR" });
    },
  });

  const onSubmit = async (values: CategoryCreation, formik: FormikHelpers<CategoryCreation>) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("desc", values.desc);
    if (image) {
      formData.append("image", image);
    }

    await mutateAsync(formData);
    formik.resetForm();
    setImage(undefined);
    formik.setSubmitting(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-2">
      <div className="p-2 sm:p-4 md:p-8 flex items-center justify-center">
        <div className="bg-face w-full max-w-xl p-2 sm:p-4 md:p-8 rounded-2xl shadow-xl">
          <h1 className="mb-6 pb-4 border-b border-border text-center font-heading text-3xl text-main">
            Add Category
          </h1>
          <p className="mb-6 text-center text-text-muted">
            Create a new category by filling out the form below.
          </p>

          <Formik
            initialValues={initialCategory}
            validationSchema={categoryValidationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, dirty, isValid }) => (
              <Form className="space-y-6">
                <InputField
                  name="title"
                  type="text"
                  label="Category Title"
                  placeholder="Enter category title"
                />

                <InputField
                  name="desc"
                  type="text"
                  label="Description"
                  placeholder="Enter category description"
                />

                <SelectImageField
                  value={image}
                  setValue={setImage}
                  label="Category Image"
                />

                <SubmitButton
                  isSubmitting={isSubmitting}
                  isDirty={dirty}
                  isValid={isValid}
                  label="Create Category"
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
            Add and manage categories to organize your services better.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryAddPage;
