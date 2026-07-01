const BannerModel = require("../../Model/Admin/HomeBanner");

class Banner {
  // post method
  async banner(req, res) {
    try {
      let { BannerText, BannerText2, BannerText3, BannerTagline } = req.body;
      console.log("Banner upload - files:", req.files?.length, "body:", req.body);
      let BannerImages = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          console.log("File received:", file.fieldname, file.filename);
          BannerImages.push(file.filename);
        });
      }

      const newbanner = new BannerModel({
        BannerText: BannerText || "",
        BannerText2: BannerText2 || "",
        BannerText3: BannerText3 || "",
        BannerTagline: BannerTagline || "",
        BannerImages,
        BannerImage: BannerImages[0] || "",
      });
      await newbanner.save();
      return res.status(200).json({ success: "Banner Added Successfully" });
    } catch (error) {
      console.log("Banner error:", error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }
  // get method
  async getbanner(req, res) {
    try {
      const getbanner = await BannerModel.find({});
      if (getbanner) {
        return res.status(200).json({ getbanner: getbanner });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //delete method
  async Deletebanner(req, res) {
    try {
      const deletebanner = req.params.Id;
      await BannerModel.deleteOne({ _id: deletebanner });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }
  //update method
  async editbanner(req, res) {
    let { id, BannerText, BannerText2, BannerText3, BannerTagline, existingImages } = req.body;
    let obj = {};

    // Parse existing images that user kept (after deleting some)
    let keptImages = [];
    if (existingImages) {
      try { keptImages = JSON.parse(existingImages); } catch(e) { keptImages = []; }
    }

    // Add new uploaded files
    let newImages = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => newImages.push(file.filename));
    }

    // Merge: kept old images + new uploads
    const allImages = [...keptImages, ...newImages];
    obj["BannerImages"] = allImages;
    obj["BannerImage"] = allImages[0] || "";

    // Always update text fields
    obj["BannerText"] = (BannerText !== undefined && BannerText !== null) ? BannerText : "";
    obj["BannerText2"] = (BannerText2 !== undefined && BannerText2 !== null) ? BannerText2 : "";
    obj["BannerText3"] = (BannerText3 !== undefined && BannerText3 !== null) ? BannerText3 : "";
    obj["BannerTagline"] = (BannerTagline !== undefined && BannerTagline !== null) ? BannerTagline : "";

    console.log("Edit banner:", { id, obj });

    try {
      let data = await BannerModel.findByIdAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Successfully Updated" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Update failed" });
    }
  }
}

const bannerController = new Banner();
module.exports = bannerController;
