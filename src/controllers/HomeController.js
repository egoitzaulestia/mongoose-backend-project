const HomeController = {
  async welcome(req, res) {
    try {
      return res.status(200).json({
        message:
          "🎉 Welcome to the Social Media API! Everything's up and running.",
      });
    } catch (err) {
      console.error("HomeController.welcom:", err);
      return res.status(500).json({
        message: "Server error while loading Social Media API home endpoint",
      });
    }
  },
};

module.exports = HomeController;
