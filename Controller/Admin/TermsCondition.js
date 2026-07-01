const TermsModal = require("../../Model/Admin/TermsCondition");

class Terms {
  // post method
  async terms(req, res) {
    try {
      let {
        Eligibility,
      } = req.body;
      let file = req.files[0]?.filename;

      const newterms = new TermsModal({
        Eligibility,
      });
      newterms.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }
  // get method
  async getterms(req, res) {
    try {
      const getterms = await TermsModal.find({});
      if (getterms) {
        return res.status(200).json({ getterms: getterms });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //delete method
  async Deleteterms(req, res) {
    try {
      const deleteterms = req.params.Id;
      await TermsModal.deleteOne({ _id: deleteterms });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }
  //update method
  async editterms(req, res) {
    let {
      id,
      Eligibility,
    } = req.body;
    let file = req.files[0]?.filename;
    let obj = {};
  
    if (Eligibility) {
      obj["Eligibility"] = Eligibility;
    }
    try {
      let data = await TermsModal.findByIdAndUpdate(
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

const TermsController = new Terms();
module.exports = TermsController;
