import type { Metadata } from "next"
import LoginForm from "./LoginForm"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your Waraqati account to manage your paperwork efficiently.",
  openGraph: {
    title: "Login | Waraqati",
    description: "Securely log in to Waraqati to access and manage your paperwork.",
    url: "/login",
    type: "website",
  },
}

const LoginPage: React.FC = () => {
  return <LoginForm />
}

export default LoginPage;
