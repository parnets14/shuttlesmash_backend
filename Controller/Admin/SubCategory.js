const SubcategoryModel = require("../../Model/Admin/SubCategory");

class Subcategory {
  // post method
  async subcategory(req, res) {
    try {
      let { SubCategoryName, GamePlayer } = req.body;
      const newsubcategory = new SubcategoryModel({
        SubCategoryName,
        GamePlayer,
      });
      newsubcategory.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  } 

  // get method
  async getsubcategory(req, res) {
    try {
      const getsubcategory = await SubcategoryModel.find({});
      if (getsubcategory) {
        return res.status(200).json({ getsubcategory: getsubcategory });
      }
    } catch (error) {
      console.log(error);
    }
  }

  //delete method
  async Deletesubcategory(req, res) {
    try {
      const deletesubcategory = req.params.Id;
      await SubcategoryModel.deleteOne({ _id: deletesubcategory });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }

  //update method
  async editsubcategory(req, res) {
    let { id, SubCategoryName, GamePlayer } = req.body;
    let obj = {};

    if (SubCategoryName) {
      obj["SubCategoryName"] = SubCategoryName;
    }
    if (GamePlayer) {
      obj["GamePlayer"] = GamePlayer;
    }
    try {
      let data = await SubcategoryModel.findByIdAndUpdate(
        id,
        { $set: obj },
        { new: true }
      );
      if (!data) return res.status(404).json({ error: "Data not found" });
      return res.status(200).json({ success: "Successfully Updated" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

const subcategoryController = new Subcategory();
module.exports = subcategoryController;
