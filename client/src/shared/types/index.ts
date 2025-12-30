export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  title: string;
  desp?: string;
  short?: string;
  tags?: string[];
  sender: User;
  organization?: Organization;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  owner: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  name: string;
}

export interface SendMessageForm {
  title: string;
  desp?: string;
  short?: string;
  tags?: string[];
  organizationId?: string;
}
