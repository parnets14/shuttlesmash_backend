const KeyhighlightModal = require("../../Model/Admin/KeyHighlights");

class Keyhighlight {
  // post method
  async keyhighlight(req, res) {
    try {
      let { KeyhighlightTitle, KeyhighlightDesc } = req.body;
      let file = req.files[0]?.filename;

      const newkeyhighlight = new KeyhighlightModal({
        KeyhighlightTitle,
        KeyhighlightDesc,
        KeyhighlightImage: file,
      });
      newkeyhighlight.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }
  // get method
  async getkeyhighlight(req, res) {
    try {
      const getkeyhighlight = await KeyhighlightModal.find({});
      if (getkeyhighlight) {
        return res.status(200).json({ getkeyhighlight: getkeyhighlight });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //delete method
  async Deletekeyhighlight(req, res) {
    try {
      const deletekeyhighlight = req.params.Id;
      await KeyhighlightModal.deleteOne({ _id: deletekeyhighlight });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }
  //update method
  async editkeyhighlight(req, res) {
    let { id, KeyhighlightTitle, KeyhighlightDesc } = req.body;
    let file = req.files[0]?.filename;
    let obj = {};
    if (KeyhighlightTitle) obj["KeyhighlightTitle"] = KeyhighlightTitle;
    if (KeyhighlightDesc)  obj["KeyhighlightDesc"]  = KeyhighlightDesc;
    if (file)              obj["KeyhighlightImage"] = file;

    try {
      let data = await KeyhighlightModal.findByIdAndUpdate(
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

const KeyhighlightController = new Keyhighlight();
module.exports = KeyhighlightController;
