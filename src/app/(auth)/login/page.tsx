"use client"

import React from "react"
import Link from "next/link"
import { Formik, Form } from "formik"
import { FiMail, FiLock } from "react-icons/fi"
import InputField from "@/components/forms/InputField"
import SubmitButton from "@/components/forms/SubmitButton"
import { loginValidationSchema } from "@/constants/formValidation"
import { loginINitalValues } from "@/constants/formValues"

const LoginPage: React.FC = () => {
  const onSubmit = (values: typeof loginINitalValues) => {
    console.log("Login Data:", values)
    // TODO: API login logic
  }

  return (
    <div>
      <h1 className="mb-8 font-heading text-center font-medium text-3xl md:text-4xl text-main">Welcome back</h1>

      <Formik
        initialValues={loginINitalValues}
        validationSchema={loginValidationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, dirty, isValid }) => (
          <Form className="space-y-6">
            <InputField
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your official email"
              Icon={<FiMail />}
              innerDivStyle="relative"
            />

            <InputField
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              Icon={<FiLock />}
              innerDivStyle="relative"
            />

            <SubmitButton
              isSubmitting={isSubmitting}
              isDirty={dirty}
              isValid={isValid}
              label="Login"
              submittingLabel="Logging in..."
              disabledLabel="Complete the form"
              className="bg-main hover:bg-main-hover text-white py-3 px-4 rounded-lg w-full font-medium shadow-sm hover:shadow-md transition-all"
            />

            <div className="text-center mt-4">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-main hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default LoginPage
