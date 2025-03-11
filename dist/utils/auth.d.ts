export declare const hashPassword: (password: string) => Promise<string>;
export declare const checkPassword: (password: string, passwordDb: string) => Promise<boolean>;
export declare const generateToken: () => string;
