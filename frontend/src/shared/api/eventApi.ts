import { api } from "./http";
import type { Event } from "../types/Event";

export const fetchEvents = () => 
    api<Event[]>("/event");

export const fetchEventById = (id: number) => 
    api<Event>(`/event/${id}`);