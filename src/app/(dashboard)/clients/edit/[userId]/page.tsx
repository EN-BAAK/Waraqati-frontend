"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Formik, Form, FormikHelpers } from "formik";
import { FiUser, FiMail, FiPhone, FiHash } from "react-icons/fi";
import InputField from "@/components/forms/InputField";
import SelectImageField from "@/components/forms/SelectImageField";
import SubmitButton from "@/components/forms/SubmitButton";
import BackgroundImage from "@/assets/background.png";
import { useAppContext } from "@/contexts/AppProvider";
import { ClientCreation, SEX } from "@/types/global";
import { APIResponse } from "@/types/hooks";
import { useGetClientById, useUpdateClient } from "@/hooks/useClient";
import { useGetUserProfile } from "@/hooks/useUser";
import EmptyElement from "@/components/EmptyElement";
import { Button } from "@/components/ui/button";
import { clientEditionValidationSchema } from "@/constants/formValidation";
import LoadingPage from "@/components/LoadingPage";
import SelectorField from "@/components/forms/SelectorField";

const ClientEditPage: React.FC = () => {
  const { pushToast } = useAppContext();
  const router = useRouter();
  const params = useParams();
  const userId = Number(params?.userId);

  const [profileImage, setProfileImage] = useState<File | undefined>(undefined);
  const [currentProfileImage, setCurrentProfileImage] = useState<File | undefined>(undefined);

  const { data: clientData, isLoading: isClientLoading } = useGetClientById(userId);
  const { data: profileData } = useGetUserProfile(userId);
  const client = clientData?.data;

  const onSuccess = (res: APIResponse<unknown>) => {
    pushToast({ message: res.message, type: "SUCCESS" });
    router.replace("/clients");
  };

  const onError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" });
  };

  const { mutateAsync: updateClient } = useUpdateClient({ onSuccess, onError });

  const handleGoBack = () => router.back();

  useEffect(() => {
    if (profileData instanceof File) {
      setProfileImage(profileData);
      setCurrentProfileImage(profileData);
    } else if (profileData instanceof Blob) {
      const file = new File([profileData], "profile-image.png", { type: profileData.type });
      setProfileImage(file);
      setCurrentProfileImage(file);
    }
  }, [profileData]);

  if (isClientLoading) return <LoadingPage />;

  if (!client)
    return (
      <EmptyElement
        msg="There is no client"
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

  const onSubmit = async (
    values: ClientCreation,
    formikHelpers: FormikHelpers<ClientCreation>,
    initialValues: ClientCreation
  ) => {
    const { resetForm, setSubmitting } = formikHelpers;

    const formData = new FormData();

    if (values.firstName !== initialValues.firstName) {
      formData.append("user.firstName", values.firstName);
    }
    if (values.middleName !== initialValues.middleName) {
      formData.append("user.middleName", values.middleName || "");
    }
    if (values.lastName !== initialValues.lastName) {
      formData.append("user.lastName", values.lastName);
    }
    if (values.email !== initialValues.email) {
      formData.append("user.email", values.email);
    }
    if (values.phone !== initialValues.phone) {
      formData.append("user.phone", values.phone);
    }
    if (values.identityNumber !== initialValues.identityNumber) {
      formData.append("user.identityNumber", values.identityNumber);
    }

    if (values.country !== initialValues.country) {
      formData.append("client.country", values.country);
    }
    if (values.age !== initialValues.age) {
      formData.append("client.age", String(values.age));
    }
    if (values.sex !== initialValues.sex) {
      formData.append("client.sex", values.sex);
    }

    if (profileImage) {
      if (profileImage !== currentProfileImage)
        formData.append("profileImage", profileImage);
    } else {
      formData.append("profileImage", "null");
    }

    await updateClient({ id: userId, data: formData });

    resetForm({ values });
    setProfileImage(undefined);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-2">
      <div className="p-2 sm:p-4 md:p-8 flex items-center justify-center">
        <div className="bg-face w-full max-w-xl p-2 sm:p-4 md:p-8 rounded-2xl shadow-xl">
          <h1 className="mb-6 pb-4 border-b border-border text-center font-heading text-3xl text-main">
            Edit Client
          </h1>
          <p className="mb-8 text-center text-text-muted">
            Update the client information below.
          </p>

          <Formik
            initialValues={client}
            onSubmit={(values, helpers) => onSubmit(values, helpers, client)}
            enableReinitialize
            validationSchema={clientEditionValidationSchema}
          >
            {({ isSubmitting, dirty, isValid }) => (
              <Form className="space-y-6">
                <div className="m-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField name="firstName" type="text" label="First Name" placeholder="Enter First Name" Icon={<FiUser />} />
                  <InputField name="lastName" type="text" label="Last Name" placeholder="Enter Last Name" Icon={<FiUser />} />
                </div>

                <InputField name="middleName" type="text" label="Middle Name" placeholder="Enter Middle Name (optional)" Icon={<FiUser />} />
                <InputField name="email" type="email" label="Email" placeholder="Enter Email" Icon={<FiMail />} />

                <div className="m-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField name="phone" type="text" inputMode="numeric" label="Mobile Number" placeholder="Enter Mobile Number" Icon={<FiPhone />} />
                  <InputField name="identityNumber" type="text" inputMode="numeric" label="Identity Number" placeholder="Enter Identity Number" Icon={<FiHash />} />
                </div>

                <div className="m-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField name="country" type="text" label="Country" placeholder="Enter Country" Icon={<FiUser />} />
                  <InputField name="age" type="number" label="Age" placeholder="Enter Age" />
                </div>

                <div className="m-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectorField
                    name="sex"
                    label="Sex"
                    options={Object.values(SEX).map((sex) => ({
                      key: sex,
                      value: sex,
                    }))}
                  />
                </div>

                <SelectImageField value={profileImage} setValue={setProfileImage} label="Profile Image" />

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
          <h2 className="mb-6 font-heading font-extrabold text-5xl text-face drop-shadow-lg">Waraqati</h2>
          <div className="bg-main h-1 w-16 mb-6 mx-auto rounded-full"></div>
          <p className="text-lg text-face/90 leading-relaxed">
            Keep your client records up-to-date.
            Edit details, demographics, and contact info with ease.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientEditPage;
