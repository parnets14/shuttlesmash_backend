const EventbannerModel = require("../../Model/Admin/EventBanner");

class Eventbanner {
  // post method
  async eventbanner(req, res) {
    try {
      let { EventbannerImage, EventbannerTitle } = req.body;
      let file = req.files[0]?.filename;

      const neweventbanner = new EventbannerModel({
        EventbannerTitle,
        EventbannerImage: file,
      });
      neweventbanner.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }
  // get method
  async geteventbanner(req, res) {
    try {
      const geteventbanner = await EventbannerModel.find({});
      if (geteventbanner) {
        return res.status(200).json({ geteventbanner: geteventbanner });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //delete method
  async Deleteeventbanner(req, res) {
    try {
      const deleteeventbanner = req.params.Id;
      await EventbannerModel.deleteOne({ _id: deleteeventbanner });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }
  //update method
  async editeventbanner(req, res) {
    let { id, EventbannerImage, EventbannerTitle } = req.body;
    let file = req.files[0]?.filename;
    let obj = {};
    if (EventbannerTitle) {
      obj["EventbannerTitle"] = EventbannerTitle;
    }
    if (file) {
      obj["EventbannerImage"] = file;
    }
    try {
      let data = await EventbannerModel.findByIdAndUpdate(
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

const eventbannerController = new Eventbanner();
module.exports = eventbannerController;
