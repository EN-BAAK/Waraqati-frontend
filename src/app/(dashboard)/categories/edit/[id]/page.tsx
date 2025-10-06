"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Formik, Form, FormikHelpers } from "formik";
import InputField from "@/components/forms/InputField";
import SelectImageField from "@/components/forms/SelectImageField";
import SubmitButton from "@/components/forms/SubmitButton";
import BackgroundImage from "@/assets/background.png";
import { useAppContext } from "@/contexts/AppProvider";
import { useGetCategoryById, useGetCategoryImage, useUpdateCategory } from "@/hooks/useCategory";
import { APIResponse } from "@/types/hooks";
import { categoryEditValidationSchema } from "@/constants/formValidation";
import { CategoryCreation } from "@/types/global";
import LoadingPage from "@/components/LoadingPage";
import EmptyElement from "@/components/EmptyElement";
import { Button } from "@/components/ui/button";

const CategoryEditPage: React.FC = () => {
  const { pushToast } = useAppContext();
  const router = useRouter();
  const params = useParams();
  const categoryId = Number(params?.id);

  const [image, setImage] = useState<File | null | undefined>(undefined);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const { data: categoryData, isLoading } = useGetCategoryById(categoryId);
  const { data: imageData } = useGetCategoryImage(categoryId);

  const category = categoryData?.data;

  const { mutateAsync } = useUpdateCategory({
    onSuccess: (resp: APIResponse<unknown>) => {
      pushToast({ message: resp.message, type: "SUCCESS" });
      router.replace("/categories");
    },
    onError: (err: Error) => {
      pushToast({ message: err.message, type: "ERROR" });
    },
  });

  const handleGoBack = () => router.back()

  const imageChanged =
    (image === null && currentImage !== null) ||
    (image instanceof File);

  useEffect(() => {
    if (imageData && imageData instanceof Blob) {
      const url = URL.createObjectURL(imageData);
      setCurrentImage(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageData]);

  if (isLoading) {
    return <LoadingPage />
  }

  if (!category)
    return <EmptyElement
      msg="There is no category"
      action={<Button className="bg-main hover:bg-main-hover text-face transition duration-300 cursor-pointer" onClick={handleGoBack}>Go back</Button>} />

  const onSubmit = async (
    values: CategoryCreation,
    formik: FormikHelpers<CategoryCreation>,
    initialValues: CategoryCreation
  ) => {
    const { resetForm, setSubmitting } = formik;
    const formData = new FormData();

    if (values.title !== initialValues.title) {
      formData.append("title", values.title);
    }

    if (values.desc !== initialValues.desc) {
      formData.append("desc", values.desc || "");
    }

    if (image !== undefined) {
      if (image === null) {
        formData.append("image", "null");
      } else if (image instanceof File) {
        formData.append("image", image);
      }
    }

    await mutateAsync({ id: categoryId, data: formData });
    resetForm();
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-2">
      <div className="p-2 sm:p-4 md:p-8 flex items-center justify-center">
        <div className="bg-face w-full max-w-xl p-2 sm:p-4 md:p-8 rounded-2xl shadow-xl">
          <h1 className="mb-6 pb-4 border-b border-border text-center font-heading text-3xl text-main">
            Edit Category
          </h1>
          <p className="mb-6 text-center text-text-muted">
            Update the category details below.
          </p>

          <Formik
            onSubmit={(values, helpers) => onSubmit(values, helpers, category)}
            enableReinitialize
            initialValues={category}
            validationSchema={categoryEditValidationSchema}
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
                  value={image ?? undefined}
                  setValue={(file) => setImage(file ?? null)}
                  currentImage={currentImage}
                  label="Category Image"
                />

                <SubmitButton
                  isSubmitting={isSubmitting}
                  isDirty={dirty || imageChanged}
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
            Edit your category details to keep your service organization up to date.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditPage;
