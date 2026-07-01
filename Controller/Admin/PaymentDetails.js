const PaymentModel = require("../../Model/Admin/PaymentDetails");

class Payment {
  // post method
  async payment(req, res) {
    try {
      let {
        userId,
        AccountHolderName,
        TransactionID,
        AccountNumber,
        PaidAmount,
        Remarks,
      } = req.body;
      const newpayment = new PaymentModel({
        userId,
        AccountHolderName,
        TransactionID,
        AccountNumber,
        PaidAmount,
        Remarks,
      });
      newpayment.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }


  // get method 
  async getpayment(req, res) {
    
    try {
      let getpayment = await PaymentModel.find().populate("userId").sort({_id: -1});
        return res.status(200).json({ getpayment: getpayment });
      }
     catch (error) {
      console.log(error);
    }
  }

     // get method by id
     async getbookingById(req, res) {
      let id = req.params.id
      try {
        let getpayment = await PaymentModel.find({userId:id});
        return res.status(200).send({ getpayment: getpayment });
      } catch (error) {
        console.log(error);
      }
    }
  

  //delete method
  async Deletepayment(req, res) {
    try {
      const deletepayment = req.params.Id;
      await PaymentModel.deleteOne({ _id: deletepayment });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }

    //update method
    async editpayment(req, res) {
      let { 
        userId,
        AccountHolderName,
        TransactionID,
        AccountNumber,
        PaidAmount,
        Remarks, } = req.body;
      let obj = {};
      
      if (AccountHolderName) {
        obj["AccountHolderName"] = AccountHolderName;
      }
  
      if (TransactionID) {
        obj["TransactionID"] = TransactionID;
      }
  
      if (AccountNumber) {
        obj["AccountNumber"] = AccountNumber;
      }
  
      if (PaidAmount) {
        obj["PaidAmount"] = PaidAmount;
      }
      if (Remarks) {
        obj["Remarks"] = Remarks;
      }
      try {
        let data = await PaymentModel.findByIdAndUpdate(
          { _id: userId },
          { $set: obj },
          { new: true }
        );
        if (!data) return res.status(400).json({ error: "Data not found" });
        return res.status(200).json({ success: "Successfully Updated" });
      } catch (error) {
        console.log(error);
      }
    }
 
}

const PaymentController = new Payment();
module.exports = PaymentController;
