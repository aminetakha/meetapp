import { Router } from "express";
import { createUser, findUserByProviderId } from "../controllers/auth";
import multer from 'multer';
import { v4 as uuidv4 } from "uuid";

const router = Router();
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

router.post("/", upload.single('photo'), async (req, res) => {
    const image = req.file.filename;
    const user = {...JSON.parse(req.body.data), image}
    const result = await createUser(user)
    if("error" in result){
        res.status(400).json({error: result.error})
    }else{
        res.status(200).json({user: result})
    }
})

router.get('/:providerId', async (req, res) => {
    try {
        const user = await findUserByProviderId(req.params.providerId);
        res.status(200).json({user})
    } catch (err) {
        res.status(404).json({err: "User not found"})
    }
})

export default router;
