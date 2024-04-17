import mongoose ,{Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscription: {
        type: Schema.Types.ObjectId,
        ref : "User"
    },
    channel:{
        type: String,
        ref : "User"
    }
}, { timestamps: true});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);