import { PassengerPatchRequest } from "@interfaces/passenger/PassengerPatchRequest";
import { PassengerResponse } from "@interfaces/passenger/PassengerResponse";
import Api from "@services/api";

export async function updatePassenger(passengerPatchRequest: PassengerPatchRequest): Promise<PassengerResponse> {
	const api = await Api.getInstance();
	const response = await api.patch<PassengerPatchRequest, PassengerResponse>(passengerPatchRequest, {
		url: '/passenger/me'
	});
	return response.data;
}
