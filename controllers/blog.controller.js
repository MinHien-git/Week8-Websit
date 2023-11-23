let models = require("../models");

let controller = {
  showList: async function (req, res) {
    res.locals.blogs = await models.Blog.findAll({
      attributes: ["id", "title", "imagePath", "summary", "createdAt"],
      include: [{ model: models.Comment }],
    });
    res.render("index");
  },
  showDetails: async function (req, res) {
    let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
    res.locals.blog = await models.Blog.findOne({
      attributes: ["id", "title", "description", "createdAt"],
      where: { id: id },
      include: [
        { model: models.Tag },
        { model: models.Category },
        { model: models.User },
        { model: models.Comment },
      ],
    });
    res.render("details");
  },
};
module.exports = controller;
