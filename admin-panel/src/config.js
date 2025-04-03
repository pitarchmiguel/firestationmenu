const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://firestationmenu.vercel.app/api'  // URL de producción
    : 'http://localhost:3000/api'  // URL de desarrollo
};

export default config; 