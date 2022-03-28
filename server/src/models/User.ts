export interface User {
    id: string;
    username: string;
    password: string;
    email: string;
    stats: {posts: number, groups: number, chats: number};
    bio: string;
}