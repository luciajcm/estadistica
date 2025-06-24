import Api from "@services/api";

export async function deletePassenger(id: number) {
  const api = await Api.getInstance();
  await api.delete({
    url: `/passenger/${id}`,
  });
}

