const PartnerModel = require("../../Model/Admin/Partner");

class Partner {
  // post method
  async partner(req, res) {
    try {
      let { PartnerImage,PartnerLink } = req.body;
      let file = req.files[0]?.filename;

      const newpartner = new PartnerModel({
        PartnerImage: file,
        PartnerLink
      });
      newpartner.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }
  // get method
  async getpartner(req, res) {
    try {
      const getpartner = await PartnerModel.find({});
      if (getpartner) {
        return res.status(200).json({ getpartner: getpartner });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //delete method
  async Deletepartner(req, res) {
    try {
      const deletepartner = req.params.Id;
      await PartnerModel.deleteOne({ _id: deletepartner });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }
  //update method
  async editpartner(req, res) {
    let { id, PartnerImage,PartnerLink } = req.body;
    let file = req.files[0]?.filename;
    let obj = {};

    if (file) {
      obj["PartnerImage"] = file;
    }
    if (PartnerLink) {
      obj["PartnerLink"] = PartnerLink;
    }
    try {
      let data = await PartnerModel.findByIdAndUpdate(
        { _id: id },
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

const partnerController = new Partner();
module.exports = partnerController;
