const RegistrationModel = require("../../Model/User/Registration");
const nodemailer = require("nodemailer");
class Registration {
  // post method
  async registration(req, res, next) {
    try {
      let {
        playerNames,
        PlayerEmail,
        PlayerPhoneNo,
        TotalAmount,
        eventsId,
        Category,
        EventNames,
        EventsDate,
        RegisteredDate,
        RegisteredTime,
      } = req.body;
      const newregistration = new RegistrationModel({
        playerNames,
        PlayerEmail,
        PlayerPhoneNo,
        TotalAmount,
        eventsId,
        Category,
        EventNames,
        EventsDate,
        RegisteredDate,
        RegisteredTime,
      });
      const registerData = await newregistration.save();

      if (registerData) {
        return res.status(200).json({
          success:
            "Thank you for successfully completing your registration! A confirmation has been sent to your email, and you’ll receive a payment confirmation email shortly.",
        });
      } else {
        return res.status(200).json({
          error: "Registered Not Successfully..! Please Try Again..!",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Cannot be added" });
    }
  }

  async sendMail(req, res) {
    try {
      let { PlayerEmail, playerNames } = req.body;
      // Create a transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "noreplayshuttlesmash@gmail.com", // Replace with your email
          pass: "nvkz erso kxzp jgfu", // Replace with your password or app-specific password
        },
        port: 465,
        host: "smtp.gmail.com", // Corrected host
      });

      let mailOptions = null;
      const formattedPlayerNames = playerNames.join(", ");
      mailOptions = {
        from: "noreplayshuttlesmash@gmail.com",
        to: PlayerEmail,
        subject: "Registration Confirmation for Shuttle Smash Championship",
        text: `
  Dear ${formattedPlayerNames},
  
  Thank you for successfully registering for the upcoming Shuttle Smash Championship. We are excited to have you join us for this Tournament.
  
  Our organizing team will be in touch with you soon with further details.
  
  If you have any questions, please do not hesitate to contact us at Geet 8861711005.
  
  Best regards,
  The Shuttle Smash Championship Organizing Team
          `,
      };

      // Send the main email
      const info = await transporter.sendMail(mailOptions);
      if (info) {
        res.status(200).json({ success: "Email sent successfully" });
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Failed to send email" });
    }
  }

  // payment mail

  async sendMailpaymentstatus(req, res) {
    try {
      let { PlayerEmail, playerNames } = req.body;
      // Create a transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "noreplayshuttlesmash@gmail.com", // Replace with your email
          pass: "nvkz erso kxzp jgfu", // Replace with your password or app-specific password
        },
        port: 465,
        host: "smtp.gmail.com", // Corrected host
      });

      let mailOptions = null;
      const formattedPlayerNames = playerNames.join(", ");
      mailOptions = {
        from: "noreplayshuttlesmash@gmail.com",
        to: PlayerEmail,
        subject:
          "Payment Confirmation for Shuttle Smash Championship Registration",
        text: `
  Dear ${formattedPlayerNames},
  
  Thank you for registering for the Shuttle Smash Championship! We are pleased to inform you that 
  your payment has been received successfully.

  If you have any questions or need further assistance, feel free to contact Geet at 8861711005.

  We look forward to seeing you at the Tournament!

  Best regards,
  The Shuttle Smash Championship Organizing Team
          `,
      };

      // Send the main email
      const info = await transporter.sendMail(mailOptions);
      if (info) {
        res.status(200).json({ success: "Email sent successfully" });
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Failed to send email" });
    }
  }

  // get method
  async getregistration(req, res) {
    try {
      let getregistration = await RegistrationModel.find()
        .populate("eventsId")
        .populate("Category.categoryId")
        .sort({ _id: -1 });
      return res.status(200).send({ getregistration: getregistration });
    } catch (error) {
      console.log(error);
    }
  }

  //delete method
  async Deleteregistration(req, res) {
    try {
      const deleteregistration = req.params.Id;
      await RegistrationModel.deleteOne({ _id: deleteregistration });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }

  async makeStatusChangebookings(req, res) {
    try {
      let { id, status } = req.body;
      let data = await RegistrationModel.findById(id);
      if (!data) return res.status(400).send({ error: "Data not found" });
      data.status = status;
      await data.save();
      return res.status(200).send({ success: `Successfully ${status}` });
    } catch (error) {
      console.log(error);
    }
  }

  async paymentstatus(req, res) {
    try {
      const { userId } = req.body;

      // Find the user by ID and update the status to "Success"
      const payment = await RegistrationModel.findOneAndUpdate(
        { _id: userId },
        { $set: { status: "Success" } },
        { new: true }
      );

      if (payment) {
        return res.status(200).json({ success: "Payment success" });
      } else {
        return res.status(400).json({ error: "Payment not successful" });
      }
    } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ error: "API Error" });
    }
  }
}

const registrationController = new Registration();
module.exports = registrationController;
