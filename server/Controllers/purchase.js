const Razorpay=require('razorpay');
const Order=require('../models/orders');
//process.env.RAZORPAY_KEY_ID

exports.purchasePremium=async(req,res,next)=>{
    try {
        var rzp=new Razorpay({
            key_id:'rzp_test_04pgWxMlA4eT2j',
            key_secret:'FbJJE7txf04BAcYdA5IuImDu'
        })
        const amount=250
        rzp.orders.create({amount,currency:"INR"},(err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderId:order.id,status:'PENDING'})
            .then(()=>{
                return res.status(201).json({order,key_id:rzp.key_id})
            })
            .catch(err=>{
                throw new Error(err);
            })
        })
    } catch (err) {
        console.log(err);
        return res.status(403).json({message:'SOmething went wrong',error:err});
    }
}
// exports.updateTransaction=async(req,res,next)=>{
//     const{payment_id,order_id}=req.body;
//     try {
//         const order=await Order.findOne({where:{orderId:order_id,}})
//         await order.update({paymentId:payment_id,status:'Successful'});
//         await req.user.update({isPremiumUser:true});
//         return res.status(202).json({success:true,message:"Transaction Successfull"})
//     } catch (error) {
//         throw new Error(error);
//     }

// }
exports.updateTransaction = async (req, res, next) => {
    const { payment_id, order_id } = req.body;
    console.log(payment_id);

    try {
        // Validate inputs and check if the order exists
        if ( !order_id) {
            return res.status(400).json({ success: false, message: "Invalid input data" });
        }

        const order = await Order.findOne({ where: { orderId: order_id } });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Define two update promises
        const updateOrderPromise = order.update({ paymentId: payment_id, status: 'Successful' });
        const updateUserPromise = req.user.update({ isPremiumUser: true });

        // Use Promise.all to run both updates concurrently
        await Promise.all([updateOrderPromise, updateUserPromise]);

        // Respond with success
        return res.status(202).json({ success: true, message: "Transaction Successful" });
    } catch (error) {
        // Express will handle the error
        next(error);
    }
};

// const Razorpay = require('razorpay');
// const Order = require('../models/orders');
// const path = require('path');

// exports.purchasePremium = async (req, res, next) => {
//     try {
//         const rzp = new Razorpay({
//             key_id: 'rzp_test_04pgWxMlA4eT2j',
//             key_secret: 'FbJJE7txf04BAcYdA5IuImDu'
//         });

//         const amount = 250;

//         // Create the order using async/await
//         const order = await rzp.orders.create({ amount, currency: 'INR' });

//         // Create an order record in your database (assuming you have a model for it)
//         const createdOrder = await req.user.createOrder({
//             orderId: order.id,
//             status: 'PENDING'
//         });

//         return res.status(201).json({ order: createdOrder, key_id: rzp.key_id });
//     } catch (err) {
//         console.error(err);
//         return res.status(403).json({ message: 'Something went wrong', error: err.message });
//     }
// };
