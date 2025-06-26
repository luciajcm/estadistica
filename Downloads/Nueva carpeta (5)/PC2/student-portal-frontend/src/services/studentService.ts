import Api from "./api";
import { type StudentProfileRead } from "@interfaces/models/studentModels";

export async function getStudents(): Promise<StudentProfileRead[]> {
  const api = await Api.getInstance();
  const response = await api.get<void, StudentProfileRead[]>({ url: '/students/' });
  return response.data;
}