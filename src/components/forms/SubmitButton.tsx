"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { SubmitButtonProps } from "@/types/forms"

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  isDirty,
  isValid,
  label = "Submit",
  submittingLabel = "Submitting...",
  disabledLabel = "Fill the form",
  className = "",
  onClick,
}) => {
  const disabled = isSubmitting || !isDirty || !isValid

  let buttonLabel = label
  if (isSubmitting) buttonLabel = submittingLabel
  else if (disabled) buttonLabel = disabledLabel

  return (
    <Button
      type="submit"
      disabled={disabled}
      onClick={onClick}
      className={`w-full transition cursor-pointer ${className}`}
    >
      {buttonLabel}
    </Button>
  )
}

export default SubmitButton