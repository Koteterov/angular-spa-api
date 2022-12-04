const router = require("express").Router();
const api = require("../services/user");
const validator = require("validator");

const { SESSION_NAME } = require("../config/constants");
const { isAuth } = require("../middlewares/guards");

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email!");
    }

    const result = await api.register(firstName, lastName, email, password);
    const token = result.accessToken;
    const oneDay = 24 * 60 * 60 * 1000;

    res.cookie(SESSION_NAME, token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: oneDay,
      // domain: "angular-spa-api.onrender.com",
    });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await api.login(email, password);
    const token = result.accessToken;
    const oneDay = 24 * 60 * 60 * 1000;

    res.cookie(SESSION_NAME, token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 10000,
      // maxAge: oneDay,
      // domain: "angular-spa-api.onrender.com",
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.post("/logout", (req, res) => {
  try {
    api.logout(req.user?.token);

    res.clearCookie(SESSION_NAME, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 0,
      // domain: "angular-spa-api.onrender.com",
    });

    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/profile", isAuth(), async (req, res) => {
  try {
    const result = await api.getProfileInfo(req.user._id);

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
