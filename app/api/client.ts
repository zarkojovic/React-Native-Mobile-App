import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_URL;
console.log("API_URL", baseURL);
const client = axios.create({ baseURL });

export default client;
