import { DriverResponse } from "@interfaces/driver/DriverResponse";
import Api from "@services/api";

export async function getDriver(id?: number): Promise<DriverResponse> {
  const api = await Api.getInstance();
  const response = await api.get<void, DriverResponse>({
    url: id ? `/driver/${id}` : `/driver/me`
  });
  return response.data;
}
