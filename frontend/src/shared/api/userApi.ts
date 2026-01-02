import { getToken } from "../../features/auth/authStorage";
import type { User, UpdateUserRequest, ChangePasswordRequest } from "../types/User";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchUserById = async (id: number): Promise<User> => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/User/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    return response.json();
};

export const updateUser = async (id: number, data: UpdateUserRequest): Promise<void> => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/User/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
    }
};

export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/User/ChangePassword`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
    }
};