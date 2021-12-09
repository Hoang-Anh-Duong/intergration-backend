const config = require("config.json");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const sendMail = require("_helpers/sendMail");
const jwt = require("_helpers/jwt");

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  verifiedMail,
};

async function authenticate({ username, password }) {
  const user = await db.User.scope("withHash").findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.hash)))
    throw "Username or password is incorrect";

  if (!user.isActive) throw "Please check mail and vertified";

  // authentication successful
  const token = await jwt.generateToken(user, config.secret, "7d");
  return { ...omitHash(user.get()), token };
}

async function getAll() {
  return await db.User.findAll();
}

async function getById(id) {
  return await getUser(id);
}

async function create(params) {
  // validate
  if (await db.User.findOne({ where: { username: params.username } })) {
    throw 'Username "' + params.username + '" is already taken';
  }

  // hash password
  if (params.password) {
    params.hash = await bcrypt.hash(params.password, 10);
  }

  // save user
  const user = await db.User.create(params);

  console.log(user.get());
  // send mail vertified
  const token = await jwt.generateToken(user.get(), config.secret, "7d");
  const options = {
    from: config.emailHost,
    to: params.email,
    subject: "Xác Nhận Gmail",
    template: "mail-verified-template",
    context: {
      name: params.username,
      linkVerified: "http://localhost:3000/users/verifiedMail/" + token,
    },
  };
  sendMail(options);

  return token;
}

async function update(id, params) {
  const user = await getUser(id);

  // validate
  const usernameChanged = params.username && user.username !== params.username;
  if (
    usernameChanged &&
    (await db.User.findOne({ where: { username: params.username } }))
  ) {
    throw 'Username "' + params.username + '" is already taken';
  }

  // hash password if it was entered
  if (params.password) {
    params.hash = await bcrypt.hash(params.password, 10);
  }

  // copy params to user and save
  Object.assign(user, params);
  await user.save();

  return omitHash(user.get());
}

async function _delete(id) {
  const user = await getUser(id);
  await user.destroy();
}

async function verifiedMail(token) {
  const detoken = await jwt.verifyToken(token, config.secret);
  // get user by detoken
  let user = await db.User.findOne({
    where: {
      username: detoken.data.username,
      id: detoken.data.id,
      email: detoken.data.email,
    },
  });
  console.log(detoken.data.username);
  console.log(user.get());

  // verified token
  if (!user) {
    throw "Verified fail!";
  }

  // active account and save user
  user.isActive = true;
  await user.save();
}

// helper functions

async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw "User not found";
  return user;
}

function omitHash(user) {
  const { hash, ...userWithoutHash } = user;
  return userWithoutHash;
}
