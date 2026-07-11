import { z } from "zod";
export const createContentSchema = z.object({
    title: z.string().trim().min(1),
    link: z.url(),
    type: z.enum(["image", "video", "article", "tweet"]),
});
export const deleteContentSchema = z.object({
    contentId: z.string(),
});
//# sourceMappingURL=content.schema.js.map