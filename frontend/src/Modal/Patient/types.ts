// types.ts
export interface CreatePatientInput {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  code: string;
  nik: string;
  name: string;
  gender: string;
  date_of_birth: string;
  phone: string;
  address: string;
  blood_type?: string;
  allergies?: string;
  status: boolean
    religion: string
    occupation: string
    emergency_contact_name: string
    emergency_contact_phone: string
    insurance_provider: string
    insurance_number: string
}

export type CreatePatientData = Omit<CreatePatientInput, "ID" | "CreatedAt" | "UpdatedAt" | "DeletedAt">;