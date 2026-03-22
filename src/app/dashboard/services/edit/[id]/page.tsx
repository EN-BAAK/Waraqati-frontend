"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Formik, Form, FieldArray, FormikHelpers } from "formik";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import BackgroundImage from "@/assets/background.png";
import { useAppContext } from "@/contexts/AppProvider";
import LoadingPage from "@/components/LoadingPage";
import { Service, ServiceCreation, QUESTION_TYPE, Category, RequiredDoc } from "@/types/global";
import { APIResponse } from "@/types/hooks";
import { useGetServiceById, useUpdateService } from "@/hooks/useService";
import EmptyElement from "@/components/EmptyElement";
import { serviceEditValidationSchema } from "@/constants/formValidation";
import SubmitButton from "@/components/forms/SubmitButton";
import { useGetAllCategoriesIdentities } from "@/hooks/useCategory";
import SelectorField from "@/components/forms/SelectorField";
import { useGetAllRequiredDocuments } from "@/hooks/useRequiredDocuments";

const buildInitialValues = (service: Service) => {
  return {
    title: service.title,
    description: service.description,
    duration: service.duration,
    price: service.price,
    categoryId: service.categoryId || -1,
    questions: (service.questions && service.questions.length > 0) ? service.questions.map((q) => ({
      question: q.question,
      type: q.type,
      choices: q.choices ?? [],
    })) : [],
    requiredDocs: (service.requiredDocs && service.requiredDocs.length > 0) ? service.requiredDocs.map((d) => ({
      id: d.id,
      state: "exists" as const,
    })) : [],
  };
};

const buildRequiredDocsPayload = (
  currentDocs: { id: number; state: "new" | "exists" | "deleted" }[],
  initialDocs: { id: number; state: "exists" | "new" | "deleted" }[]
): { id: number; state: "new" | "exists" | "deleted" }[] => {
  const currentDocsId = currentDocs.map((d) => d.id);
  const keptDocs = currentDocs.map((doc) => ({
    id: doc.id,
    state: doc.state,
  }));
  const deletedDocs = initialDocs
    .filter((d) => !currentDocsId.includes(d.id))
    .map((d) => ({ id: d.id, state: "deleted" as const }));
  return [...keptDocs, ...deletedDocs];
};

