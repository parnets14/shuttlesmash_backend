const PodcastModel = require("../../Model/Admin/Podcast");

class Podcast {
  // post method
  async podcast(req, res) {
    try {
      const { PodcastTitle, PodcastGuest, PodcastDescription, PodcastLink } =
        req.body;

      const newPodcast = new PodcastModel({
        PodcastTitle,
        PodcastGuest,
        PodcastDescription,
        PodcastLink,
      });
      newPodcast.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }
  // get method
  async getpodcast(req, res) {
    try {
      const getpodcast = await PodcastModel.find({});
      if (getpodcast) {
        return res.status(200).json({ getpodcast: getpodcast });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //delete method
  async Deletepodcast(req, res) {
    try {
      const deletepodcast = req.params.Id;
      await PodcastModel.deleteOne({ _id: deletepodcast });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }
  //update method
  async editpodcast(req, res) {
    let { id, PodcastTitle, PodcastGuest, PodcastDescription, PodcastLink } =
      req.body;
    let obj = {};
    if (PodcastTitle) {
      obj["PodcastTitle"] = PodcastTitle;
    }
    if (PodcastGuest) {
      obj["PodcastGuest"] = PodcastGuest;
    }
    if (PodcastDescription) {
      obj["PodcastDescription"] = PodcastDescription;
    }
    if (PodcastLink) {
      obj["PodcastLink"] = PodcastLink;
    }

    try {
      let data = await PodcastModel.findByIdAndUpdate(
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

const PodcastController = new Podcast();
module.exports = PodcastController;
