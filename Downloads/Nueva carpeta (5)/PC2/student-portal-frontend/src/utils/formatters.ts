export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString; // Retorna el string original si hay error
  }
};