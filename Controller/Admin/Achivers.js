const AchiversModel = require("../../Model/Admin/Achivers");

class Achivers {
  // post method
  async achivers(req, res) {
    try {
      let { AchiversImage, AchiversText } = req.body;
      let file = req.files[0]?.filename;

      const newachivers = new AchiversModel({
        AchiversText,
        AchiversImage: file,
      });
      newachivers.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }
  // get method
  async getachivers(req, res) {
    try {
      const getachivers = await AchiversModel.find({});
      if (getachivers) {
        return res.status(200).json({ getachivers: getachivers });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //delete method
  async Deleteachivers(req, res) {
    try {
      const deleteachivers = req.params.Id;
      await AchiversModel.deleteOne({ _id: deleteachivers });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }
  //update method
  async editachivers(req, res) {
    let { id, AchiversImage, AchiversText } = req.body;
    let file = req.files[0]?.filename;
    let obj = {};
    if (AchiversText) {
      obj["AchiversText"] = AchiversText;
    }
    if (file) {
      obj["AchiversImage"] = file;
    }
    try {
      let data = await AchiversModel.findByIdAndUpdate(
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

const achiversController = new Achivers();
module.exports = achiversController;