const EditServicePage: React.FC = () => {
  const { pushToast } = useAppContext();
  const router = useRouter();
  const params = useParams();
  const serviceId = Number(params?.id);
  const [initialValues, setInitialValues] = useState<ServiceCreation | undefined>(undefined)

  const { data: serviceResp, isLoading } = useGetServiceById(serviceId);
  const { data: categoriesData } = useGetAllCategoriesIdentities();
  const { data: requiredDocsData } = useGetAllRequiredDocuments()

  const service = serviceResp?.data;

  const { mutateAsync: updateService } = useUpdateService({
    onSuccess: (res: APIResponse<unknown>) => {
      pushToast({ message: res.message, type: "SUCCESS" });
      router.replace("/dashboard/services");
    },
    onError: (err: Error) => {
      pushToast({ message: err.message, type: "ERROR" });
    },
  });

  const onSubmit = async (
    values: ServiceCreation,
    formikHelpers: FormikHelpers<ServiceCreation>,
    initialValues: ServiceCreation
  ) => {
    const { resetForm, setSubmitting } = formikHelpers;

    const payload: Partial<ServiceCreation> = {};

    if (values.title !== initialValues.title) {
      payload.title = values.title;
    }
    if (values.description !== initialValues.description) {
      payload.description = values.description;
    }
    if (values.duration !== initialValues.duration) {
      payload.duration = values.duration;
    }
    if (values.price !== initialValues.price) {
      payload.price = values.price;
    }
    if (values.categoryId !== initialValues.categoryId)
      payload.categoryId = values.categoryId || -1

    payload.questions = values.questions;

    const docsPayload = buildRequiredDocsPayload(
      values.requiredDocs,
      initialValues.requiredDocs
    );
    payload.requiredDocs = docsPayload;

    await updateService({
      id: serviceId,
      data: payload,
    });

    resetForm({ values })
    setSubmitting(false);
  };

  const categoryOptions =
    categoriesData?.data?.map((cat: Omit<Category, "desc">) => ({
      key: cat.title,
      value: cat.id,
    })) || [];

  const requiredDocsOptions: RequiredDoc[] = requiredDocsData?.data

  useEffect(() => {
    if (service)
      setInitialValues(buildInitialValues(service))
  }, [service])

  if (isLoading) return <LoadingPage />;

  if (!service || !initialValues)
    return (
      <EmptyElement
        msg="There is no service"
        action={
          <Button
            className="bg-main hover:bg-main-hover text-face transition duration-300 cursor-pointer"
            onClick={() => router.back()}
          >
            Go back
          </Button>
        }
      />
    );

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-2">
      <div className="p-2 sm:p-4 md:p-8 flex items-center justify-center">
        <div className="bg-face w-full max-w-xl p-2 sm:p-4 md:p-8 rounded-2xl shadow-xl">
          <h1 className="mb-6 pb-4 border-b border-border text-center font-heading text-3xl text-main">
            Edit Service
          </h1>
          <p className="mb-6 text-center text-text-muted">
            Update the service information below.
          </p>

          <Formik
            initialValues={initialValues}
            onSubmit={(values, helpers) => onSubmit(values, helpers, initialValues)}
            enableReinitialize
            validationSchema={serviceEditValidationSchema}
          >
            {({ values, isSubmitting, isValid, dirty }) => {
              return (
                <Form className="space-y-6">
                  <InputField
                    name="title"
                    type="text"
                    label="Service Title"
                    placeholder="Enter Service Title"
                  />
                  <InputField
                    name="description"
                    type="text"
                    label="Description"
                    placeholder="Enter Description"
                  />

                  <div className="mb-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      name="duration"
                      type="text"
                      label="Duration"
                      placeholder="e.g. 30 min"
                    />
                    <InputField
                      name="price"
                      type="number"
                      label="Price"
                      placeholder="Enter Price"
                    />
                  </div>

                  <SelectorField
                    name="categoryId"
                    label="Category"
                    options={categoryOptions}
                    inputClasses="bg-white"
                    styles="w-full"
                  />

                  <div>
                    <h2 className="font-semibold text-lg mb-2">Questions:</h2>
                    <FieldArray name="questions">
                      {({ push, remove, form }) => (
                        <div className="space-y-4">
                          {(values.questions && values.questions.length > 0) && values.questions.map((q, index) => (
                            <div
                              key={index}
                              className="border border-border rounded-lg p-4 relative space-y-4"
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-red-500"
                                onClick={() => remove(index)}
                              >
                                <X size={16} />
                              </Button>

                              <InputField
                                name={`questions.${index}.question`}
                                type="text"
                                label="Question"
                                placeholder="Enter question"
                              />

                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Type:
                                </label>
                                <select
                                  name={`questions.${index}.type`}
                                  value={q.type}
                                  onChange={(e) =>
                                    form.setFieldValue(
                                      `questions.${index}.type`,
                                      e.target.value as QUESTION_TYPE
                                    )
                                  }
                                  className="w-full p-2 border rounded-lg"
                                >
                                  {Object.values(QUESTION_TYPE).map((t) => (
                                    <option key={t} value={t}>
                                      {t}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {q.type === QUESTION_TYPE.MultiChoice && (
                                <FieldArray name={`questions.${index}.choices`}>
                                  {({ push: pushChoice, remove: removeChoice }) => (
                                    <div className="space-y-2">
                                      <h3 className="font-medium">Choices:</h3>
                                      {q.choices?.map((c, ci) => (
                                        <div
                                          key={ci}
                                          className="flex items-center gap-2"
                                        >
                                          <input
                                            type="text"
                                            value={c}
                                            onChange={(e) =>
                                              form.setFieldValue(
                                                `questions.${index}.choices.${ci}`,
                                                e.target.value
                                              )
                                            }
                                            className="flex-1 border rounded-lg p-2"
                                            placeholder="Enter choice"
                                          />
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeChoice(ci)}
                                            className="text-red-500"
                                          >
                                            <X size={16} />
                                          </Button>
                                        </div>
                                      ))}
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => pushChoice("")}
                                        className="mt-2 cursor-pointer"
                                      >
                                        <Plus size={14} className="mr-1" /> Add
                                        Choice
                                      </Button>
                                    </div>
                                  )}
                                </FieldArray>
                              )}
                            </div>
                          ))}

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              push({
                                question: "",
                                type: QUESTION_TYPE.Text,
                                choices: [],
                              })
                            }
                            className="cursor-pointer"
                          >
                            <Plus size={14} className="mr-1" /> Add Question
                          </Button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <div>
                    <h2 className="font-semibold text-lg mb-2">
                      Required Documents:
                    </h2>
                    <FieldArray name="requiredDocs">
                      {({ push, remove, form }) => {
                        const selectedIds = form.values.requiredDocs
                          .filter((d: { id: number, state: string }) => d.state !== "deleted")
                          .map((d: { id: number, state: string }) => d.id);

                        return (
                          <div className="space-y-2">
                            {(values.requiredDocs && values.requiredDocs.length > 0) &&
                              values.requiredDocs.map((doc, index: number) => {
                                if (doc.state === "deleted") return null;

                                const availableOptions = requiredDocsOptions?.filter(
                                  (opt) =>
                                    !selectedIds.includes(opt.id) || opt.id === doc.id
                                );

                                return (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 border p-2 rounded-lg"
                                  >
                                    <select
                                      value={doc.id || ""}
                                      onChange={(e) =>
                                        form.setFieldValue(
                                          `requiredDocs.${index}.id`,
                                          Number(e.target.value)
                                        )
                                      }
                                      className="flex-1 border rounded-lg p-2"
                                    >
                                      <option value="">Select document</option>
                                      {availableOptions?.map((opt) => (
                                        <option key={opt.id} value={opt.id}>
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>

                                    <input
                                      type="hidden"
                                      value={doc.state}
                                      name={`requiredDocs.${index}.state`}
                                    />

                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        if (doc.state === "new") {
                                          remove(index);
                                        } else {
                                          form.setFieldValue(
                                            `requiredDocs.${index}.state`,
                                            "deleted"
                                          );
                                        }
                                      }}
                                      className="text-red-500"
                                    >
                                      <X size={16} />
                                    </Button>
                                  </div>
                                );
                              })}

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => push({ id: "", state: "new" })}
                              className="cursor-pointer"
                            >
                              <Plus size={14} className="mr-1" /> Add Document
                            </Button>
                          </div>
                        );
                      }}
                    </FieldArray>
                  </div>

                  <SubmitButton
                    isSubmitting={isSubmitting}
                    isDirty={dirty}
                    isValid={isValid}
                    label="Update Service"
                    submittingLabel="Updating..."
                    disabledLabel="Complete the form"
                    className="bg-main hover:bg-main-hover w-full py-3 px-4 rounded-lg shadow-md font-medium text-white transition-all"
                  />
                </Form>
              );
            }}
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
            Edit and customize your services. Update questions and required
            documents easily.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditServicePage;
