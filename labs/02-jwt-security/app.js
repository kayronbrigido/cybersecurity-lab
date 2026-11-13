
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

const users = {
  alice: {
    id: "user-123",
    name: "Alice",
    role: "user",
  },
};

app.post("/login", (req, res) => {
  const { username } = req.body;

  const user = users[username];

  if (!user) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "15m",
    }
  );

  res.json({ token });
});

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Missing token",
    });
  }

  const token = authorization.slice(7);

  try {
    req.user = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });

    next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}

app.get("/profile", authenticate, (req, res) => {
  res.json({
    message: "Authenticated successfully",
    user: req.user,
  });
});

app.get("/admin", authenticate, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Forbidden: administrator access required",
    });
  }

  res.json({
    message: "Welcome to the admin area!",
  });
});

app.listen(3000, "127.0.0.1", () => {
  console.log("JWT Security Lab running at http://127.0.0.1:3000");
});
