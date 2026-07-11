import type { Request, Response } from "express";
type AuthRequest = Request & {
    userid?: string;
};
export declare const shareContent: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSharedContent: (req: Request, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=share.d.ts.map