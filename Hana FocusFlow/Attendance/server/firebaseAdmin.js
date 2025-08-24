// server/firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./firebase/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://<YOUR_PROJECT>.firebaseio.com"
});

module.exports = admin;
