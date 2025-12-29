export interface JwtPayload {
    sub: string;
    iat?: number;
    exp?: number;
    [key: string]: any;
}
export interface MessageNotification {
    id: string;
    title: string;
    desp?: string;
    short?: string;
    tags?: string[];
    sender: {
        id: string;
    };
    organization?: {
        id: string;
    };
    createdAt: Date;
}
