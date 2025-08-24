"use client"

import React from "react"
import Link from "next/link"
import { Formik, Form } from "formik"
import { FiMail, FiLock } from "react-icons/fi"
import InputField from "@/components/forms/InputField"
import SubmitButton from "@/components/forms/SubmitButton"
import { loginValidationSchema } from "@/constants/formValidation"
import { loginInItalValues } from "@/constants/formValues"

const LoginPage: React.FC = () => {
  const onSubmit = (values: typeof loginInItalValues) => {
    console.log("Login Data:", values)
    // TODO: API login logic
  }

  return (
    <div>
      <h1 className="mb-8 font-heading capitalize text-center font-medium text-3xl md:text-4xl text-main">Welcome back</h1>

      <Formik
        initialValues={loginInItalValues}
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
              className="bg-main hover:bg-main-hover w-full py-3 px-4 rounded-lg shadow-sm hover:shadow-md font-medium text-white transition-all"
            />

            <div className="mt-4 py-2 border-t text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-link hover:text-link-hover transition transition-300"
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
