import { api } from "./http";
import type { Event, EventRequest } from "../types/Event";

export const fetchEvents = (): Promise<Event[]> => 
    api<Event[]>("/event");

export const fetchEventById = (id: number): Promise<Event> => 
    api<Event>(`/event/${id}`);

export const createEvent = (event: EventRequest): Promise<Event> =>
    api<Event>("/event", {
        method: "POST",
        body: JSON.stringify(event),
    });

export const updateEvent = (id: number, event: EventRequest): Promise<void> =>
    api<void>(`/event/${id}`, {
        method: "PUT",
        body: JSON.stringify(event),
    });

export const deleteEvent = (id: number): Promise<void> =>
    api<void>(`/event/${id}`, {
        method: "DELETE",
    });

export const uploadEventImage = (Id: number, file: File) => {
    const formData = new FormData();
    formData.append("id", Id.toString());
    formData.append("imageFile", file);
    return api<{ imageUrl: string }>("/event/upload-image", {
        method: "POST",
        body: formData,
    });
};