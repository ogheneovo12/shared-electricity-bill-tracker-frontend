const BASE_API_DOMAIN = process.env.VITE_APP_BASE_DOMAIN || "http://localhost:4500"
export const APP_CONFIG ={
 BASE_API_DOMAIN,
 BASE_API_URL:`${BASE_API_DOMAIN}/api/v1`
}