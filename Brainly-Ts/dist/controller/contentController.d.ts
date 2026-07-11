import type { Request, Response } from "express";
interface ContentBody {
    link: string;
    title: string;
    type: "image" | "video" | "article" | "audio" | "tweet";
    tags?: string[];
}
export declare const createContent: (req: Request<{}, {}, ContentBody>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getContent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteContent: (req: Request, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=contentController.d.ts.map