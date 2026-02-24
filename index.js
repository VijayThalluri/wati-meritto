const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/wati-webhook", async (req, res) => {
  try {
    const contact = req.body.payload?.contacts?.[0];
    if (!contact) return res.status(200).send("No contact");

    const phone = contact.wa_id;
    const name = contact.profile?.name || "WhatsApp User";

    await axios.post(
      "https://api.meritto.com/api/leads/create",
      {
        name: name,
        mobile: phone,
        source: "WhatsApp - WATI"
      },
      {
        headers: {
          Authorization: "Bearer d74d17270723509db98d2e268e80798a",
          "Content-Type": "application/json"
        }
      }
    );

    res.status(200).send("Lead created");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error");
  }
});

app.get("/", (req, res) => {
  res.send("WATI webhook is running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});