import { LoginProps, ResetForgotPasswordEmailProps, ResetForgotPasswordProps, UpdateClientSpecializationProps } from "@/types/forms";
import { GlobalQuestionCreation, PaginationSearchedQueryProps, ServiceCreation, servicePaginationFilterQueryProps, updateItemWithFormData, updateItemWithType, User } from "@/types/global";
import { APIResponse } from "@/types/hooks";
import { clearSessionItem, setSessionItem } from "./lib/helpers";

const API_URL = process.env.NEXT_PUBLIC_API_URL
const USER_INFO = process.env.NEXT_PUBLIC_USER_INFO!

export const login = async (formData: LoginProps) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);

  if (responseBody.data?.user) {
    setSessionItem(USER_INFO, responseBody.data);
  }

  return responseBody;
};

export const validateAuthentication = async (): Promise<APIResponse<User>> => {
  const response = await fetch(`${API_URL}/auth/verify`, {
    credentials: "include",
  });

  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);

  if (responseBody.data) {
    setSessionItem(USER_INFO, {
      username: `${responseBody.data.firstName} ${responseBody.data.lastName}`,
      role: responseBody.data.role,
      email: responseBody.data.email
    });
  }

  return responseBody;
};

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
  const response = await fetch(`${API_URL}/users/${id}/profile-image`, {
    credentials: "include"
  });

  if (!response.ok) throw new Error("Failed fetch profile image");

  return response.blob();
};

export const logout = async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);

  clearSessionItem(USER_INFO);

  return responseBody;
};

export const getAllEmployees = async ({ limit, page, search }: PaginationSearchedQueryProps) => {
  const response = await fetch(`${API_URL}/employees?page=${page}&limit=${limit}&search=${search}`, {
    credentials: "include"
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const getEmployeeById = async (id: number) => {
  const response = await fetch(`${API_URL}/employees/${id}`, {
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

export const updateEmployee = async ({ id, data }: updateItemWithFormData) => {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: "PUT",
    credentials: "include",
    body: data
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const deleteUserById = async (id: number) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const getAllClients = async ({ limit, page, search = "" }: PaginationSearchedQueryProps) => {
  const response = await fetch(`${API_URL}/clients?page=${page}&limit=${limit}&search=${search}`, {
    credentials: "include"
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const getClientById = async (id: number) => {
  const response = await fetch(`${API_URL}/clients/${id}`, {
    credentials: "include"
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const createClient = async (formData: FormData) => {
  const response = await fetch(`${API_URL}/clients`, {
    method: "POST",
    credentials: "include",
    body: formData
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const updateClient = async ({ id, data }: updateItemWithFormData) => {
  const response = await fetch(`${API_URL}/clients/${id}`, {
    method: "PUT",
    credentials: "include",
    body: data
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const updateClientSpecialization = async ({ userId, isSpecial }: UpdateClientSpecializationProps) => {
  const response = await fetch(`${API_URL}/clients/${userId}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isSpecial })
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const getAllServices = async ({ limit, page, title, category }: servicePaginationFilterQueryProps) => {
  const response = await fetch(`${API_URL}/services?page=${page}&limit=${limit}&title=${title}&category=${category}`, {
    credentials: "include"
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const getCategoricServiceById = async (id: number) => {
  const response = await fetch(`${API_URL}/services/${id}/detailed`, {
    credentials: "include"
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const getServiceById = async (id: number) => {
  const response = await fetch(`${API_URL}/services/${id}`, {
    credentials: "include"
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const createService = async (data: ServiceCreation) => {
  const response = await fetch(`${API_URL}/services`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const updateService = async ({ id, data }: updateItemWithType<Partial<ServiceCreation>>) => {
  const response = await fetch(`${API_URL}/services/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const deleteServiceById = async (id: number) => {
  const response = await fetch(`${API_URL}/services/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const getAllCategories = async () => {
  const response = await fetch(`${API_URL}/categories`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
};

export const getAllCategoriesIdentifies = async () => {
  const response = await fetch(`${API_URL}/categories/identifies`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
};

export const getCategoryById = async (id: number) => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
};

export const createCategory = async (formData: FormData) => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const responseBody = await response.json();

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
};

export const updateCategory = async ({ id, data }: updateItemWithFormData) => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    credentials: "include",
    body: data,
  });

  const responseBody = await response.json();

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
};

export const getCategoryImageById = async (id: number) => {
  const response = await fetch(`${API_URL}/categories/${id}/image`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch category image");

  return response.blob();
};

export const deleteCategory = async (id: number) => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const responseBody = await response.json()

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
}

export const getAllQuestions = async () => {
  const response = await fetch(`${API_URL}/questions`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok) throw new Error(responseBody.message);
  return responseBody;
};

export const getActivatedQuestions = async () => {
  const response = await fetch(`${API_URL}/questions/active`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok) throw new Error(responseBody.message);
  return responseBody;
};

export const createQuestion = async (data: GlobalQuestionCreation) => {
  const response = await fetch(`${API_URL}/questions`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);
  return responseBody;
};

export const updateQuestion = async ({ id, data }: updateItemWithType<Partial<GlobalQuestionCreation>>) => {
  const response = await fetch(`${API_URL}/questions/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);
  return responseBody;
};

export const deleteQuestion = async (id: number) => {
  const response = await fetch(`${API_URL}/questions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);
  return responseBody;
};

export const activateQuestion = async (id: number) => {
  const response = await fetch(`${API_URL}/questions/${id}/toggle`, {
    method: "PUT",
    credentials: "include",
  });

  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);
  return responseBody;
};

export const swapQuestions = async (aQuestionId: number, bQuestionId: number) => {
  const response = await fetch(`${API_URL}/questions/swap-order`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ aQuestionId, bQuestionId }),
  });

  const responseBody = await response.json();
  if (!response.ok) throw new Error(responseBody.message);
  return responseBody;
};

export const getQuestionById = async (id: number) => {
  const response = await fetch(`${API_URL}/questions/${id}`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok) throw new Error(responseBody.message);

  return responseBody;
};