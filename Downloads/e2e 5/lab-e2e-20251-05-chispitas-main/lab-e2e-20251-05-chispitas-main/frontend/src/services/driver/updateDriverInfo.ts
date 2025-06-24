import { DriverPatchRequest } from "@interfaces/driver/DriverPatchRequest";
import { DriverResponse } from "@interfaces/driver/DriverResponse";
import Api from "@services/api";

export async function updateDriverInfo(driverPatchRequest: DriverPatchRequest): Promise<DriverResponse> {
	const api = await Api.getInstance();
	const response = await api.patch<DriverPatchRequest, DriverResponse>(driverPatchRequest, {
		url: '/driver/me'
	});
	return response.data;
}
