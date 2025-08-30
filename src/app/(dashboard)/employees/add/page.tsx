"use client"

import React, { useState } from "react"
import { Formik, Form, FormikHelpers } from "formik"
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHash,
  FiUserCheck,
} from "react-icons/fi"
import CheckboxField from "@/components/forms/CheckboxField"
import InputField from "@/components/forms/InputField"
import SubmitButton from "@/components/forms/SubmitButton"
import { initialEmployee } from "@/constants/formValues"
import { EmployeeCreation } from "@/types/global"
import { useAppContext } from "@/contexts/AppProvider"
import BackgroundImage from "@/assets/background.png"
import SelectImageField from "@/components/forms/SelectImageField"
import { useCreateEmployee } from "@/hooks/useEmployee"
import { APIResponse } from "@/types/hooks"
import { useRouter } from "next/navigation"

const EmployeeCreatePage: React.FC = () => {
  const [profileImage, setProfileImage] = useState<File | undefined>(undefined)

  const { pushToast } = useAppContext()
  const router = useRouter()

  const onSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" })
    router.replace("/employees")
  }
  const onError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" })
  }

  const { mutateAsync } = useCreateEmployee({ onSuccess, onError })

  const onSubmit = async (
    values: EmployeeCreation,
    formik: FormikHelpers<EmployeeCreation>
  ) => {
    const formData = new FormData();

    const { firstName, middleName, lastName, email, phone, identityNumber, rate, isAvailable, isAdmin, creditor, debit } = values;

    formData.append("user.firstName", firstName);
    formData.append("user.middleName", middleName || "");
    formData.append("user.lastName", lastName);
    formData.append("user.email", email);
    formData.append("user.phone", phone);
    formData.append("user.identityNumber", identityNumber);

    formData.append("employee.rate", String(rate));
    formData.append("employee.isAvailable", String(isAvailable));
    formData.append("employee.isAdmin", String(isAdmin));
    formData.append("employee.creditor", String(creditor));
    formData.append("employee.debit", String(debit));

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    await mutateAsync(formData)
    formik.resetForm();
    setProfileImage(undefined);
    formik.setSubmitting(false);
  }

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-2">
      <div className="p-2 sm:p-4 md:p-8 flex items-center justify-center">
        <div className="bg-face w-full max-w-xl p-2 sm:p-4 md:p-8 rounded-2xl shadow-xl">
          <h1 className="mb-6 pb-4 border-b border-border text-center font-heading text-3xl text-main">
            Add New Employee
          </h1>
          <p className="mb-8 text-center text-text-muted">
            Fill in the details below to create a new employee profile.
          </p>

          <Formik initialValues={initialEmployee} onSubmit={onSubmit}>
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

                <CheckboxField
                  name="isAdmin"
                  label="This Employee Will Be An Admin"
                  Icon={<FiUserCheck />}
                />

                <SelectImageField value={profileImage} setValue={setProfileImage} label="Profile Image" />

                <SubmitButton
                  isSubmitting={isSubmitting}
                  isDirty={dirty}
                  isValid={isValid}
                  label="Create Employee"
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
        <div className="bg-gradient-to-br from-main/80 via-main/60 to-main/80 absolute inset-0 "></div>

        <div className="max-w-md relative z-10 text-center">
          <h2 className="mb-6 font-heading font-extrabold text-5xl text-face drop-shadow-lg">
            Waraqati
          </h2>
          <div className="bg-main h-1 w-16 mb-6 mx-auto rounded-full"></div>
          <p className="text-lg text-face/90 leading-relaxed">
            Empower your organization by managing employees with ease.
            Add new team members and assign roles quickly — all in one place.
          </p>
        </div>
      </div>
    </div>
  )
}

export default EmployeeCreatePage
