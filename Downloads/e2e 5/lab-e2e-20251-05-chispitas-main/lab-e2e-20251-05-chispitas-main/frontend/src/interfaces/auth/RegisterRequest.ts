import { VehicleResponse } from "@interfaces/vehicle/VehicleResponse";

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  isDriver: boolean;
  category?: "X" | "XL" | "BLACK"
  vehicle?: VehicleResponse;
}
