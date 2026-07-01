const ResultsModal = require("../../Model/Admin/DoubleResults");

class Results {
  // post method
  async results(req, res) {
    try {
      let {
        TournamentName,
        TournamentDate,
        ResultCategory,
        ResultSubCategory,
        FirstPlayername,
        SecondPlayername,
        Position,
        Company,
      } = req.body;

      const newresults = new ResultsModal({
        TournamentName,
        TournamentDate,
        ResultCategory,
        ResultSubCategory,
        FirstPlayername,
        SecondPlayername,
        Position,
        Company,
      });
      newresults.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }
  // get method
  async getresults(req, res) {
    try {
      const getresults = await ResultsModal.find({});
      if (getresults) {
        return res.status(200).json({ getresults: getresults });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //delete method
  async Deleteresults(req, res) {
    try {
      const deleteresults = req.params.Id;
      await ResultsModal.deleteOne({ _id: deleteresults });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }
  //update method
  async editresults(req, res) {
    const { id,  TournamentName,
      TournamentDate,
      ResultCategory,
      ResultSubCategory,
      FirstPlayername,
      SecondPlayername,
      Position,
      Company, } = req.body;
  
    if (!id) {
      return res.status(400).json({ error: "ID is missing" });
    }
  
    let obj = {};
    if (TournamentName) {
      obj["TournamentName"] = TournamentName;
    }
    if (TournamentDate) {
      obj["TournamentDate"] = TournamentDate;
    }
    if (ResultCategory) {
      obj["ResultCategory"] = ResultCategory;
    }
    if (ResultSubCategory) {
      obj["ResultSubCategory"] = ResultSubCategory;
    }
    if (FirstPlayername) {
      obj["FirstPlayername"] = FirstPlayername;
    }
    if (SecondPlayername) {
      obj["SecondPlayername"] = SecondPlayername;
    }
    if (Position) {
      obj["Position"] = Position;
    }
    if (Company) {
      obj["Company"] = Company;
    }
    try {
      let data = await ResultsModal.findByIdAndUpdate(id, { $set: obj }, { new: true });
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Successfully Updated" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Server error" });
    }
  }
  
}

const ResultsController = new Results();
module.exports = ResultsController;
