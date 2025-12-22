import axios from "axios";
import { getToken } from "../../features/auth/authStorage";

const API_BASE_URL = "http://localhost:5079";

export const fetchTeams = async () => {
    const token = getToken();

    const response = await axios.get(`${API_BASE_URL}/team`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};