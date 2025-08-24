"use client"

import React, { useState } from "react"
import { Formik, Form } from "formik"
import { FiMail, FiLock, FiKey } from "react-icons/fi"
import InputField from "@/components/forms/InputField"
import SubmitButton from "@/components/forms/SubmitButton"
import { resetForgotPasswordEmailValidationSchema, resetForgotPasswordValidationSchema } from "@/constants/formValidation"
import { resetForgotPasswordEmailInitialValues, resetForgotPasswordInitialValues } from "@/constants/formValues"

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1)

  const handleEmailSubmit = (values: { email: string }) => {
    console.log("Email submitted:", values)
    // TODO: API mutation
    setStep(2)
  }

  const handleResetSubmit = (values: { code: string; password: string }) => {
    console.log("Reset password:", values)
    // TODO: API mutation
    // redirect or show success message
  }

  return (
    <div className="relative">
      <div className="mb-8">
        <h1 className="mb-0 font-heading text-center font-semibold text-2xl md:text-3xl text-main">
          {step === 1 ? "Recover Your Account" : "Set New Password"}
        </h1>
        <p className="text-sm text-text-muted text-center mb-6">
          {step === 1
            ? "Enter your registered email and we will send you a verification code."
            : "Enter the code sent to your email and set a new secure password."}
        </p>
      </div>

      {step === 1 && (
        <Formik
          initialValues={resetForgotPasswordEmailInitialValues}
          validationSchema={resetForgotPasswordEmailValidationSchema}
          onSubmit={handleEmailSubmit}
        >
          {({ isSubmitting, dirty, isValid }) => (
            <Form className="space-y-5">
              <InputField
                name="email"
                type="email"
                label="Email Address"
                placeholder="example@government.gov"
                Icon={<FiMail />}
                innerDivStyle="relative"
              />

              <SubmitButton
                isSubmitting={isSubmitting}
                isDirty={dirty}
                isValid={isValid}
                label="Send Verification Code"
                submittingLabel="Sending..."
                disabledLabel="Enter a valid email"
                className="bg-main hover:bg-main-hover w-full py-3 px-4 rounded-lg shadow-sm hover:shadow-md font-medium text-white transition-all"
              />
            </Form>
          )}
        </Formik>
      )}

      {step === 2 && (
        <Formik
          initialValues={resetForgotPasswordInitialValues}
          validationSchema={resetForgotPasswordValidationSchema}
          onSubmit={handleResetSubmit}
        >
          {({ isSubmitting, dirty, isValid }) => (
            <Form className="space-y-5">
              <InputField
                name="code"
                type="text"
                label="Verification Code"
                placeholder="Enter 6-digit code"
                Icon={<FiKey />}
                innerDivStyle="relative"
              />

              <InputField
                name="password"
                type="password"
                label="New Password"
                placeholder="At least 8 characters, one uppercase, one number"
                Icon={<FiLock />}
                innerDivStyle="relative"
              />

              <SubmitButton
                isSubmitting={isSubmitting}
                isDirty={dirty}
                isValid={isValid}
                label="Reset Password"
                submittingLabel="Resetting..."
                disabledLabel="Complete the form"
                className="bg-main hover:bg-main-hover w-full py-3 px-4 rounded-lg shadow-sm hover:shadow-md font-medium text-white transition-all"
              />
            </Form>
          )}
        </Formik>
      )}
    </div>
  )
}

export default ForgotPassword
