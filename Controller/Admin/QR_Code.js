const QrcodeModel = require("../../Model/Admin/QR_Code");

class Qrcode {
  // post method
  async qrcode(req, res) {
    try {
      let { QrcodeImage} = req.body;
      let file = req.files[0]?.filename;

      const newqrcode = new QrcodeModel({
        QrcodeImage: file,
      });
      newqrcode.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }
  // get method
  async getqrcode(req, res) {
    try {
      const getqrcode = await QrcodeModel.find({});
      if (getqrcode) {
        return res.status(200).json({ getqrcode: getqrcode });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //delete method
  async Deleteqrcode(req, res) {
    try {
      const deleteqrcode = req.params.Id;
      await QrcodeModel.deleteOne({ _id: deleteqrcode });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }
  //update method
  async editqrcode(req, res) {
    let { id, QrcodeImage,} = req.body;
    let file = req.files[0]?.filename;
    let obj = {};
 
    if (file) {
      obj["QrcodeImage"] = file;
    }

    try {
      let data = await QrcodeModel.findByIdAndUpdate(
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

const qrcodeController = new Qrcode();
module.exports = qrcodeController;
