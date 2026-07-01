const FeedbackModel = require("../../Model/User/Feedbacks");

class Feedback {
  // post method
  async feedback(req, res) {
    try {
      let {UserName, UserPhoneNumber, UserLocation ,FeedbackMessage, FeedbackStatus,FeedbackDate} = req.body;

      const newfeedback = new FeedbackModel({
        UserName, UserPhoneNumber, UserLocation,  FeedbackMessage, FeedbackStatus, FeedbackDate
      });
      newfeedback.save().then((data) => {
        return res.status(200).json({ success: "Your Feedbacks Sent Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }
  // get method
  async getfeedback(req, res) {
    try {
      let getfeedback = await FeedbackModel.find().sort({_id: -1});
      return res.status(200).send({getfeedback: getfeedback});

    } catch (error) {
      console.log(error);
    }
  }


  //delete method
  async DeleteFeedback(req, res) {
    try {
      const deletefeedback = req.params.Id;
      await FeedbackModel.deleteOne({ _id: deletefeedback });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }
}

const FeedbackController = new Feedback();
module.exports = FeedbackController;
