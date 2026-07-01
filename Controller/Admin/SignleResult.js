const SingleresultModal = require("../../Model/Admin/SignleResult");
class SingleResults {
  

  async singleresults(req, res) {
    try {
      let {
        SResultCategory,
        SResultSubCategory,
        SPlayername,
        SPosition,
        SCompany,
      } = req.body;

      const newresults = new SingleresultModal({
        SResultCategory,
        SResultSubCategory,
        SPlayername,
        SPosition,
        SCompany,
      });
      newresults.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }
  // get method
  async getsingleresults(req, res) {
    try {
      const getsingleresults = await SingleresultModal.find({});
      if (getsingleresults) {
        return res.status(200).json({ getsingleresults: getsingleresults });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //delete method
  async Deletesresults(req, res) {
    try {
      const deletesresults = req.params.Id;
      await SingleresultModal.deleteOne({ _id: deletesresults });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }
  //update method
  async editsresults(req, res) {
    let {
      id,
      SResultCategory,
      SResultSubCategory,
      SPlayername,
      SPosition,
      SCompany,
    } = req.body;
    let obj = {};
    if (SResultCategory) {
      obj["SResultCategory"] = SResultCategory;
    }
    if (SResultSubCategory) {
      obj["SResultSubCategory"] = SResultSubCategory;
    }
    if (SPlayername) {
      obj["SPlayername"] = SPlayername;
    }

    if (SPosition) {
      obj["SPosition"] = SPosition;
    }
    if (SCompany) {
      obj["SCompany"] = SCompany;
    }

    try {
      let data = await SingleresultModal.findByIdAndUpdate(
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

const SingleresultController = new SingleResults();
module.exports = SingleresultController;
