const RankingModel = require("../../Model/Admin/Ranking");
const RankingGroup = require("../../Model/Admin/RankingGroup");
const fs   = require("fs");
const path = require("path");

/* ─────────────────────────────────────────────────────────────
   SCORING ENGINE
   Total Spree = (Total Points Scored
                  + Semi-Final points
                  + Runner-Up points
                  + Winner points) / 10
   Final Rank  = order by Total Spree (highest = 1)
   ───────────────────────────────────────────────────────────── */
const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const round2 = (v) => Math.round(v * 100) / 100;

/* safe JSON parse for values arriving as strings (multipart form data) */
const parseJson = (v, fallback) => {
  if (v === undefined || v === null) return fallback;
  if (typeof v === "string") {
    const t = v.trim();
    if (!t) return fallback;
    try { return JSON.parse(t); } catch (_) { return fallback; }
  }
  return v;
};

/** normalise the per-player bonus list into [{ key, value }] */
const normaliseBonus = (bonus) => {
  if (!Array.isArray(bonus)) return [];
  return bonus
    .filter((b) => b && b.key !== undefined && b.key !== null && b.key !== "")
    .map((b) => ({ key: String(b.key), value: num(b.value) }));
};

/** add the calculated fields to a plain player object.
 *  Total Spree = (TotalPointsScored + sum of every bonus value) / 10 */
const withSpree = (p) => {
  const base  = num(p.TotalPointsScored);
  const bonus = normaliseBonus(p.Bonus);
  const spree = round2((base + bonus.reduce((s, b) => s + b.value, 0)) / 10);

  const byKey = {};
  bonus.forEach((b) => { byKey[b.key] = b.value; });

  return {
    ...p,
    Bonus: bonus,
    TotalSpree: spree,
    Points: spree,
    /* legacy fields kept in sync so older screens keep working */
    SemiFinalistPoints: byKey.semi   !== undefined ? byKey.semi   : num(p.SemiFinalistPoints),
    RunnersUpPoints:    byKey.runner !== undefined ? byKey.runner : num(p.RunnersUpPoints),
    WinnerPoints:       byKey.winner !== undefined ? byKey.winner : num(p.WinnerPoints),
  };
};

/** assign Final Rank inside each category, by TotalSpree desc.
 *  Ties share the same rank (competition ranking), matching the client's sheet. */
const rankWithinCategories = (players) => {
  const buckets = {};
  players.forEach((p) => {
    const key = p.Category || "General";
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(p);
  });

  const ranked = [];
  Object.values(buckets).forEach((list) => {
    list.sort(
      (a, b) =>
        num(b.TotalSpree) - num(a.TotalSpree) ||
        String(a.PlayerName).localeCompare(String(b.PlayerName))
    );

    let prevSpree = null, prevRank = 0;
    list.forEach((p, i) => {
      const spree = num(p.TotalSpree);
      if (prevSpree !== null && spree === prevSpree) {
        ranked.push({ ...p, Rank: prevRank });      // tie → same rank
      } else {
        prevRank = i + 1;
        prevSpree = spree;
        ranked.push({ ...p, Rank: i + 1 });
      }
    });
  });
  return ranked;
};

