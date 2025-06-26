/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Un morado vibrante
        secondary: '#EDF2F7', // Gris claro para fondos
        accent: '#38A169', // Verde para éxito
        danger: '#E53E3E', // Rojo para errores
      },
    },
  },
  plugins: [],
}