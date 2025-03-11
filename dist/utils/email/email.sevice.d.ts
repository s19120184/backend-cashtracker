interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
}
export declare class EmailService {
    private trasporter;
    constructor();
    sendEmail(options: SendMailOptions): Promise<boolean>;
    sendEmailWithToken(to: string | string[], user: String, token: string): Promise<boolean>;
}
export {};
