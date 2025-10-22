"use client";

import React from "react";
import { Formik, Form, FieldArray, FormikHelpers } from "formik";
import InputField from "@/components/forms/InputField";
import SubmitButton from "@/components/forms/SubmitButton";
import BackgroundImage from "@/assets/background.png";
import { useAppContext } from "@/contexts/AppProvider";
import { useRouter } from "next/navigation";
import { ServiceCreation, QUESTION_TYPE, ServiceQuestion, Category } from "@/types/global";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { initialService } from "@/constants/formValues";
import { serviceCreationValidationSchema } from "@/constants/formValidation";
import { APIResponse } from "@/types/hooks";
import { useCreateService } from "@/hooks/useService";
import { useGetAllCategoriesIdentities } from "@/hooks/useCategory";
import SelectorField from "@/components/forms/SelectorField";

const ServiceCreatePage: React.FC = () => {
  const { data: categoriesData } = useGetAllCategoriesIdentities();

  const { pushToast } = useAppContext();
  const router = useRouter();

  const onSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
    router.replace("/services")
  }
  const onError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const { mutateAsync } = useCreateService({ onSuccess, onError })

  const onSubmit = async (
    values: ServiceCreation,
    formik: FormikHelpers<ServiceCreation>
  ) => {
    await mutateAsync(values);

    formik.resetForm();
    formik.setSubmitting(false);
  };

  const categoryOptions =
    categoriesData?.data?.map((cat: Omit<Category, "desc">) => ({
      key: cat.title,
      value: cat.id,
    })) || [];

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-2">
      <div className="p-2 sm:p-4 md:p-8 flex items-center justify-center">
        <div className="bg-face w-full max-w-xl p-2 sm:p-4 md:p-8 rounded-2xl shadow-xl">
          <h1 className="mb-6 pb-4 border-b border-border text-center font-heading text-3xl text-main">
            Add New Service
          </h1>

          <Formik
            initialValues={initialService}
            onSubmit={onSubmit}
            validationSchema={serviceCreationValidationSchema}
          >
            {({ isSubmitting, dirty, isValid }) => (
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
                        {form.values.questions.map((q: Omit<ServiceQuestion, "id">, index: number) => (
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
                              <label className="block text-sm font-medium mb-1">Type:</label>
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
                                      <div key={ci} className="flex items-center gap-2">
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
                                      <Plus size={14} className="mr-1" /> Add Choice
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
                  <h2 className="font-semibold text-lg mb-2">Required Documents:</h2>
                  <FieldArray name="requiredDocs">
                    {({ push, remove, form }) => (
                      <div className="space-y-2">
                        {form.values.requiredDocs.map(
                          (
                            doc: { label: string; state: "new" | "exists" },
                            index: number
                          ) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 border p-2 rounded-lg"
                            >
                              <input
                                type="text"
                                value={doc.label}
                                onChange={(e) =>
                                  form.setFieldValue(
                                    `requiredDocs.${index}.label`,
                                    e.target.value
                                  )
                                }
                                className="flex-1 border rounded-lg p-2"
                                placeholder="Document label"
                              />

                              <input
                                type="hidden"
                                value={doc.state}
                                name={`requiredDocs.${index}.state`}
                              />

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="text-red-500"
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          )
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => push({ label: "", state: "new" })}
                          className="cursor-pointer"
                        >
                          <Plus size={14} className="mr-1" /> Add Document
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                <SubmitButton
                  isSubmitting={isSubmitting}
                  isDirty={dirty}
                  isValid={isValid}
                  label="Create Service"
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
            Create and customize your services. Add questions, required
            documents, and manage everything easily.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCreatePage;
