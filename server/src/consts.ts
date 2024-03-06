
const IP_ADDR = process.env.IP_ADDR || 'localhost';
const API_PORT = process.env.API_PORT || 8080;
const api_url = process.env.NODE_ENV === 'development' ? '' : `http://${IP_ADDR}:${API_PORT}`;

export {
    api_url,
}