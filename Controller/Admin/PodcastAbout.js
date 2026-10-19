const PodcastAboutModel = require("../../Model/Admin/PodcastAbout");

class PodcastAbout {
  // POST — add about section
  async addAbout(req, res) {
    try {
      const { AboutTitle, AboutDescription } = req.body;
      const file = req.files[0]?.filename;

      if (!file)             return res.status(400).json({ error: "Please upload an image" });
      if (!AboutTitle)       return res.status(400).json({ error: "Title is required" });
      if (!AboutDescription) return res.status(400).json({ error: "Description is required" });

      const newAbout = new PodcastAboutModel({ AboutImage: file, AboutTitle, AboutDescription });
      await newAbout.save();
      return res.status(200).json({ success: "Podcast About Section Added Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "API Error" });
    }
  }

  // GET — fetch about section
  async getAbout(req, res) {
    try {
      const data = await PodcastAboutModel.find({});
      return res.status(200).json({ getAbout: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "API Error" });
    }
  }

  // PUT — edit about section
  async editAbout(req, res) {
    try {
      const { id, AboutTitle, AboutDescription } = req.body;
      const file = req.files[0]?.filename;

      const obj = {};
      if (AboutTitle)       obj["AboutTitle"]       = AboutTitle;
      if (AboutDescription) obj["AboutDescription"] = AboutDescription;
      if (file)             obj["AboutImage"]        = file;

      const data = await PodcastAboutModel.findByIdAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Podcast About Section Updated Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Update failed" });
    }
  }

  // DELETE — remove about section
  async deleteAbout(req, res) {
    try {
      await PodcastAboutModel.deleteOne({ _id: req.params.Id });
      return res.status(200).json({ success: "Podcast About Section Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: "Cannot be deleted" });
    }
  }
}

const podcastAboutController = new PodcastAbout();
module.exports = podcastAboutController;
