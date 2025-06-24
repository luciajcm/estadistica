import { VehicleResponse } from "../vehicle/VehicleResponse";

export interface DriverResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  category: string;
  trips: number;
  avgRating: number;
  vehicle?: VehicleResponse;
}
