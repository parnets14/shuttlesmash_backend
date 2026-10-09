const EventsModal = require("../../Model/Admin/Events");

class Events {
  // POST — create event with embedded categories & event info
  async events(req, res) {
    try {
      let {
        EventName,
        EventStartdate,
        EventEnddate,
        EventLocation,
        EventExhibits,
        Time,
        Status,
        Categories,
        EventInfo,
      } = req.body;

      // Parse JSON strings if needed
      if (typeof Categories === "string") Categories = JSON.parse(Categories);
      if (typeof EventInfo === "string") EventInfo = JSON.parse(EventInfo);

      let EventImage;
      let Brochure;
      if (req.files) {
        req.files.forEach((item) => {
          if (item.fieldname === "EventImage") {
            EventImage = item.filename;
          }
          if (item.fieldname === "Brochure") {
            Brochure = item.filename;
          }
        });
      }

      const newEvent = new EventsModal({
        EventName,
        EventStartdate,
        EventEnddate,
        EventLocation,
        EventExhibits,
        EventImage,
        Time,
        Status,
        Categories: Categories || [],
        EventInfo: EventInfo || {},
        Brochure: Brochure || "",
      });
      await newEvent.save();

      return res.status(200).json({ success: "Event Added Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to add event" });
    }
  }

  // GET — all events
  async getevents(req, res) {
    try {
      const getevents = await EventsModal.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ getevents: getevents });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to fetch events" });
    }
  }

  // DELETE — event
  async Deleteevents(req, res) {
    try {
      const deleteevents = req.params.Id;
      await EventsModal.deleteOne({ _id: deleteevents });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }

  // PUT — update event
  async editevents(req, res) {
    try {
      let {
        id,
        EventName,
        EventStartdate,
        EventEnddate,
        EventLocation,
        EventExhibits,
        Time,
        Status,
        Categories,
        EventInfo,
      } = req.body;

      if (typeof Categories === "string") Categories = JSON.parse(Categories);
      if (typeof EventInfo === "string") EventInfo = JSON.parse(EventInfo);

      // Preserve existing RegisteredCount and ensure Limit is a Number
      if (Categories && Array.isArray(Categories)) {
        const existingEvent = await EventsModal.findById(id);
        if (existingEvent) {
          Categories = Categories.map((incomingCat) => {
            const existing = existingEvent.Categories.find(
              (ec) => String(ec._id) === String(incomingCat._id)
            );
            return {
              ...incomingCat,
              Limit: Number(incomingCat.Limit) || 0,
              RegisteredCount: existing ? (existing.RegisteredCount || 0) : 0,
            };
          });
        }
      }

      let file = req.files?.[0]?.filename;
      let obj = {};

      // Handle multiple file fields
      if (req.files) {
        req.files.forEach((item) => {
          if (item.fieldname === "EventImage") obj["EventImage"] = item.filename;
          if (item.fieldname === "Brochure") obj["Brochure"] = item.filename;
        });
      }
      if (EventName) obj["EventName"] = EventName;
      if (EventStartdate) obj["EventStartdate"] = EventStartdate;
      if (EventEnddate) obj["EventEnddate"] = EventEnddate;
      if (EventLocation) obj["EventLocation"] = EventLocation;
      if (EventExhibits !== undefined) obj["EventExhibits"] = EventExhibits;
      if (Time) obj["Time"] = Time;
      if (Status) obj["Status"] = Status;
      if (Categories) obj["Categories"] = Categories;
      if (EventInfo !== undefined) obj["EventInfo"] = EventInfo;

      let data = await EventsModal.findByIdAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Event not found" });
      return res.status(200).json({ success: "Successfully Updated" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Update failed" });
    }
  }

  // PUT — reset RegisteredCount for a specific category in an event
  async resetCategoryCount(req, res) {
    try {
      const { eventId, categoryId } = req.body;
      const event = await EventsModal.findById(eventId);
      if (!event) return res.status(404).json({ error: "Event not found" });

      const cat = event.Categories.id(categoryId);
      if (!cat) return res.status(404).json({ error: "Category not found" });

      cat.RegisteredCount = 0;
      await event.save();
      return res.status(200).json({ success: "Count reset to 0" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Reset failed" });
    }
  }

  // Block/unblock event
  async blockevent(req, res) {
    try {
      const { eventId } = req.body;
      const event = await EventsModal.findOne({ _id: eventId });
      if (!event) return res.status(404).json({ error: "Event not found" });

      const updatedBlockStatus = !event.isBlock;
      const blockdata = await EventsModal.findOneAndUpdate(
        { _id: eventId },
        { $set: { isBlock: updatedBlockStatus } },
        { new: true }
      );

      if (blockdata) {
        return res.status(200).json({
          success: updatedBlockStatus ? "Blocked Successfully" : "Unblocked Successfully"
        });
      }
      return res.status(400).json({ error: "Something went wrong" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "API Error" });
    }
  }
}

const EventsController = new Events();
module.exports = EventsController;
