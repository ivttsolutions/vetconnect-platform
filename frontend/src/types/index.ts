export interface User {
  id: string;
  email: string;
  userType: 'USER' | 'COMPANY' | 'SHELTER';
  role: string;
  status: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  headline?: string;
  bio?: string;
  specialization?: string[];
  yearsOfExperience?: number;
  country?: string;
  city?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiError {
  success: boolean;
  error: string;
  errors?: Array<{ field?: string; message: string }>;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: 'USER' | 'COMPANY' | 'SHELTER';
}

export interface LoginData {
  email: string;
  password: string;
}
