const EventInfoModal = require("../../Model/Admin/EventInfo");

class EventInfo {

  // POST — create (only one record allowed)
  async addeventinfo(req, res) {
    try {
      const existing = await EventInfoModal.findOne({});
      if (existing) {
        return res.status(400).json({ error: "Event info already exists. Please edit the existing record." });
      }
      let { Venue, OrganizerName, OrganizerEmail,
            OvTitle, OvSubtitle, OvInitiative, OvStatus,
            OvSections, OvEntryFee, OvEntryFeeNote, OvYouTubeLink } = req.body;

      if (typeof OvSections === "string") OvSections = JSON.parse(OvSections);

      const newInfo = new EventInfoModal({
        Venue, OrganizerName, OrganizerEmail,
        OvTitle, OvSubtitle, OvInitiative, OvStatus,
        OvSections: OvSections || [],
        OvEntryFee, OvEntryFeeNote, OvYouTubeLink,
      });
      await newInfo.save();
      return res.status(200).json({ success: "Event info added successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to add event info" });
    }
  }

  // GET — fetch all
  async geteventinfo(req, res) {
    try {
      const data = await EventInfoModal.find({});
      return res.status(200).json({ geteventinfo: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to fetch event info" });
    }
  }

  // PUT — edit by id
  async editeventinfo(req, res) {
    try {
      let { id, Venue, OrganizerName, OrganizerEmail,
            OvTitle, OvSubtitle, OvInitiative, OvStatus,
            OvSections, OvEntryFee, OvEntryFeeNote, OvYouTubeLink } = req.body;

      if (typeof OvSections === "string") OvSections = JSON.parse(OvSections);

      const obj = {};
      if (Venue !== undefined)          obj["Venue"]          = Venue;
      if (OrganizerName !== undefined)  obj["OrganizerName"]  = OrganizerName;
      if (OrganizerEmail !== undefined) obj["OrganizerEmail"] = OrganizerEmail;
      if (OvTitle !== undefined)        obj["OvTitle"]        = OvTitle;
      if (OvSubtitle !== undefined)     obj["OvSubtitle"]     = OvSubtitle;
      if (OvInitiative !== undefined)   obj["OvInitiative"]   = OvInitiative;
      if (OvStatus !== undefined)       obj["OvStatus"]       = OvStatus;
      if (OvSections !== undefined)     obj["OvSections"]     = OvSections;
      if (OvEntryFee !== undefined)     obj["OvEntryFee"]     = OvEntryFee;
      if (OvEntryFeeNote !== undefined) obj["OvEntryFeeNote"] = OvEntryFeeNote;
      if (OvYouTubeLink !== undefined)  obj["OvYouTubeLink"]  = OvYouTubeLink;

      const data = await EventInfoModal.findByIdAndUpdate(
        { _id: id }, { $set: obj }, { new: true }
      );
      if (!data) return res.status(400).json({ error: "Record not found" });
      return res.status(200).json({ success: "Updated successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Update failed" });
    }
  }

  // DELETE — delete by id
  async deleteeventinfo(req, res) {
    try {
      await EventInfoModal.deleteOne({ _id: req.params.Id });
      return res.status(200).json({ success: "Deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: "Cannot be deleted" });
    }
  }
}

const EventInfoController = new EventInfo();
module.exports = EventInfoController;
