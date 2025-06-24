import Api from "@services/api";

export async function deleteDriver(id: number): Promise<void> {
  const api = await Api.getInstance();
  await api.delete({
    url: `/driver/${id}`
  });
}
