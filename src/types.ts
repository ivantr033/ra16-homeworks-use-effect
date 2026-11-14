export interface UserItem {
    id: number;
    name: string;
}

export interface UserDetailsData extends UserItem {
    avatar: string;
    details: {
        city: string;
        company: string;
        position: string;
    };
}
