import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { upload, uploadBufferToCloudinary } from "../middleware/upload.js";

const router = Router();

router.post("/", requireAuth, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Upload file is required" });
    }

    const folder = req.body.folder || "yogini-planters";
    const result = await uploadBufferToCloudinary(req.file, folder);

    return res.status(201).json({
      publicId: result.public_id,
      url: result.secure_url,
      resourceType: result.resource_type,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
