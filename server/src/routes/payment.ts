import { Router } from "express";
import { getOrCreateCustomer } from "../controllers/user/user";
const router = Router();
import Stripe from "stripe";

router.post("/payment-sheet", async (req, res) => {
    const { userId } = req.body;
    const stripe = new Stripe("sk_test_51HgXS9AM0fYeg1Kd3UInSAKEkdySDyetIdEEpZaRjm14zD2fjX1YXpLInraFXEjkRo8xtAU8JKNdE4gM0gpRCQya00n6UHYx5j", {
        apiVersion: "2020-08-27",
    });
    const customer = await getOrCreateCustomer(userId);

    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: "2020-08-27" }
    );
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 300,
        currency: "usd",
        customer: customer.id
    });

    res.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id
    });
});

export default router;
