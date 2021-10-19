import { Router } from "express";
const router = Router();

const PUBLISHABLE_KEY = "pk_test_51HgXS9AM0fYeg1Kdd2cM4tI74MmHu7ZBHxiQVqOgziZfDYnQGkFbzL9oH4Z5IUYv8dh60BujZWa54tGAh902lzRR00MmVwHQVn"

router.get("/", (_, res) => {
    res.json({publishableKey: PUBLISHABLE_KEY})
});

export default router;
