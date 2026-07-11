import { z } from "zod";
export const signupSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username cannot exceed 20 characters"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password is too long"),
});
export const loginSchema = z.object({
    username: z.string().trim(),
    password: z.string(),
});
//# sourceMappingURL=auth.schema.js.map