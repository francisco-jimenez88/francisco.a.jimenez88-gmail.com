const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    resetToken: String,
    expirationToken: Date,
    wishlist: [{
        candyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candy"
        }
    }],
    cart: [{
        candyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candy"
        }
    }],
    userinfo: [{
        lastname: { type: String },
        phonenumber: { type: Number },
        address: { type: String },
        city: { type: String },
        zip: { type: Number }
    }]
});

// Lägg till produkt till wishlist
userSchema.methods.addToWishList = function (candy) {
    this.wishlist.push({ candyId: candy._id })
    const newWishlist = this.wishlist.filter(function ({ candyId }) {

        return !this.has(`${candyId}`) && this.add(`${candyId}`)
    }, new Set)
    this.wishlist = [...newWishlist]
    return this.save();
}

// Ta bort produkt från wishlist
userSchema.methods.removeFromList = function (candyId) {
    const restOftheProducts = this.wishlist.filter(candy =>
        candy.candyId.toString() !== candyId.toString()
    );
    this.wishlist = restOftheProducts;
    return this.save();
}

userSchema.methods.addTocart = function (candy) {
    this.cart.push({ candyId: candy._id })
    const newcart = this.cart.filter(function ({ candyId }) {

        return !this.has(`${candyId}`) && this.add(`${candyId}`)
    }, new Set)
    this.cart = [...newcart]
    return this.save();
}

// Ta bort produkt från cart
userSchema.methods.removeFromList = function (candyId) {
    const restOftheProducts = this.cart.filter(candy =>
        candy.candyId.toString() !== candyId.toString()
    );
    this.cart = restOftheProducts;
    return this.save();
}

const User = mongoose.model("User", userSchema);
module.exports = User;