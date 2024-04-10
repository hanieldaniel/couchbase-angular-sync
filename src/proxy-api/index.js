const express = require("express");
const cors = require("cors");
const url = require("url");
var morgan = require("morgan");

const needle = require("needle");
const { urlencoded } = require("express");
const app = new express();
const PORT = 4000;
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

const API_URL = "http://localhost:4985/projects";
const username = "admin";
const password = "testing";
const headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append(
  "Authorization",
  "Basic " + Buffer.from(username + ":" + password).toString("base64"),
);

app.post("/api/session", async (req, res) => {
  try {
    const apiResponse = await fetch(`${API_URL}/_session`, {
      method: "POST",
      headers,
      body: JSON.stringify(req.body),
    });

    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ ex });
  }
});

app.get("/api/user", async (req, res) => {
  try {
    const apiResponse = await fetch(`${API_URL}/_user/demo@example.com`, {
      method: "GET",
      headers,
    });

    data = await apiResponse.json();
    res.status(200).json(data);
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ ex });
  }
});

app.listen(PORT, () => console.log(`Proxy server listening at port ${PORT}`));
