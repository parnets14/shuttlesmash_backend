const GeneralModel = require("../../Model/User/GeneralEnquiry");

class General {
  // post method
  async general(req, res) {
    try {
      let { GUName, GUPhone, GUEmail, GUMessage, QueryStatus } = req.body;

      const newgeneral = new GeneralModel({
        GUName,
        GUPhone,
        GUEmail,
        GUMessage,
        QueryDate: new Date().toISOString(),
        QueryStatus: QueryStatus || "Pending",
      });
      newgeneral.save().then((data) => {
        return res.status(200).json({ success: "Enquiry Sent Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }
  // get method
  async getgeneral(req, res) {
    try {
      let getgeneral = await GeneralModel.find().sort({_id: -1});
      return res.status(200).send({getgeneral: getgeneral});

    } catch (error) {
      console.log(error);
    }
  }


  //delete method
  async DeleteGeneral(req, res) {
    try {
      const deletegeneral = req.params.Id;
      await GeneralModel.deleteOne({ _id: deletegeneral });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }


 
}

const generalController = new General();
module.exports = generalController;
