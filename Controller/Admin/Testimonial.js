const TestimonialModal = require("../../Model/Admin/Testimonial");

class Testimonial {
  // post method
  async testimonial(req, res) {
    try {
      let { Name, Designation, Description } = req.body;

      const newtestimonial = new TestimonialModal({
        Name,
        Designation,
        Description,
      });
      newtestimonial.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }
  // get method
  async gettestimonial(req, res) {
    try {
      const gettestimonial = await TestimonialModal.find({});
      if (gettestimonial) {
        return res.status(200).json({ gettestimonial: gettestimonial });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //delete method
  async Deletetestimonial(req, res) {
    try {
      const deletetestimonial = req.params.Id;
      await TestimonialModal.deleteOne({ _id: deletetestimonial });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }
  //update method
  async edittestimonial(req, res) {
    let { id, Name, Designation, Description } = req.body;
    let obj = {};
    if (Name) {
      obj["Name"] = Name;
    }
    if (Designation) {
      obj["Designation"] = Designation;
    }
    if (Description) {
      obj["Description"] = Description;
    }

    try {
      let data = await TestimonialModal.findByIdAndUpdate(
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

const TestimonialController = new Testimonial();
module.exports = TestimonialController;
