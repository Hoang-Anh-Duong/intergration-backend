const config = require("config.json");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const sendMail = require("_helpers/sendMail");
const jwt = require("_helpers/jwt");

module.exports = {
  updateSetting,
  getSetting,
};

async function getSetting(data) {
  let oldSetting = await db.Setting.findOne({
    where: { user_id: data.id },
  });

  return oldSetting;
}

async function updateSetting(data) {
  let oldSetting = await db.Setting.findOne({
    where: { user_id: data.user.id },
  });
  if (oldSetting) {
    oldSetting = await oldSetting.update({
      trelloKeyApi: data.setting.trelloKeyApi,
      trelloToken: data.setting.trelloToken,
      dropboxToken: data.setting.dropboxToken,
      slackToken: data.setting.slackToken,
    });
    return oldSetting;
  }

  const newSetting = {
    user_id: data.user.id,
    trelloKeyApi: data.setting.trelloKeyApi,
    trelloToken: data.setting.trelloToken,
    dropboxToken: data.setting.dropboxToken,
    slackToken: data.setting.slackToken,
  };

  const settingSave = await db.Setting.create(newSetting);

  return settingSave;
}
