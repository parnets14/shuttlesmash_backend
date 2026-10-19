const RegistrationModel = require("../../Model/User/Registration");
const EventsModel = require("../../Model/Admin/Events");
const nodemailer = require("nodemailer");

// ── helpers ────────────────────────────────────────────────
const normEmail = (v) => String(v || "").trim().toLowerCase();
const normPhone = (v) => String(v || "").replace(/\D/g, "");

// Flatten catForms → [{ name, email, phone }]
const flattenPlayers = (catForms) => {
  if (!Array.isArray(catForms)) return [];
  const out = [];
  catForms.forEach((form) => {
    (form?.entries || []).forEach((entry) => {
      (entry || []).forEach((p) => {
        if (p && (p.email || p.phone || p.name)) {
          out.push({
            name: String(p.name || "").trim(),
            email: normEmail(p.email),
            phone: normPhone(p.phone),
          });
        }
      });
    });
  });
  return out;
};

// Values that appear more than once inside the same submission
const findInternalDuplicates = (values) => {
  const seen = new Map();
  values.filter(Boolean).forEach((v) => seen.set(v, (seen.get(v) || 0) + 1));
  return [...seen.entries()].filter(([, n]) => n > 1).map(([v]) => v);
};

// Every email / phone already used for an event.
// Reads both the flat arrays and catForms, so registrations created before
// PlayerEmails / PlayerPhones existed are still covered.
const getRegisteredContacts = async (eventsId) => {
  const emails = new Set();
  const phones = new Set();
  if (!eventsId) return { emails, phones };

  const rows = await RegistrationModel.find({ eventsId })
    .select("PlayerEmails PlayerPhones catForms")
    .lean();

  rows.forEach((row) => {
    (row.PlayerEmails || []).forEach((e) => {
      const v = normEmail(e);
      if (v) emails.add(v);
    });
    (row.PlayerPhones || []).forEach((p) => {
      const v = normPhone(p);
      if (v) phones.add(v);
    });
    flattenPlayers(row.catForms).forEach((p) => {
      if (p.email) emails.add(p.email);
      if (p.phone) phones.add(p.phone);
    });
  });

  return { emails, phones };
};

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
        catForms,
        OrganisationName,
      } = req.body;

      const players = flattenPlayers(catForms);

      // Fallback for legacy single-player payloads
      if (players.length === 0) {
        const email = normEmail(PlayerEmail);
        const phone = normPhone(PlayerPhoneNo);
        if (email || phone) players.push({ name: "", email, phone });
      }

      const emails = players.map((p) => p.email).filter(Boolean);
      const phones = players.map((p) => p.phone).filter(Boolean);

      // 1) No repeated phone / email inside the same registration
      const dupEmailsInForm = findInternalDuplicates(emails);
      const dupPhonesInForm = findInternalDuplicates(phones);
      if (dupEmailsInForm.length || dupPhonesInForm.length) {
        return res.status(400).json({
          error:
            "Each player must have a unique email and phone number — duplicates found in this registration.",
          duplicateEmails: dupEmailsInForm,
          duplicatePhones: dupPhonesInForm,
        });
      }

      // 2) No phone / email already registered for this event
      if (eventsId && (emails.length || phones.length)) {
        const used = await getRegisteredContacts(eventsId);
        const clashEmails = emails.filter((e) => used.emails.has(e));
        const clashPhones = phones.filter((p) => used.phones.has(p));

        if (clashEmails.length || clashPhones.length) {
          return res.status(409).json({
            error:
              "This email or phone number is already registered for this event.",
            duplicateEmails: clashEmails,
            duplicatePhones: clashPhones,
          });
        }
      }

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
        catForms,
        OrganisationName,
        PlayerEmails: emails,
        PlayerPhones: phones,
      });
      const registerData = await newregistration.save();

      if (registerData) {
        return res.status(200).json({
          success:
            "Thank you for successfully completing your registration!",
          registrationId: registerData._id,
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

  // POST /checkplayers — is this email / phone already used for this event?
  async checkplayers(req, res) {
    try {
      const { eventsId, emails = [], phones = [] } = req.body || {};
      const emailList = [...new Set((emails || []).map(normEmail).filter(Boolean))];
      const phoneList = [...new Set((phones || []).map(normPhone).filter(Boolean))];

      const used = await getRegisteredContacts(eventsId);

      return res.status(200).json({
        duplicateEmails: emailList.filter((e) => used.emails.has(e)),
        duplicatePhones: phoneList.filter((p) => used.phones.has(p)),
        internalEmails: findInternalDuplicates(
          (emails || []).map(normEmail).filter(Boolean)
        ),
        internalPhones: findInternalDuplicates(
          (phones || []).map(normPhone).filter(Boolean)
        ),
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Could not check players" });
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

      // Find the registration first so we can read its catForms / eventsId
      const registration = await RegistrationModel.findById(userId);
      if (!registration) {
        return res.status(400).json({ error: "Payment not successful" });
      }

      // Update status to Success + set PaymentDate
      registration.status = "Success";
      registration.PaymentDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      await registration.save();

      // Increment RegisteredCount on the event's embedded categories
      // Each entry in catForms counts as one registration slot per category
      if (registration.eventsId && registration.catForms?.length > 0) {
        const event = await EventsModel.findById(registration.eventsId);
        if (event) {
          registration.catForms.forEach((form) => {
            const entryCount = form.entries?.length || 1;
            const cat = event.Categories.find(
              (c) => String(c._id) === String(form.catId)
            );
            if (cat) {
              cat.RegisteredCount = (cat.RegisteredCount || 0) + entryCount;
            }
          });
          await event.save();
        }
      }

      return res.status(200).json({ success: "Payment success" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "API Error" });
    }
  }
}

const registrationController = new Registration();
module.exports = registrationController;
