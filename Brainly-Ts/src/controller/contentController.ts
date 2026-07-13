import type{ Request, Response } from "express";
import { Types } from "mongoose";
import { content} from "../model/Content.js";


interface ContentBody {
  link: string,
  title: string,
  type: "image" | "video" | "article" | "audio" | "tweet",
  tags?: string[],
}


export const createContent = async (req: Request<{},{},ContentBody>, res: Response) => {

    try {
        const {link, title, type} = req.body ;

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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }

}

export const getContent = async (req: Request, res: Response) => {
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
    } catch (error) {
        console.error("Failed to get content:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteContent = async (req: Request, res: Response) => {
    try {
        const { contentId } = req.params;
        const userId = req.userid;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (typeof contentId !== "string" || !Types.ObjectId.isValid(contentId)) {
            return res.status(400).json({ message: "Invalid content id" });
        }

        const deletedContent = await content.findOneAndDelete({
            _id: contentId,
            userid: userId,
        });

        if (!deletedContent) {
            return res.status(404).json({ message: "Content not found" });
        }

        return res.status(200).json({
            message: "Content deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
