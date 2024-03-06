
const IP_ADDR = process.env.IP_ADDR || 'localhost';
const API_PORT = process.env.API_PORT || 8080;
// http://164.92.235.193:4000/api/v1/
const api_url = process.env.NODE_ENV === 'development' ? '' : `http://164.92.235.193:4000`;

export {
    api_url,
}