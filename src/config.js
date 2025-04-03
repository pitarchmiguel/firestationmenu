const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://firestationmenu.vercel.app'  // Tu URL de Vercel
    : 'http://localhost:3000'
};

export default config; 