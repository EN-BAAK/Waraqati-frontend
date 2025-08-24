import { LoginProps } from "@/types/forms";

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const login = async (formData: LoginProps) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) throw new Error(responseBody.msg);

  return responseBody;
};

export const validateAuthentication = async () => {
  const response = await fetch(`${API_URL}/auth/verify`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok) throw new Error("Error check verification");

  return responseBody;
}