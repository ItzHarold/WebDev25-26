export interface Team {
    id: number;
    description: string | null;
    imageUrl: string | null;
    points: number;
    managerId: number;
}

export interface TeamRequest {
    description: string | null;
    imageUrl: string | null;
    points: number;
    managerId: number;
}
