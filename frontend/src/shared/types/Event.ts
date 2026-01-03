export interface Event {
    id: number;
    title: string;
    location: string | null;
    date: string;
    description: string | null;
    detail: string | null;
    status: string;
    imageUrl: string | null;
}