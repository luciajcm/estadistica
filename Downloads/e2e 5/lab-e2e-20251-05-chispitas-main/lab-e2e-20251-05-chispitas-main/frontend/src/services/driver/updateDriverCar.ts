import { VehicleResponse } from "@interfaces/vehicle/VehicleResponse";
import Api from "@services/api";

export async function updateDriverCar(id: number, vehicle: VehicleResponse): Promise<VehicleResponse> {
  const api = await Api.getInstance();
  const response = await api.patch<VehicleResponse, VehicleResponse>(vehicle, {
    url: `/driver/${id}/car`
  });
  return response.data;
}
