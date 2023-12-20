    const mongoose = require('mongoose');
    const { nanoid } = require('nanoid');
    const { errorCreator } = require('../utils/responseCreator');
    const { Schema, model } = mongoose;

    const userSchema = new Schema({
        username:{
            type: String,
            unique: true,
            required: [true, "username is mandatory"]
        },
        password: {
            type: String,
            unique: true,
            required: [true, "password is mandatory"]
        },
        secret: {
            type: String,
            
        },
        name: {
            type: String,
            required: true
        },
        cart: {
            type: [Object]
        },
        totalValue: {
            type: Number,
            default: 0
        },
        totalCount: {
            type: Number,
            default: 0
        },
        orders: {
            type: [Object],

        }
    });
    // for statics file
    userSchema.statics.createUser = async (userdata) => {
        const data = await userModel.create(userdata);
        return data;
    }
    userSchema.statics.findUser = async (username) => {
        const user = (await userModel.findOne({ username }, { __id: 0, __v: 0, orders: 0 }))?.toObject();
       console.log(user);
        if (!user) {
            const err = new Error('user does not find');
            err.status(404);
            res.send({ success: false, message: err.message });
            throw err;
        }
        return user;
    }

    // for getting the cart items
    userSchema.statics.getCartItems = async (username) => {
        const { cart, totalValue, totalCount } = (await userModel.findOne({ username }, { __id: 0, __v: 0, orders: 0 }))?.toObject();
        if (!cart) {
            const err = new Error('user doest exists');
            err.status = 404;
            res.send({ success: false, message: err.message });
            throw err;
        }
        return { cart, totalValue, totalCount };
    }
// add to cart  items
userSchema.statics.addToCart = async (username, product) => {
    await userModel.findOneAndUpdate({ username }, {
        $push: { cart: { ...product, quantity: 1 } }
    });
    const { cart, totalValue, totalCount } = (await userModel.findOneAndUpdate({ username }, {
        $inc: { totalValue: product.price, totalCount: 1 }
    }, { new: true }))?.toObject();
    return { cart, totalValue, totalCount }
}
// removing from cart
userSchema.statics.removeFromCart = async (username, product) => {
    await userModel.findOneAndUpdate({ username }, {
        $pull: { cart: { "id": product.id } }
    });
    const { cart, totalValue, totalCount } = (await userModel.findOneAndUpdate({ username }, {
        $inc: { totalValue: - (product.price * product.quantity), totalCount: -product.quantity }
    }, { new: true }))?.toObject();
    return { cart, totalValue, totalCount }
}

userSchema.statics.increment = async (username,product,increment=true)=>{
    const factor = increment?1:-1;
    const data = await userModel.findOneAndUpdate({username,"cart.id":product.id},{$inc:{
        totalValue:factor*product.price,
        "cart.$.quantity":factor,
        totalCount:factor
    }
},{new:true})
if(!increment){
    const removeZeroQty = await userModel.findOneAndUpdate({username,"cart.quantity":0},
    {$pull:{cart:{quantity:0}}
    },{new:true});
    if(removeZeroQty){
        return removeZeroQty;
    }
}
return data
}

userSchema.statics.clearCart = async (username)=>{
    const {cart ,totalValue,totalCount } = (await userModel.findOneAndUpdate({username},{$set:{cart:[],totalValue:0,totalCount:0}},{new:true}))?.toObject();
    return {cart ,totalValue,totalCount }
}
  
userSchema.statics.checkOut = async (username)=>{
    const { cart , totalValue,totalCount} = (await userModel.findOne({ username },{__id: 0, __v: 0})).toObject();
    const orderId = nanoid(10);
    const order = {orderId,items:cart,totalValue,totalCount};
    const data = await userModel.updateOne({username},{
        $set:{cart:[],totalValue:0,totalCount:0},
        $push:{orders: order }
    });
    console.log(data);
    if(data.modifiedCount){
        return { order,totalValue,totalCount }
    }
    else{
        errorCreator('Error while placing the order');
    }
}


userSchema.statics.updatePassword = async(username,password)=>{
    return userModel.updateOne({username},{$set:{password}});
}
// for removing the cart items

    const userModel = model('user', userSchema);
    module.exports = userModel; 
   