import { PaginatedRequest } from "@interfaces/pagination/PaginatedRequest";
import { PaginatedResponse } from "@interfaces/pagination/PaginatedResponse";
import { RideByUserResponse } from "@interfaces/ride/RideByUserResponse";
import Api from "@services/api";

export async function getRidesByUser(paginatedRequest: PaginatedRequest): Promise<PaginatedResponse<RideByUserResponse>> {
  const api = await Api.getInstance();
  const response = await api.get<void, PaginatedResponse<RideByUserResponse>>({
    url: `/ride/user?page=${paginatedRequest.page}&size=${paginatedRequest.size}`
  });
  return response.data;
}
