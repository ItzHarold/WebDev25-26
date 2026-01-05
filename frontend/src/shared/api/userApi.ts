import { api} from "./http";
import type { User, UpdateUserRequest, ChangePasswordRequest } from "../types/User";

export const fetchUserById = (id: number) => 
    api<User>(`/User/${id}`);

export const updateUser = (id: number, data: UpdateUserRequest) =>
    api<void>(`/User/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

export const changePassword = (data: ChangePasswordRequest) =>
    api<void>("/User/ChangePassword", {
        method: "PUT",
        body: JSON.stringify(data),
    });

export const uploadProfilePicture = (id: number, file: File) => {
    const formData = new FormData();
    formData.append("imageFile", file);
    return api<{ imageUrl: string }>(`/user/${id}/upload-profile-picture`, {
        method: "POST",
        body: formData,
    });
};