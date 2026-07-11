import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { shareContent, getSharedContent } from "../controller/share.js";
const router = express.Router();
router.post("/share", authMiddleware, shareContent);
router.get("/share/:shareLink", getSharedContent);
export default router;
//# sourceMappingURL=shareRouter.js.map