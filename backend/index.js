const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Intent Drift Backend is running 🚀");
});

app.get("/test-db", async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: `test${Date.now()}@example.com`,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "DB error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
