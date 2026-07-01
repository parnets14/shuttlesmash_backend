const BrochuresModal = require("../../Model/Admin/Brochures");

class Brochures {
  // post method
  async brochures(req, res) {
    try {
      let { Brochure } = req.body;
      let file = req.files[0]?.filename;

      const newbrochures = new BrochuresModal({
        Brochure: file,
      });
      newbrochures.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }
  // get method
  async getbrochures(req, res) {
    try {
      const getbrochures = await BrochuresModal.find({});
      if (getbrochures) {
        return res.status(200).json({ getbrochures: getbrochures });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //delete method
  async Deletebrochures(req, res) {
    try {
      const deletebrochures = req.params.Id;
      await BrochuresModal.deleteOne({ _id: deletebrochures });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }
  //update method
  async editbrochures(req, res) {
    let { id, Brochure } = req.body;
    let file = req.files[0]?.filename;
    let obj = {};

    if (file) {
      obj["Brochure"] = file;
    }
    try {
      let data = await BrochuresModal.findByIdAndUpdate(
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

const BrochuresController = new Brochures();
module.exports = BrochuresController;
