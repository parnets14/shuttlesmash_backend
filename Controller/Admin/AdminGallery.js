const GalleryModel = require("../../Model/Admin/AdminGallery");

class Gallery {
  // post method
  async gallery(req, res) {
    try {
      let { GalleryImage, GalleryText } = req.body;
      let file = req.files[0]?.filename;

      const newgallery = new GalleryModel({
        GalleryText,
        GalleryImage: file,
      });
      newgallery.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }
  // get method
  async getgallery(req, res) {
    try {
      const getgallery = await GalleryModel.find({});
      if (getgallery) {
        return res.status(200).json({ getgallery: getgallery });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //delete method
  async Deletegallery(req, res) {
    try {
      const deletegallery = req.params.Id;
      await GalleryModel.deleteOne({ _id: deletegallery });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }
  //update method
  async editgallery(req, res) {
    let { id, GalleryImage, GalleryText } = req.body;
    let file = req.files[0]?.filename;
    let obj = {};
    if (GalleryText) {
      obj["GalleryText"] = GalleryText;
    }
    if (file) {
      obj["GalleryImage"] = file;
    }
    try {
      let data = await GalleryModel.findByIdAndUpdate(
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

  // Gallry multile imag

  async Addgallery(req, res) {
    let { GalleryTitle } = req.body;
    console.log("=== Addgallery called ===");
    console.log("Body:", req.body);
    console.log("Files:", req.files);
    let PlaceImages = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        console.log("File fieldname:", file.fieldname, "| saved as:", file.filename, "| path:", file.path);
        if (file.fieldname.startsWith("PlaceImages")) {
          PlaceImages.push({ placepicture: file.filename });
        }
      });
    } else {
      console.log("NO FILES RECEIVED");
    }
    console.log("PlaceImages to save:", PlaceImages);

    try {
      let Newdata = new GalleryModel({
        GalleryTitle,
        PlaceImages,
      });
      Newdata.save().then((data) => {
        return res.status(200).json({ success: "success" });
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Update gallery method
  async updategallery(req, res) {
    try {
      const { PlaceName, id } = req.body;
      const file = req.files ? req.files[0].filename : "";

      let images = await GalleryModel.findById(id);
      if (!images) {
        return res.status(400).json({ error: "Data not found" });
      }

      let perticulargallery = images?.PlaceImages?.id(PlaceName);
      if (!perticulargallery) {
        return res.status(400).json({ error: "Image not found" });
      }

      if (file) {
        perticulargallery.placepicture = file;
      }

      let updateimagedata = await images.save();
      return res.status(200).json({ success: updateimagedata });
    } catch (error) {
      console.error("Error in updategallery method:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Delete gallery method
  async deletegallery(req, res) {
    try {
      const id = req.params.id;
      const { packid } = req.body;

      const deletegallery = await GalleryModel.findByIdAndUpdate(
        { _id: packid },
        { $pull: { PlaceImages: { _id: id } } },
        { new: true }
      );

      return res
        .status(200)
        .json({ success: deletegallery, msg: "Deleted Successfully" });
    } catch (error) {
      console.error("Error in deletegallery method:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Gallery Edit API
  async Editglry(req, res) {
    const { galleryId, GalleryTitle, imagesToRemove } = req.body;

    try {
      if (!galleryId) return res.status(400).json({ error: "Gallery ID is required" });

      // Find the gallery by ID
      let gallery = await GalleryModel.findById(galleryId);
      if (!gallery) return res.status(404).json({ error: "Gallery not found" });

      // Update GalleryTitle if provided
      if (GalleryTitle) {
        gallery.GalleryTitle = GalleryTitle;
      }

      // Handle new images — accept any fieldname starting with PlaceImages
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          gallery.PlaceImages.push({ placepicture: file.filename });
        });
      }

      // Remove images if specified
      if (imagesToRemove) {
        const removeList = Array.isArray(imagesToRemove) ? imagesToRemove : [imagesToRemove];
        gallery.PlaceImages = gallery.PlaceImages.filter(
          (image) => !removeList.includes(image.placepicture)
        );
      }

      // Save the updated gallery
      await gallery.save();

      return res.status(200).json({ success: "Gallery updated successfully" });
    } catch (error) {
      console.log("Error updating gallery:", error);
      return res.status(500).json({
        error: "An error occurred while updating the gallery",
        details: error.message,
      });
    }
  }

  async updateglry(req, res) {
    const { id } = req.body; // Ensure `placepicture` is passed in body
    try {
      let placepicture;
      if (req.files) {
        req.files?.forEach((item) => {
          if (item?.fieldname === "placepicture");
          placepicture = item?.filename;
        });
      }
      console.log("placepicture", id, placepicture);

      const updatedData = await GalleryModel.findByIdAndUpdate(
        id,
        { $push: { PlaceImages: { placepicture: placepicture } } },
        { new: true }
      );

      if (updatedData) {
        return res
          .status(200)
          .json({ success: "Successfully Updated", data: updatedData });
      } else {
        return res.status(400).json({ error: "Update failed" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Delete Gallery
  async DeleteGalleryImages(req, res) {
    const { id, galleryid } = req.body; // Ensure `placepicture` is passed in body
    try {
      const updatedData = await GalleryModel.findByIdAndUpdate(
        id,
        { $pull: { PlaceImages: { _id: galleryid } } },
        { new: true }
      );

      if (updatedData) {
        return res
          .status(200)
          .json({ success: "Delete Successfully", data: updatedData });
      } else {
        return res.status(400).json({ error: "Delete failed" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

const galleryController = new Gallery();
module.exports = galleryController;
