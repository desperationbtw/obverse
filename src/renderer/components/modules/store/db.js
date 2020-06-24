const { app } = require("electron");
const path = require("path");
const Datastore = require("nedb-promises");

const dataFactory = (fileName) =>
  Datastore.create({
    filename: `${
      process.env.NODE_ENV === "development"
        ? path.join(__static, "data", String(fileName))
        : path.join(app.getAppPath("userData"), "data", String(fileName))
    }`,
    timestampData: true,
    autoload: true,
  });

const db = {
  user: dataFactory("users.db"),
  settings: dataFactory("settings.db"),
  proxy: dataFactory("proxies.db"),
  fingerprint: dataFactory("fingerprints.db"),
  session: dataFactory("sessions.db"),
};

module.exports = db;
