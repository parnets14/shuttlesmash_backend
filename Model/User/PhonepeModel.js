const mongoose = require("mongoose");

const phonepaytransaction = new mongoose.Schema(
    {
       userId: {
        type: String,
        index: true
       },      
       email:{ 
         type: String,
       },
       username:{
           type:String
       },
       Mobile: {
        type: Number,
      },
      orderId:{
          type:String,
          index: true
      },
      amount:{
          type:Number,
          default:0
      },
      transactionid: {
        type: String,
        index: true
      },
      transactionStatus:{
        type:String,
        default:"CR",
        index: true
      },
      successUrl:{
        type:String
      },
      failedUrl:{
        type:String
      },
      config:{
        type: mongoose.Schema.Types.Mixed
      },
      status: {type: String, 
        default: "InProgress",
        index: true
      }, 
    },
    { timestamps: true }
);

// Compound indexes for common queries
phonepaytransaction.index({ userId: 1, status: 1 });
phonepaytransaction.index({ transactionid: 1, userId: 1 });

const PhonepeModel = mongoose.model("teachertransaction", phonepaytransaction);
module.exports = PhonepeModel;