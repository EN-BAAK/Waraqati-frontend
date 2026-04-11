"use client";

import React from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { FiLock } from "react-icons/fi";
import InputField from "@/components/forms/InputField";
import SubmitButton from "@/components/forms/SubmitButton";
import { useAppContext } from "@/contexts/AppProvider";
import { useRouter } from "next/navigation";
import { APIResponse } from "@/types/hooks";
import { resetPasswordValidationSchema } from "@/constants/formValidation";
import { ResetPassword } from "@/types/global";
import { resetPasswordInitialValues } from "@/constants/formValues";
import { useChangePassword } from "@/hooks/useUser";

const SecurityPage: React.FC = () => {
  const { pushToast } = useAppContext();
  const router = useRouter();

  const onSuccess = (data: APIResponse<unknown>) => {
    pushToast({ message: data.message, type: "SUCCESS" });
    router.back();
  };

  const onError = (err: Error) => {
    pushToast({ message: err.message, type: "ERROR" });
  };

  const { mutateAsync } = useChangePassword({ onSuccess, onError })

  const onSubmit = async (values: ResetPassword, formik: FormikHelpers<ResetPassword>
  ) => {
    await mutateAsync(values);
    formik.resetForm();
    formik.setSubmitting(false);
  };

  return (
    <div className="bg-face max-h-full p-6 rounded-2xl shadow-sm overflow-auto">
      <div className="max-w-xl mx-auto">
          <h1 className="mb-6 pb-4 border-b border-border text-center font-heading text-2xl">
            Change Password
          </h1>

          <p className="mb-6 text-center text-text-muted">
            Keep your account secure by updating your password regularly.
          </p>

          <Formik
            initialValues={resetPasswordInitialValues}
            validationSchema={resetPasswordValidationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, dirty, isValid }) => (
              <Form className="space-y-6">
                <InputField
                  name="password"
                  type="password"
                  label="Current Password"
                  placeholder="Enter current password"
                  Icon={<FiLock />}
                  innerDivStyle="relative"
                />

                <InputField
                  name="newPassword"
                  type="password"
                  label="New Password"
                  placeholder="Enter new password"
                  Icon={<FiLock />}
                  innerDivStyle="relative"
                />

                <InputField
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  Icon={<FiLock />}
                  innerDivStyle="relative"
                />

                <SubmitButton
                  isSubmitting={isSubmitting}
                  isDirty={dirty}
                  isValid={isValid}
                  label="Update Password"
                  submittingLabel="Updating..."
                  disabledLabel="Complete the form"
                  className="bg-main hover:bg-main-hover w-full py-3 px-4 rounded-lg shadow-md font-medium text-white transition-all"
                />
              </Form>
            )}
          </Formik>
        </div>
    </div>
  );
};

export default SecurityPage;