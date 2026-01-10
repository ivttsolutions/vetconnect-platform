import { Request } from 'express';
import { JwtPayload } from '../utils/jwt.util';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

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

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  companyName?: string;
  companyType?: CompanyType;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  bio?: string;
  phone?: string;
  country?: string;
  city?: string;
  specialization?: string[];
  yearsOfExperience?: number;
}
