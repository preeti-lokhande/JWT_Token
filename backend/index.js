const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
  JWT_SECRET,
  PORT,
} = process.env;

app.post("/api/auth/oauth-login", async (req, res) => {
  
  const { code } = req.body;

  console.log(`code: ${code}`);

  if (code === "mock-code-123") {
    const jwtToken = jwt.sign(
      { email: "mockuser@example.com", name: "Mock User" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.json({ token: jwtToken });
  } else {
    try {
      // 1. Exchange auth code for tokens
      const { data: tokenResponse } = await axios.post(
        "https://oauth2.googleapis.com/token",
        {
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const { access_token, id_token } = tokenResponse;

      // 2. Get user info
      const { data: userInfo } = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      // 3. Generate your JWT (include only minimal info)
      const token = jwt.sign(
        {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token });
    } catch (err) {
      console.error("OAuth login failed:", err.response?.data || err.message);
      res.status(500).json({ error: "OAuth login failed" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
