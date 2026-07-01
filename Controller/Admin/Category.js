const CategoryModel = require("../../Model/Admin/Category");

class Category {
  // post method
  async category(req, res) {
    try {
      let { CategoryName, CategoryPrice, TotalPlayers, CategoryType, CategoryDesc } = req.body;
      const newcategory = new CategoryModel({
        CategoryName,
        CategoryPrice,
        TotalPlayers,
        CategoryType,
        CategoryDesc,
      });
      newcategory.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }

  // get method
  async getcategory(req, res) {
    try {
      const getcategory = await CategoryModel.find({});
      if (getcategory) {
        return res.status(200).json({ getcategory: getcategory });
      }
    } catch (error) {
      console.log(error);
    }
  }

  //delete method
  async Deletecategory(req, res) {
    try {
      const deletecategory = req.params.Id;
      await CategoryModel.deleteOne({ _id: deletecategory });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }

    //update method
    async editcategory(req, res) {
      const { id, CategoryName, CategoryPrice, TotalPlayers, CategoryType, CategoryDesc } = req.body;
      const updateData = {};
    
      if (CategoryName) updateData["CategoryName"] = CategoryName;
      if (CategoryPrice) updateData["CategoryPrice"] = CategoryPrice;
      if (TotalPlayers) updateData["TotalPlayers"] = TotalPlayers;
      updateData["CategoryType"] = CategoryType || "";
      if (CategoryDesc !== undefined) updateData["CategoryDesc"] = CategoryDesc;
    
      try {
        const data = await CategoryModel.findByIdAndUpdate(
          { _id: id }, 
          { $set: updateData },
          { new: true }
        );
    
        if (!data) return res.status(400).json({ error: "Data not found" });
        return res.status(200).json({ success: "Successfully Updated" });
      } catch (error) {
        console.log("error",error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
    
}

const categoryController = new Category();
module.exports = categoryController;
