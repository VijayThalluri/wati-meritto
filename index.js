const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/wati-webhook", async (req, res) => {
  try {

    console.log("Data received from WATI:", req.body);

    const name = req.body.name;
    const mobile = req.body.mobile;
    const source = req.body.source || "WhatsApp";
    const campaign = req.body.campaign || "Admissions";

    if (!mobile) {
      return res.status(400).send("Mobile number missing");
    }

    const payload = {
      name: name,
      mobile: mobile,
      source: source,
      campaign: campaign
    };

    const response = await axios.post(
      "https://api.meritto.com/api/leads/v1/create",
      payload,
      {
        headers: {
          Authorization: "Bearer d74d17270723509db98d2e268e80798a",
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Lead created in Meritto:", response.data);

    res.status(200).send("Lead sent to Meritto");

  } catch (error) {

    console.error("Meritto Error:", error.response?.data || error.message);
    res.status(500).send("Error sending lead");

  }
});

app.get("/", (req, res) => {
  res.send("WATI webhook is running");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});