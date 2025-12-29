declare const _default: () => {
    port: number;
    database: {
        type: string;
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        entities: string[];
        synchronize: boolean;
        logging: boolean;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    redis: {
        host: string;
        port: number;
        password: string | undefined;
    };
    cors: {
        origin: string;
    };
};
export default _default;
