const ContactHeroBannerModel = require("../../Model/Admin/ContactHeroBanner");

class ContactHeroBanner {
  // POST — add
  async addHeroBanner(req, res) {
    try {
      const { HeroTitle, HeroDescription } = req.body;
      const file = req.files[0]?.filename;

      if (!file)            return res.status(400).json({ error: "Please upload an image" });
      if (!HeroTitle)       return res.status(400).json({ error: "Title is required" });
      if (!HeroDescription) return res.status(400).json({ error: "Description is required" });

      const newBanner = new ContactHeroBannerModel({ HeroImage: file, HeroTitle, HeroDescription });
      await newBanner.save();
      return res.status(200).json({ success: "Contact Hero Banner Added Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "API Error" });
    }
  }

  // GET — fetch
  async getHeroBanner(req, res) {
    try {
      const data = await ContactHeroBannerModel.find({});
      return res.status(200).json({ getheroBanner: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "API Error" });
    }
  }

  // PUT — edit
  async editHeroBanner(req, res) {
    try {
      const { id, HeroTitle, HeroDescription } = req.body;
      const file = req.files[0]?.filename;

      const obj = {};
      if (HeroTitle)       obj["HeroTitle"]       = HeroTitle;
      if (HeroDescription) obj["HeroDescription"] = HeroDescription;
      if (file)            obj["HeroImage"]        = file;

      const data = await ContactHeroBannerModel.findByIdAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Contact Hero Banner Updated Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Update failed" });
    }
  }

  // DELETE — remove
  async deleteHeroBanner(req, res) {
    try {
      await ContactHeroBannerModel.deleteOne({ _id: req.params.Id });
      return res.status(200).json({ success: "Contact Hero Banner Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: "Cannot be deleted" });
    }
  }
}

const contactHeroBannerController = new ContactHeroBanner();
module.exports = contactHeroBannerController;
