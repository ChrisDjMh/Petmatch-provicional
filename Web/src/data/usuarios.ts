export type EmailStatus = "pendiente" | "confirmado";
export type Experience = "ninguna" | "basica" | "amplia";
export type Commitment = "bajo" | "medio" | "alto";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  emailStatus: EmailStatus;
  birthDate: string;
  address: string;
  profilePhoto: string;
  rooms: number;
  hoursAtHome: number;
  experience: Experience;
  commitment: Commitment;
  childrenAtHome: boolean;
  hasOtherPets: boolean;
  otherPets: string;
};

// Datos ficticios para la vista frontend. No se incluyen contraseñas ni tokens de autenticación.
export const initialUsers: UserRecord[] = [
  { id: "USR-001", name: "María Fernanda López", email: "mafer.lopez@example.com", emailStatus: "confirmado", birthDate: "1996-04-18", address: "Av. Obregón 145, San Luis Río Colorado, Sonora", profilePhoto: "", rooms: 3, hoursAtHome: 8, experience: "basica", commitment: "alto", childrenAtHome: false, hasOtherPets: true, otherPets: "Una gata adulta" },
  { id: "USR-002", name: "Carlos Mendoza", email: "carlos.mendoza@example.com", emailStatus: "pendiente", birthDate: "1990-09-02", address: "Col. Industrial, Mexicali, Baja California", profilePhoto: "", rooms: 2, hoursAtHome: 5, experience: "ninguna", commitment: "medio", childrenAtHome: true, hasOtherPets: false, otherPets: "" },
  { id: "USR-003", name: "Daniela Ruiz", email: "daniela.ruiz@example.com", emailStatus: "confirmado", birthDate: "1988-12-11", address: "Col. Centro, Hermosillo, Sonora", profilePhoto: "", rooms: 4, hoursAtHome: 10, experience: "amplia", commitment: "alto", childrenAtHome: true, hasOtherPets: true, otherPets: "Dos perros pequeños" },
  { id: "USR-004", name: "Javier Soto", email: "j.soto@example.com", emailStatus: "confirmado", birthDate: "2001-06-25", address: "Col. Nueva, Nogales, Sonora", profilePhoto: "", rooms: 1, hoursAtHome: 3, experience: "ninguna", commitment: "bajo", childrenAtHome: false, hasOtherPets: false, otherPets: "" },
];
