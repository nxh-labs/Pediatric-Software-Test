
export interface PatientPersistenceDto {
   id: string;
   name: string;
   gender: "M" | "F" | "O";
   birthday: string;
   parents: {
      mother?: string;
      father?: string;
   };
   contact: {
      email: string;
      tel: string;
   };
   address: {
      street?: string;
      city?: string;
      postalCode?: string;
      country: string;
   };
   registrationDate: string;
}
