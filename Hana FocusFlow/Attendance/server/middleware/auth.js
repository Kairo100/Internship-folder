// middleware/auth.js
const admin = require("../firebaseAdmin");
async function authenticate(req, res, next) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) return res.status(401).send("No token");
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded; // { uid, email, ... }
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
}
module.exports = authenticate;
