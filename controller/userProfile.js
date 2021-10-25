const User = require("../models/userProfile");
const redis = require("../helper/redis");

class UserProfile {
  async create(req, res) {
    try {
      const data = req.body;

      const response = await User.findOneAndUpdate(
        { username: data.username },
        { ...data },
        { upsert: true, new: true, runValidators: true }
      );

      const isUserCached = await redis.get(`user:${response.username}`);

      if (isUserCached) {
        redis.set(`user:${response.username}`, JSON.stringify(response), "EX", 60*15);
      }
      return res.json({ data: response, error: null }).status(200);
    } catch (error) {
      console.error("Error in creating user", error.message);
      return res.status(422).json({ error: error.message, data: null });
    }
  }

  async get(req, res) {
    try {
      const { search = "" } = req.query;

      let userProfiles = [];
      if (!search) {
        const isAllUserCached = await redis.get("all:user:profile");

        if (!isAllUserCached) {
          userProfiles = await User.find({});
          redis.set("all:user:profile", JSON.stringify(userProfiles), "EX", 60 * 15);
          return res.json({ data: userProfiles, error: null }).status(200);
        }

        userProfiles = JSON.parse(isAllUserCached);
        return res.json({ data: userProfiles, error: null }).status(200);
      }

      const isSearchedCached = await redis.sinter(`user:headline:summary:${search}`)
      if (isSearchedCached.length) {
        userProfiles = JSON.parse(isSearchedCached);
        return res.json({ data: userProfiles, error: null }).status(200);
      }
      
      userProfiles = await User.find({ $text: { $search: search } });
      redis.sadd(`user:headline:summary:${search}`, JSON.stringify(userProfiles));
      return res.json({ data: userProfiles, error: null }).status(200);
    } catch (error) {
      console.error("Error in fetching user", error.message);
      return res.status(422).json({ error: error.message });
    }
  }
}

module.exports = new UserProfile();
