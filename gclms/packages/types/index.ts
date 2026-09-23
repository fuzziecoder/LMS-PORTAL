export type UserRole = 'FOUNDER' | 'PRINCIPAL' | 'TEACHER' | 'STUDENT';

export type UserStatus = 'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'ARCHIVED';

export type SchoolStatus = 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}
