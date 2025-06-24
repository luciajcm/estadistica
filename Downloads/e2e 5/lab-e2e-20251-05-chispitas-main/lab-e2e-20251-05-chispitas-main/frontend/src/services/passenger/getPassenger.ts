import { PassengerResponse } from "@interfaces/passenger/PassengerResponse";
import Api from "@services/api";

export async function getPassenger(id?: number): Promise<PassengerResponse> {
  const api = await Api.getInstance();
  const response = await api.get<void, PassengerResponse>({
    url: id ? `/passenger/${id}` : `/passenger/me`
  });
  return response.data;
}
