import type { Metadata } from "next"
import ForgotPasswordForm from "./ForgotPasswordForm"

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Recover your Waraqati account securely by resetting your password.",
  openGraph: {
    title: "Forgot Password | Waraqati",
    description: "Enter your email to receive a verification code and reset your password.",
    url: "/forgot-password",
    type: "website",
  },
}

const Page: React.FC = () => {
  return <ForgotPasswordForm />
}

export default Page; 