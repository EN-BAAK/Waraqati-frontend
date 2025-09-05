"use client";

import React, { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { FiUser, FiMail, FiPhone, FiHash } from "react-icons/fi";
import InputField from "@/components/forms/InputField";
import SelectImageField from "@/components/forms/SelectImageField";
import SubmitButton from "@/components/forms/SubmitButton";
import BackgroundImage from "@/assets/background.png";
import { useAppContext } from "@/contexts/AppProvider";
import { ClientCreation } from "@/types/global";
import { APIResponse } from "@/types/hooks";
import { useRouter } from "next/navigation";
import { useCreateClient } from "@/hooks/useClient";
import { clientCreationValidationSchema } from "@/constants/formValidation";
import { initialClient } from "@/constants/formValues";
import { SEX } from "@/types/global";
import SelectorField from "@/components/forms/SelectorField";

const ClientCreatePage: React.FC = () => {
  const [profileImage, setProfileImage] = useState<File | undefined>(undefined);
  const { pushToast } = useAppContext();
  const router = useRouter();

  const onSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" });
    router.replace("/clients");
  };
  const onError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" });
  };

  const { mutateAsync } = useCreateClient({ onSuccess, onError });

  const onSubmit = async (values: ClientCreation, formik: FormikHelpers<ClientCreation>) => {
    const formData = new FormData();

    const { firstName, middleName, lastName, email, phone, identityNumber, country, age, sex } = values;

    formData.append("user.firstName", firstName);
    formData.append("user.middleName", middleName || "");
    formData.append("user.lastName", lastName);
    formData.append("user.email", email);
    formData.append("user.phone", phone);
    formData.append("user.identityNumber", identityNumber);

    formData.append("client.country", country);
    formData.append("client.age", String(age));
    formData.append("client.sex", sex);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    await mutateAsync(formData);
    formik.resetForm();
    setProfileImage(undefined);
    formik.setSubmitting(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-2">
      <div className="p-2 sm:p-4 md:p-8 flex items-center justify-center">
        <div className="bg-face w-full max-w-xl p-2 sm:p-4 md:p-8 rounded-2xl shadow-xl">
          <h1 className="mb-6 pb-4 border-b border-border text-center font-heading text-3xl text-main">
            Add New Client
          </h1>
          <p className="mb-8 text-center text-text-muted">
            Fill in the details below to create a new client profile.
          </p>

          <Formik
            validationSchema={clientCreationValidationSchema}
            initialValues={initialClient}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, dirty, isValid }) => (
              <Form className="space-y-6">
                <div className="m-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    name="firstName"
                    type="text"
                    label="First Name"
                    placeholder="Enter First Name"
                    Icon={<FiUser />}
                    innerDivStyle="relative"
                  />
                  <InputField
                    name="lastName"
                    type="text"
                    label="Last Name"
                    placeholder="Enter Last Name"
                    Icon={<FiUser />}
                    innerDivStyle="relative"
                  />
                </div>

                <InputField
                  name="middleName"
                  type="text"
                  label="Middle Name"
                  placeholder="Enter Middle Name (optional)"
                  Icon={<FiUser />}
                  innerDivStyle="relative"
                />

                <InputField
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter Email"
                  Icon={<FiMail />}
                  innerDivStyle="relative"
                />

                <div className="m-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    name="phone"
                    type="text"
                    inputMode="numeric"
                    label="Mobile Number"
                    placeholder="Enter Mobile Number"
                    Icon={<FiPhone />}
                    innerDivStyle="relative"
                  />

                  <InputField
                    name="identityNumber"
                    type="text"
                    inputMode="numeric"
                    label="Identity Number"
                    placeholder="Enter Identity Number"
                    Icon={<FiHash />}
                    innerDivStyle="relative"
                  />
                </div>

                <div className="m-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    name="country"
                    type="text"
                    label="Country"
                    placeholder="Enter Country"
                    Icon={<FiUser />}
                    innerDivStyle="relative"
                  />

                  <InputField
                    name="age"
                    type="number"
                    label="Age"
                    placeholder="Enter Age"
                    innerDivStyle="relative"
                  />
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

                <SelectImageField
                  value={profileImage}
                  setValue={setProfileImage}
                  label="Profile Image"
                />

                <SubmitButton
                  isSubmitting={isSubmitting}
                  isDirty={dirty}
                  isValid={isValid}
                  label="Create Client"
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
            Manage your clients efficiently. Add new clients, track their details, and keep your client database up-to-date.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientCreatePage;
