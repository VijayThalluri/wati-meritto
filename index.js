const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/wati-webhook", async (req, res) => {

  try {

    console.log("Webhook received:", req.body);

    const contact = req.body.payload?.contacts?.[0];

    if (!contact) {
      return res.status(200).send("No contact data");
    }

    const name = contact.profile?.name || "WhatsApp User";
    const mobile = contact.wa_id;

    const payload = {
      name: name,
      mobile: mobile,
      source: "WhatsApp",
      medium: "WATI",
      campaign: "Admissions"
    };

    const response = await axios.post(
      "https://api.meritto.com/api/leads/create",
      payload,
      {
        headers: {
          Authorization: "d74d17270723509db98d2e268e80798a",
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Lead created in Meritto:", response.data);

    res.status(200).send("Lead sent to Meritto");

  } catch (error) {

    console.error("Error sending to Meritto:", error.response?.data || error.message);

    res.status(500).send("Error");

  }

});

app.get("/", (req, res) => {
  res.send("WATI webhook is running");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});