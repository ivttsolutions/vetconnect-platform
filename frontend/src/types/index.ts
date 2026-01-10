export type UserType = 
  | 'VET_PROFESSIONAL'
  | 'VET_TECHNICIAN'
  | 'STUDENT'
  | 'PET_OWNER'
  | 'COMPANY'
  | 'SHELTER'
  | 'GENERAL';

export type CompanyType =
  | 'CLINIC'
  | 'HOSPITAL'
  | 'LABORATORY'
  | 'PHARMACEUTICAL'
  | 'SUPPLIER'
  | 'VET_COLLEGE'
  | 'UNIVERSITY'
  | 'RESEARCH_CENTER'
  | 'PET_STORE'
  | 'GROOMING'
  | 'INSURANCE'
  | 'NUTRITION'
  | 'RESCUE_ORGANIZATION'
  | 'NGO'
  | 'OTHER';

export interface User {
  id: string;
  email: string;
  userType: UserType;
  role: string;
  status: string;
  profile?: UserProfile;
  companyProfile?: CompanyProfile;
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

export interface CompanyProfile {
  id: string;
  companyName: string;
  companyType: CompanyType;
  logo?: string;
  description?: string;
  website?: string;
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
  userType: UserType;
  companyName?: string;
  companyType?: CompanyType;
}

export interface LoginData {
  email: string;
  password: string;
}

// User type labels for display
export const USER_TYPE_LABELS: Record<UserType, string> = {
  VET_PROFESSIONAL: 'Veterinario Profesional',
  VET_TECHNICIAN: 'Técnico/Auxiliar Veterinario',
  STUDENT: 'Estudiante de Veterinaria',
  PET_OWNER: 'Propietario de Mascotas',
  COMPANY: 'Empresa',
  SHELTER: 'Refugio/Protectora',
  GENERAL: 'Usuario General',
};

// Company type labels for display
export const COMPANY_TYPE_LABELS: Record<CompanyType, string> = {
  CLINIC: 'Clínica Veterinaria',
  HOSPITAL: 'Hospital Veterinario',
  LABORATORY: 'Laboratorio de Análisis',
  PHARMACEUTICAL: 'Farmacéutica Veterinaria',
  SUPPLIER: 'Proveedor/Distribuidor',
  VET_COLLEGE: 'Colegio Oficial de Veterinarios',
  UNIVERSITY: 'Universidad/Centro Educativo',
  RESEARCH_CENTER: 'Centro de Investigación',
  PET_STORE: 'Tienda de Mascotas',
  GROOMING: 'Peluquería Canina/Felina',
  INSURANCE: 'Seguros de Mascotas',
  NUTRITION: 'Nutrición Animal',
  RESCUE_ORGANIZATION: 'Organización de Rescate',
  NGO: 'ONG/Asociación Protectora',
  OTHER: 'Otro',
};
