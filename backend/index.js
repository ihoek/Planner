const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// CORS 허용
app.use(cors());
app.use(express.json());

// API 예시
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express backend!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
