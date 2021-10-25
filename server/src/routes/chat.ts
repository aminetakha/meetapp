import { Router } from "express";
import { getUserConversations, getChatMessages } from "../controllers/chat";
import multer from 'multer';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, req.body.filename);
	},
});
const upload = multer({ storage });
const router = Router();

router.get('/:id', async (req, res) => {
    try {
        const conversations = await getUserConversations(req.params.id);
        res.status(200).json({conversations})
    } catch (err) {
        console.log(err)
        res.status(400).json({err})
    }
})

router.get("/messages/:sender/:receiver", async (req, res) => {
    try {
        const {sender, receiver} = req.params;
        const {page, items} = req.query;
        const conversations = await getChatMessages(sender, receiver, parseInt(page as string), parseInt(items as string));
        res.status(200).json({conversations})
    } catch (err) {
        res.status(400).json({err})
    }
})

router.post("/upload-audio", upload.single("audio"), async (req, res) => {
    console.log("AUDIO FILE", req.body.filename)
    res.end("OK")
})

export default router;
