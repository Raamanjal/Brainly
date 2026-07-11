import type { Request, Response } from "express";
interface SignupBody {
    username: string;
    password: string;
}
export declare const signup: (req: Request<{}, {}, SignupBody>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const login: (req: Request<{}, {}, SignupBody>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=auth.d.ts.map