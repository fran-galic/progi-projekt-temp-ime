export interface IDealership {
  companyName: string;
  image: string;
}

export interface IRegisterCompany {
  name: string; // ime kompanije
  email: string; // email kompanije
  phoneNo: string; // broj telefona kompanije
  HQaddress: string; // HQ adresa
  TIN: string; // Tax identification number
  workingHours: {
    // radno vrijeme HQ-a
    mon: { from: number; to: number };
    tue: { from: number; to: number };
    wen: { from: number; to: number };
    thu: { from: number; to: number };
    fri: { from: number; to: number };
    sat: { from: number; to: number };
    sun: { from: number; to: number };
  };
  password: string; // lozinka kompanije
  confirmPassword: string; // potvrda lozinke
  logo: string;
}

export interface ICompanyInfo
{
  companyName: string;
  image: string;
  description: string; 
  phoneNo: string;
}

export interface IEditInfo {
  name: string;
  logo: string;
  password: string;
  description: string; 
  phoneNo: string;
}

export interface IEditPassword {
  newPassword: string; // Lozinka korisnika
  oldPassword: string; // Stara lozinka
}

export interface IEditLocations {
  location: string;
  workingHours: {
    mon: { from: number; to: number };
    tue: { from: number; to: number };
    wen: { from: number; to: number };
    thu: { from: number; to: number };
    fri: { from: number; to: number };
    sat: { from: number; to: number };
    sun: { from: number; to: number };
  };
}

export interface ISetHQ {
  location: string;
}

export interface Company {
  companyName: string;
  companyLogo: string;
  dealership_id: number;
}

export interface CompaniesResponse {
  companies: Company[];
}

export interface IEarnings {
  isLastPage: boolean,
  results: {
    totalEarnings: number,
    yearEarnings: number,
    totalRentals: number,
    yearRentals: number,
    monthlyEarnings: [
      number
    ]
  }
}
