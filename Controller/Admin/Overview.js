const OverviewModal = require("../../Model/Admin/Overview");

class Overview {
  // post method
  async overview(req, res) {
    try {
      let { OverviewTitle, OverviewDesc } = req.body;
      let file = req.files[0]?.filename;

      const newoverview = new OverviewModal({
        OverviewTitle,
        OverviewDesc,
        OverviewImage: file,
      });
      newoverview.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }
  // get method
  async getoverview(req, res) {
    try {
      const getoverview = await OverviewModal.find({});
      if (getoverview) {
        return res.status(200).json({ getoverview: getoverview });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //delete method
  async Deleteoverview(req, res) {
    try {
      const deleteoverview = req.params.Id;
      await OverviewModal.deleteOne({ _id: deleteoverview });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }
  //update method
  async editoverview(req, res) {
    let { id, OverviewTitle, OverviewDesc } = req.body;
    let file = req.files[0]?.filename;
    let obj = {};
    if (OverviewTitle) obj["OverviewTitle"] = OverviewTitle;
    if (OverviewDesc)  obj["OverviewDesc"]  = OverviewDesc;
    if (file)          obj["OverviewImage"] = file;

    try {
      let data = await OverviewModal.findByIdAndUpdate(
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

const OverviewController = new Overview();
module.exports = OverviewController;
