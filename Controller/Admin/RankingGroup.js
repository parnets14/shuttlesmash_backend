const RankingGroup = require("../../Model/Admin/RankingGroup");
const fs   = require("fs");
const path = require("path");

const UPLOAD_DIR = path.join(__dirname, "../../Public/Rankings");

// ensure folder exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/* parse a value that may arrive as a JSON string (from FormData) or already as an array */
const parseList = (val) => {
  if (val === undefined || val === null) return undefined;
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    const t = val.trim();
    if (!t) return [];
    try {
      const parsed = JSON.parse(t);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (_) {
      return t.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return undefined;
};

/* slug used to build a stable key from a column label */
const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");

/* normalise the admin's bonus-column definitions -> [{ key, label, points }]
   The key must stay stable when only the label is renamed, otherwise the
   player bonus values would be orphaned. */
const parseBonusColumns = (val) => {
  const arr = parseList(val);
  if (!Array.isArray(arr)) return undefined;
  return arr
    .filter((c) => c && (String(c.label || "").trim() || String(c.key || "").trim()))
    .map((c, i) => {
      const label = String(c.label || "").trim();
      const key   = String(c.key || "").trim() || slug(label) || `col${i + 1}`;
      return { key, label, points: Number(c.points) || 0 };
    });
};

// ── Add ──────────────────────────────────────
exports.addGroup = async (req, res) => {
  try {
    const { Title, Tagline, Year, Category, SortOrder, Status, TournamentLabels, Categories, BonusColumns } = req.body;
    if (!Title || !Year || !Category)
      return res.status(400).json({ msg: "Title, Year and Category are required" });

    const doc = new RankingGroup({
      Title,
      Tagline,
      Year: Number(Year),
      Category,
      Categories: parseList(Categories) || [],
      BonusColumns: parseBonusColumns(BonusColumns) || [],
      SortOrder: Number(SortOrder) || 0,
      Status: Status || "Active",
      TournamentLabels: parseList(TournamentLabels) || [],
      GroupImage: req.file ? req.file.filename : "",
    });
    await doc.save();
    res.status(200).json({ success: "Ranking group added successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

// ── Get All ──────────────────────────────────
exports.getGroups = async (req, res) => {
  try {
    const groups = await RankingGroup.find().sort({ SortOrder: 1, Year: -1, createdAt: -1 });
    res.status(200).json({ groups });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ── Get Active (for user page) ────────────────
exports.getActiveGroups = async (req, res) => {
  try {
    const groups = await RankingGroup.find({ Status: "Active" })
      .sort({ SortOrder: 1, Year: -1, createdAt: -1 });
    res.status(200).json({ groups });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ── Edit ─────────────────────────────────────
exports.editGroup = async (req, res) => {
  try {
    const { id, Title, Tagline, Year, Category, SortOrder, Status, TournamentLabels, Categories, BonusColumns } = req.body;
    const doc = await RankingGroup.findById(id);
    if (!doc) return res.status(404).json({ msg: "Not found" });

    if (req.file) {
      if (doc.GroupImage) {
        const old = path.join(UPLOAD_DIR, doc.GroupImage);
        if (fs.existsSync(old)) fs.unlinkSync(old);
      }
      doc.GroupImage = req.file.filename;
    }

    if (Title !== undefined)     doc.Title     = Title;
    if (Tagline !== undefined)   doc.Tagline   = Tagline;
    if (Year)                    doc.Year      = Number(Year);
    if (Category !== undefined)  doc.Category  = Category;
    if (SortOrder !== undefined) doc.SortOrder = Number(SortOrder);
    if (Status !== undefined)    doc.Status    = Status;

    const cats = parseList(Categories);
    if (cats !== undefined) doc.Categories = cats;

    const bonusCols = parseBonusColumns(BonusColumns);
    if (bonusCols !== undefined) doc.BonusColumns = bonusCols;

    const labels = parseList(TournamentLabels);
    if (labels !== undefined) doc.TournamentLabels = labels;

    await doc.save();
    res.status(200).json({ success: "Updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

// ── Delete ────────────────────────────────────
exports.deleteGroup = async (req, res) => {
  try {
    const doc = await RankingGroup.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: "Not found" });

    if (doc.GroupImage) {
      const imgPath = path.join(UPLOAD_DIR, doc.GroupImage);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await RankingGroup.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
