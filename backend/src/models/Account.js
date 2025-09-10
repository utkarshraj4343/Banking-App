
import mongoose from "mongoose";

//Thr Transaction schrma is an embedded document 
const transactionSchema= new mongoose.Schema({
    txnId: {
        type: String,
        required: true,
        unique: true,
    },
    type:{
        type: String,
        enum: ["deposit", "withdraw", "transfer"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    timestamp:{
        type: Date,
        default: Date.now,
    },
    status:{
        type: String,
        enum:["success", "failed", "pending"],
        default : "success",
    },

    
})
//The main Account Schema 

const accountSchema = new mongoose.Schema({
    accountNumber:{
        type: String,
        required: true,
        unique: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    balance:{
        type : Number ,
        required: true,
        default : 0 
    },
    status :{
        type : String  ,
        enum :["active", "closed", "frozen"],
        default : "active"
    },
    transactions: [transactionSchema],// The embedde array of transaction 

});

export const Account =mongoose.model("Account", accountSchema); 
export const Transaction = mongoose.model("Transaction ", transactionSchema)