import { Router } from "express";
import { getActiveUsers, updateProfileImage, updateUsernameAndAbout, updateUserProfile } from "../controllers/user/user";
import { findUserById } from "../controllers/auth/index";
import multer from 'multer';
import { v4 as uuidv4 } from "uuid";
import { UserInfo } from "../types/UserInfo";
import { Filters } from "../types/Filters";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/uploads/");
	},
	filename: (req, file, cb) => {
		const ext = file.originalname.split(".").reverse()[0];
		cb(null, uuidv4() + "." + ext);
	},
});
const upload = multer({ storage });

const router = Router();

router.get("/", async (req, res) => {
    const {gender, country, minAge, maxAge, status, page, items} = req.query;
    const filters: Filters = {
        gender: gender as string,
        country: country as string,
        minAge: parseInt(minAge as string),
        maxAge: parseInt(maxAge as string),
        status: status === "online"? true : false,
        page: parseInt(page as string),
        itemsPerPage: parseInt(items as string)
    }
    const users = await getActiveUsers(filters);
    res.json({users})
})

router.get("/:id", async (req, res) => {
    const {id} = req.params;
    const user = await findUserById(id);
    res.status(200).json({user});
})

router.put("/", upload.single('photo'), async (req, res) => {
    try {
        const user = await updateProfileImage(req.body.providerId, req.file.filename);
        res.status(200).json({user})
    } catch (err) {
        res.status(500).json({err})
    }
})

router.patch("/default", async (req, res) => {
    try {
        const user = await updateProfileImage(req.body.providerId, "avatar.jpg");
        res.status(200).json({user})
    } catch (err) {
        res.status(500).json({err})
    }
})

router.put("/info", async (req, res) => {
    try {
        const data = req.body.user as UserInfo;
        const user = await updateUserProfile(data);
        res.status(200).json({user})
    } catch (err) {
        res.status(500).json({err})
    }
})

router.put("/username-about", async (req, res) => {
    try {
        const data = req.body.user;
        const user = await updateUsernameAndAbout(data);
        res.status(200).json({user})
    } catch (err) {
        res.status(500).json({err})
    }
})

router.patch("/tokens", async (req, res) => {
    const {id, tokens} = req.body;
    try {
        const user = await findUserById(id);
        user.tokens = tokens;
        await user.save();
        res.status(200).json({user})
    } catch (err) {
        res.status(500).json({err})
    }
})

export default router;
