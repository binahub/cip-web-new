export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  role?: "admin" | "user";
}

export type UpdateUserPayload = Partial<CreateUserPayload>;
