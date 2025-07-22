// src/types/Contact.ts
export interface ContactPhone {
    type?: string;
    number: string;
  }
  
  export interface ContactEmail {
    type?: string;
    address: string;
  }
  
  export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    phoneNumbers?: ContactPhone[];
    emailAddresses?: ContactEmail[];
    birthday?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface ContactFormData {
    firstName: string;
    lastName: string;
    phoneNumbers: ContactPhone[];
    emailAddresses: ContactEmail[];
    birthday?: string;
    notes?: string;
  }