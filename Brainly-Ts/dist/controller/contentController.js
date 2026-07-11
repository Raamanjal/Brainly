import { Types } from "mongoose";
import { content } from "../model/Content.js";
export const createContent = async (req, res) => {
    try {
        const { link, title, type } = req.body;
        if (!req.userid) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const newContent = await content.create({
            link,
            title,
            type,
            userid: req.userid,
            tags: req.body.tags?.map((tag) => new Types.ObjectId(tag)) || [],
        });
        return res.status(201).json({
            success: true,
            message: "Content added successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getContent = async (req, res) => {
    try {
        const userId = req.userid;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userContent = await content
            .find({ userid: userId })
            .populate("tags", "title")
            .lean()
            .exec();
        return res.status(200).json({ userContent });
    }
    catch (error) {
        console.error("Failed to get content:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const deleteContent = async (req, res) => {
    try {
        const contentId = req.body.contentId;
        await content.deleteMany({
            _id: contentId,
            userId: req.userid
        });
        res.json({
            message: "Deleted"
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
//# sourceMappingURL=contentController.js.map