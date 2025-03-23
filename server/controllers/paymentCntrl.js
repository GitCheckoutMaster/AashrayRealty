import asyncHandler from 'express-async-handler'
import Razorpay from 'razorpay'

export const createPayment = asyncHandler(async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZOR_PAY_KEY,
      key_secret: process.env.RAZOR_PAY_SECRET,
    });
    const options = req.body;

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: 'Order not created' });
    }

    return res.status(200).json(order);

  } catch (error) {
    // console.log("here", error);
    throw error
  }
})