/* ── Add single Ranking ──────────────────────── */
exports.addRanking = async (req, res) => {
  try {
    const {
      Rank, PlayerName, Category, Year, GroupId,
      TotalPointsScored, Bonus,
      SemiFinalistPoints, RunnersUpPoints, WinnerPoints,
      State, City, Club, PreviousRank, TournamentsPlayed, Status,
    } = req.body;

    if (!PlayerName || !Category || !Year) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }

    const scored = withSpree({
      TotalPointsScored:  num(TotalPointsScored),
      Bonus:              parseJson(Bonus, []),
      SemiFinalistPoints: num(SemiFinalistPoints),
      RunnersUpPoints:    num(RunnersUpPoints),
      WinnerPoints:       num(WinnerPoints),
    });

    const newRanking = new RankingModel({
      GroupId: GroupId || undefined,
      Rank: num(Rank) || 0,
      PlayerName,
      PlayerImage: req.file ? req.file.filename : "",
      Category,
      Year: num(Year),
      TotalPointsScored:  scored.TotalPointsScored,
      Bonus:              scored.Bonus,
      SemiFinalistPoints: scored.SemiFinalistPoints,
      RunnersUpPoints:    scored.RunnersUpPoints,
      WinnerPoints:       scored.WinnerPoints,
      TotalSpree: scored.TotalSpree,
      Points:     scored.TotalSpree,
      State,
      City,
      Club,
      PreviousRank: num(PreviousRank),
      TournamentsPlayed: num(TournamentsPlayed),
      tournamentPoints: [],
      Status: Status || "Active",
    });

    await newRanking.save();
    res.status(200).json({ success: "Ranking added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/* ── Get All Rankings (admin) ────────────────── */
exports.getRankings = async (req, res) => {
  try {
    const rankings = await RankingModel.find().sort({ Year: -1, Category: 1, Rank: 1 });
    res.status(200).json({ getRankings: rankings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/* ── Get Rankings by Year ────────────────────── */
exports.getRankingsByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const rankings = await RankingModel
      .find({ Year: parseInt(year), Status: "Active" })
      .sort({ Category: 1, Rank: 1 });
    res.status(200).json({ getRankings: rankings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/* ── Get Rankings by Category + Year ────────── */
exports.getRankingsByCategoryYear = async (req, res) => {
  try {
    const { category, year } = req.params;
    const rankings = await RankingModel
      .find({ Category: category, Year: parseInt(year), Status: "Active" })
      .sort({ Rank: 1 });
    res.status(200).json({ getRankings: rankings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/* ── Get one whole leaderboard (group) ───────── */
exports.getRankingsByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const includeAll  = req.query.all === "1";
    const statusFilter = includeAll ? {} : { Status: "Active" };

    let rankings = await RankingModel
      .find({ GroupId: groupId, ...statusFilter })
      .sort({ Category: 1, Rank: 1 });

    let group = null;
    try { group = await RankingGroup.findById(groupId); } catch (_) { group = null; }

    /* backward-compat: older rows have no GroupId → match by year + category */
    if (rankings.length === 0 && group) {
      rankings = await RankingModel
        .find({ Year: group.Year, Category: group.Category, ...statusFilter })
        .sort({ Rank: 1 });
    }

    /* group by event category */
    const grouped = {};
    rankings.forEach((r) => {
      const key = r.Category || "General";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(r);
    });

    const categories = Object.keys(grouped);

    res.status(200).json({
      rankings: grouped,
      categories,
      group,
      total: rankings.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/* ── Get Distinct Years ──────────────────────── */
exports.getDistinctYears = async (req, res) => {
  try {
    const years = await RankingModel.distinct("Year");
    res.status(200).json({ years: years.sort((a, b) => b - a) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/* ── Get Distinct Categories ─────────────────── */
exports.getDistinctCategories = async (req, res) => {
  try {
    const categories = await RankingModel.distinct("Category");
    res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/* ── Edit single Ranking ─────────────────────── */
exports.editRanking = async (req, res) => {
  try {
    const {
      id, Rank, PlayerName, Category, Year,
      TotalPointsScored, Bonus,
      SemiFinalistPoints, RunnersUpPoints, WinnerPoints,
      State, City, Club, PreviousRank, TournamentsPlayed, Status,
    } = req.body;

    const ranking = await RankingModel.findById(id);
    if (!ranking) return res.status(404).json({ msg: "Ranking not found" });

    if (req.file) {
      if (ranking.PlayerImage) {
        const old = path.join(__dirname, "../../Public/Rankings", ranking.PlayerImage);
        if (fs.existsSync(old)) fs.unlinkSync(old);
      }
      ranking.PlayerImage = req.file.filename;
    }

    if (Rank !== undefined)               ranking.Rank               = num(Rank);
    if (PlayerName !== undefined)         ranking.PlayerName         = PlayerName;
    if (Category !== undefined)           ranking.Category           = Category;
    if (Year !== undefined)               ranking.Year               = num(Year);
    if (TotalPointsScored !== undefined)  ranking.TotalPointsScored  = num(TotalPointsScored);
    if (Bonus !== undefined)              ranking.Bonus              = normaliseBonus(parseJson(Bonus, []));
    if (SemiFinalistPoints !== undefined) ranking.SemiFinalistPoints = num(SemiFinalistPoints);
    if (RunnersUpPoints !== undefined)    ranking.RunnersUpPoints    = num(RunnersUpPoints);
    if (WinnerPoints !== undefined)       ranking.WinnerPoints       = num(WinnerPoints);
    if (State !== undefined)              ranking.State              = State;
    if (City !== undefined)               ranking.City               = City;
    if (Club !== undefined)               ranking.Club               = Club;
    if (PreviousRank !== undefined)       ranking.PreviousRank       = num(PreviousRank);
    if (TournamentsPlayed !== undefined)  ranking.TournamentsPlayed  = num(TournamentsPlayed);
    if (Status !== undefined)             ranking.Status             = Status;

    const scored = withSpree(ranking.toObject());
    ranking.TotalSpree         = scored.TotalSpree;
    ranking.Points             = scored.TotalSpree;
    ranking.SemiFinalistPoints = scored.SemiFinalistPoints;
    ranking.RunnersUpPoints    = scored.RunnersUpPoints;
    ranking.WinnerPoints       = scored.WinnerPoints;

    await ranking.save();
    res.status(200).json({ success: "Ranking updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/* ── Delete single Ranking ───────────────────── */
exports.deleteRanking = async (req, res) => {
  try {
    const { id } = req.params;
    const ranking = await RankingModel.findById(id);
    if (!ranking) return res.status(404).json({ msg: "Ranking not found" });

    if (ranking.PlayerImage) {
      const imgPath = path.join(__dirname, "../../Public/Rankings", ranking.PlayerImage);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await RankingModel.findByIdAndDelete(id);
    res.status(200).json({ success: "Ranking deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/* ── Bulk save (the admin grid) ──────────────── */
exports.bulkUploadRankings = async (req, res) => {
  try {
    const { players, Year, Category, GroupId } = req.body;

    if (!players || !Array.isArray(players) || players.length === 0)
      return res.status(400).json({ msg: "No player data provided" });
    if (!Year)
      return res.status(400).json({ msg: "Year is required" });
    if (!GroupId && !Category)
      return res.status(400).json({ msg: "GroupId or Category is required" });

    /* 1. remove the old rows for this group (or year+category) */
    if (GroupId) {
      await RankingModel.deleteMany({ GroupId });
    } else {
      await RankingModel.deleteMany({ Year: num(Year), Category });
    }

    /* 2. build the docs + calculate Total Spree */
    const docs = players
      .filter((p) => (p.PlayerName || "").trim())
      .map((p) =>
        withSpree({
          GroupId:            GroupId || undefined,
          PlayerName:         (p.PlayerName || "").trim(),
          PlayerImage:        "",
          Category:           p.Category || Category || "General",
          Year:               num(Year),
          TotalPointsScored:  num(p.TotalPointsScored),
          Bonus:              p.Bonus,
          SemiFinalistPoints: num(p.SemiFinalistPoints),
          RunnersUpPoints:    num(p.RunnersUpPoints),
          WinnerPoints:       num(p.WinnerPoints),
          State:              p.State || "",
          City:               p.City  || "",
          Club:               p.Club  || "",
          PreviousRank:       num(p.PreviousRank),
          TournamentsPlayed:  num(p.TournamentsPlayed),
          tournamentPoints:   Array.isArray(p.tournamentPoints) ? p.tournamentPoints.map(Number) : [],
          Status:             p.Status || "Active",
          Rank:               0,
        })
      );

    if (docs.length === 0)
      return res.status(400).json({ msg: "No player names provided" });

    /* 3. calculate the Final Rank inside every category */
    const ranked = rankWithinCategories(docs);

    await RankingModel.insertMany(ranked);

    res.status(200).json({
      success: `${ranked.length} players saved successfully`,
      players: ranked,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/* ── Get Active Rankings for user page (legacy) ─ */
exports.getActiveRankings = async (req, res) => {
  try {
    const { year } = req.query;
    const queryYear = year ? parseInt(year) : new Date().getFullYear();

    const rankings = await RankingModel
      .find({ Year: queryYear, Status: "Active" })
      .sort({ Category: 1, Rank: 1 });

    const grouped = rankings.reduce((acc, curr) => {
      if (!acc[curr.Category]) acc[curr.Category] = [];
      acc[curr.Category].push(curr);
      return acc;
    }, {});

    res.status(200).json({ rankings: grouped, year: queryYear });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
