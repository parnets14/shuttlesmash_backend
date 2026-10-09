const morgan = require("morgan");
const express = require("express");
const app = express();
const path = require('path');
const url = require('url');
const fs = require('fs');
const cors = require("cors");
require("dotenv").config();

// Catch unhandled errors so server never crashes
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.message);
  console.error(err.stack);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});



// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://shuttlesmash.in",
    "http://shuttlesmash.in",
    "https://shuttlesmash.in",
    "https://www.shuttlesmash.in"
  ],
  credentials: true
}));
app.use(morgan("dev"));

// Allow cross-origin access to static files (for download)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
app.use(express.static(path.join(__dirname, "Public")));

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected........."))
  .catch((err) => console.log("Database Not Connected !!!", err.message));

const AdminLogin = require("./Routes/Admin/AdminLogin");
const HomeBanner = require("./Routes/Admin/HomeBanner");
const Overview = require("./Routes/Admin/Overview");
const Keyhighlight = require("./Routes/Admin/KeyHighlights");
const Events = require("./Routes/Admin/Events");
const DoubleResults = require("./Routes/Admin/DoubleResults");
const AdminGallery = require("./Routes/Admin/AdminGallery");
const Partner = require("./Routes/Admin/Partner");
const Testimonial = require("./Routes/Admin/Testimonial");
const Contactus = require("./Routes/Admin/Contactus");
const SocialMedia = require("./Routes/Admin/SocialMedia");
const GeneralEnquiry = require("./Routes/User/GeneralEnquiry");
const Registration = require("./Routes/User/Registration");
const Category = require("./Routes/Admin/Category");
const SubCategory = require("./Routes/Admin/SubCategory");
const Achivers = require("./Routes/Admin/Achivers");
const EventBanner = require("./Routes/Admin/EventBanner");
const TermsCondition = require("./Routes/Admin/TermsCondition");
const Brochure = require("./Routes/Admin/Brochures");
const QR_Code = require("./Routes/Admin/QR_Code");
const GalleryVedio = require("./Routes/Admin/GalleryVedio");
const PaymentDetails = require("./Routes/Admin/PaymentDetails");
const Feedback = require("./Routes/User/Feedbacks");
const TeamMember = require("./Routes/Admin/TeamMember");
const LeadershipTeam = require("./Routes/Admin/LeadershipTeam");
const LeadershipHeroBanner = require("./Routes/Admin/LeadershipHeroBanner");
const EventHeroBanner = require("./Routes/Admin/EventHeroBanner");
const EventInfo = require("./Routes/Admin/EventInfo");
const GalleryHeroBanner = require("./Routes/Admin/GalleryHeroBanner");
const ResultHeroBanner  = require("./Routes/Admin/ResultHeroBanner");
const ContactHeroBanner    = require("./Routes/Admin/ContactHeroBanner");
const OverviewHeroBanner   = require("./Routes/Admin/OverviewHeroBanner");
const KeyhighlightHeroBanner = require("./Routes/Admin/KeyhighlightHeroBanner");
const phonepe = require("./Routes/User/PhonepeRoutes")

app.use("/api/admin", AdminLogin);
app.use("/api/admin", HomeBanner);
app.use("/api/admin", Overview);
app.use("/api/admin", Keyhighlight);
app.use("/api/admin", Events);
app.use("/api/admin", DoubleResults);
app.use("/api/admin", AdminGallery);
app.use("/api/admin", Partner);
app.use("/api/admin", Testimonial);
app.use("/api/admin", Contactus);
app.use("/api/admin", SocialMedia);
app.use("/api/user", GeneralEnquiry);
app.use("/api/user", Registration);
app.use("/api/admin", Category);
app.use("/api/admin", SubCategory);
app.use("/api/admin", Achivers);
app.use("/api/admin", EventBanner);
app.use("/api/admin", TermsCondition);
app.use("/api/admin", Brochure);
app.use("/api/admin", QR_Code);
app.use("/api/admin", GalleryVedio);
app.use("/api/admin", PaymentDetails);
app.use("/api/user", Feedback);
app.use("/api/admin", TeamMember);
app.use("/api/admin", LeadershipTeam);
app.use("/api/admin", LeadershipHeroBanner);
app.use("/api/admin", EventHeroBanner);
app.use("/api/admin", EventInfo);
app.use("/api/admin", GalleryHeroBanner);
app.use("/api/admin", ResultHeroBanner);
app.use("/api/admin", ContactHeroBanner);
app.use("/api/admin", OverviewHeroBanner);
app.use("/api/admin", KeyhighlightHeroBanner);
app.use("/api/phonepe", phonepe);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Shuttle Smash Championship</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #001f4d 0%, #003399 50%, #001f4d 100%);
              font-family: 'Segoe UI', sans-serif;
              color: white;
            }
            .container {
              text-align: center;
              padding: 40px;
            }
            .badge {
              display: inline-block;
              background: rgba(255,255,255,0.15);
              border: 1px solid rgba(255,255,255,0.3);
              border-radius: 50px;
              padding: 6px 20px;
              font-size: 13px;
              letter-spacing: 2px;
              text-transform: uppercase;
              margin-bottom: 20px;
            }
            h1 {
              font-size: 3rem;
              font-weight: 800;
              letter-spacing: 3px;
              text-transform: uppercase;
              margin-bottom: 8px;
            }
            h1 span { color: #66aaff; }
            .subtitle {
              font-size: 1rem;
              opacity: 0.7;
              letter-spacing: 4px;
              text-transform: uppercase;
              margin-bottom: 30px;
            }
            .status {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: rgba(0,255,100,0.15);
              border: 1px solid rgba(0,255,100,0.4);
              border-radius: 50px;
              padding: 8px 20px;
              font-size: 14px;
              color: #88ffbb;
            }
            .dot {
              width: 8px; height: 8px;
              background: #00ff66;
              border-radius: 50%;
              animation: pulse 1.5s infinite;
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.5; transform: scale(1.3); }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="badge">API Server</div>
            <h1>Shuttle <span>Smash</span></h1>
            <p class="subtitle">Championship Backend</p>
            <div class="status">
              <div class="dot"></div>
              Server is running
            </div>
          </div>
        </body>
      </html>
    `);
});

app.get('/api/admin/download-image', (req, res) => {
  const fileUrl = req.query.fileUrl;

  if (!fileUrl) {
    return res.status(400).send('File URL is required');
  }

  // Parse the URL to extract the path
  const parsedUrl = url.parse(fileUrl);
  const fileName = path.basename(parsedUrl.pathname);
  const filePath = path.join(__dirname, 'Gallery', fileName);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }

    // Send the file to the client
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('Error downloading file');
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

