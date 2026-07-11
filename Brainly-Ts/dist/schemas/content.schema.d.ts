import { z } from "zod";
export declare const createContentSchema: z.ZodObject<{
    title: z.ZodString;
    link: z.ZodURL;
    type: z.ZodEnum<{
        image: "image";
        video: "video";
        article: "article";
        tweet: "tweet";
    }>;
}, z.core.$strip>;
export declare const deleteContentSchema: z.ZodObject<{
    contentId: z.ZodString;
}, z.core.$strip>;
export type CreateContentBody = z.infer<typeof createContentSchema>;
export type DeleteContentBody = z.infer<typeof deleteContentSchema>;
//# sourceMappingURL=content.schema.d.ts.map