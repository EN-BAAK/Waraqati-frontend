import { LoginProps, ResetForgotPasswordEmailProps, ResetForgotPasswordProps } from "@/types/forms";
import { PaginationQueryProps, User } from "@/types/global";
import { APIResponse } from "@/types/hooks";

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const login = async (formData: LoginProps) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
};

export const validateAuthentication = async (): Promise<APIResponse<User>> => {
  const response = await fetch(`${API_URL}/auth/verify`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const forgetPasswordSendEmail = async (formData: ResetForgotPasswordEmailProps) => {
  const response = await fetch(`${API_URL}/users/forgot-password/${formData.email}`);

  const responseBody = await response.json();

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const resetForgottenPassword = async (formData: ResetForgotPasswordProps) => {
  const response = await fetch(`${API_URL}/users/reset-forgotten-password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

  const responseBody = await response.json();

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const getUserProfileImage = async (id: number) => {
  const response = await fetch(`${API_URL}/users/${id}/profile-image`);

  if (!response.ok) throw new Error("Failed fetch profile image");

  return response.blob();
};

export const logout = async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include"
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const getAllEmployees = async ({ limit, page }: PaginationQueryProps) => {
  const response = await fetch(`${API_URL}/employees?page=${page}&limit=${limit}`, {
    credentials: "include"
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const createEmployee = async (formData: FormData) => {
  const response = await fetch(`${API_URL}/employees`, {
    method: "POST",
    credentials: "include",
    body: formData
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}