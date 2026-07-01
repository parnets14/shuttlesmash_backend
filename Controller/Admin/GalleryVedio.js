const GalleryvedioModel = require("../../Model/Admin/GalleryVedio");

class GalleryVedio {
  // post method
  async galleryvedio(req, res) {
    try {
      let { GalleryVedioTitle, GalleryVedio } = req.body;
      let file = req.files[0]?.filename;

      const newgalleryvedio = new GalleryvedioModel({
        GalleryVedioTitle,
        GalleryVedio: file,
      });
      newgalleryvedio.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }
  // get method
  async getgalleryvedio(req, res) {
    try {
      const getgalleryvedio = await GalleryvedioModel.find({});
      if (getgalleryvedio) {
        return res.status(200).json({ getgalleryvedio: getgalleryvedio });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //delete method
  async Deletegalleryvedio(req, res) {
    try {
      const deletegalleryvedio = req.params.Id;
      await GalleryvedioModel.deleteOne({ _id: deletegalleryvedio });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }
  //update method
  async editgalleryvedio(req, res) {
    let { id, GalleryVedioTitle, GalleryVedio } = req.body;
    let file = req.files[0]?.filename;
    let obj = {};
    if (GalleryVedioTitle) {
      obj["GalleryVedioTitle"] = GalleryVedioTitle;
    }
    if (file) {
      obj["GalleryVedio"] = file;
    }

    try {
      let data = await GalleryvedioModel.findByIdAndUpdate(
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

const GalleryvedioController = new GalleryVedio();
module.exports = GalleryvedioController;
