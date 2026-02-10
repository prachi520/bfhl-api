console.log("index.js file loaded");

const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const EMAIL = "prachi1095.be23@chitkara.edu.in";

/* ---------------- HEALTH API ---------------- */
app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});

/* ---------------- BFHL API ---------------- */
app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    const keys = Object.keys(body || {});

   
    
    
    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        error: "Exactly one key is required"
      });
    }

    const key = keys[0];
    let result;



    if (key === "fibonacci") {
      const n = body.fibonacci;
      if (!Number.isInteger(n) || n <= 0) {
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "Invalid fibonacci input"
        });
      }
      result = [];
      let a = 0, b = 1;
      for (let i = 0; i < n; i++) {
        result.push(a);
        [a, b] = [b, a + b];
      }
    }



    else if (key === "prime") {
      const arr = body.prime;
      if (!Array.isArray(arr)) {
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "Prime input must be an array"
        });
      }
      const isPrime = (num) => {
        if (!Number.isInteger(num) || num < 2) return false;
        for (let i = 2; i * i <= num; i++) {
          if (num % i === 0) return false;
        }
        return true;
      };
      result = arr.filter(isPrime);
    }



    else if (key === "lcm") {
      const arr = body.lcm;
      if (!Array.isArray(arr) || arr.length === 0) {
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "LCM input must be a non-empty array"
        });
      }
      const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
      const lcm2 = (a, b) => Math.abs(a * b) / gcd(a, b);
      result = arr.reduce((acc, val) => lcm2(acc, val));
    }



    else if (key === "hcf") {
      const arr = body.hcf;
      if (!Array.isArray(arr) || arr.length === 0) {
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "HCF input must be a non-empty array"
        });
      }
      const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
      result = arr.reduce((acc, val) => gcd(acc, val));
    }




    else if (key === "AI") {
      const question = body.AI;
      if (typeof question !== "string" || !question.trim()) {
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "AI input must be a non-empty string"
        });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          is_success: false,
          official_email: EMAIL,
          error: "AI API key not configured"
        });
      }


      const aiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: question }] }]
        }
      );

      const text =
        aiRes?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Single-word response only
      result = text.trim().split(/\s+/)[0] || "";
    }

    else {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        error: "Invalid key"
      });
    }

    return res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data: result
    });
  } catch (err) {
    return res.status(500).json({
      is_success: false,
      official_email: EMAIL,
      error: "Server error"
    });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
