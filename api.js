// src/utils/api.js
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach JWT from localStorage to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('barakah_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap error messages from the API
api.interceptors.response.use(
  res  => res,
  err  => {
    const message = err.response?.data?.error || 'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

// ── Algerian cities ──────────────────────────────────────────────
export const ALGERIA_CITIES = [
  'Adrar','Ain Defla','Ain Témouchent','Alger','Annaba','Batna','Béjaïa',
  'Biskra','Blida','Bordj Bou Arréridj','Bouira','Boumerdès','Chlef',
  'Constantine','Djelfa','El Bayadh','El Eulma','El Oued','El Tarf',
  'Ghardaïa','Guelma','Illizi','Jijel','Khenchela','Laghouat','Mascara',
  'Médéa','Mila','Mostaganem','Msila','Naâma','Oran','Ouargla','Relizane',
  'Saïda','Sétif','Sidi Bel Abbès','Skikda','Souk Ahras','Tébessa','Tiaret',
  'Tindouf','Tipaza','Tissemsilt','Tizi Ouzou','Tlemcen',
];

export default api;
