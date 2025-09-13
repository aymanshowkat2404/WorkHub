export interface User {
    username: string;
    id: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    employeeId?: string;
    fullName?: string;
    companyName?: string;
    roles: string[];  // ✅ correct type
    token: string;
  }