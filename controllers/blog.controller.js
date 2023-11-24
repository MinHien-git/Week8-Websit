let models = require("../models");
const { Op } = require("sequelize");

let controller = {
  showList: async function (req, res) {
    let page = parseInt(req.query.page) || 1;
    let category = req.query.category || "All";
    let search = req.query.search || "";
    console.log("search ", search);
    let tags = req.query.tags ? req.query.tags.split(".") : [];
    var condition = search ? { title: { [Op.iLike]: `%${search}%` } } : null;
    res.locals.blogs = await models.Blog.findAll({
      attributes: ["id", "title", "imagePath", "summary", "createdAt"],
      where: condition,
      include: [
        { model: models.Category },
        { model: models.Tag },
        { model: models.Comment },
      ],
    });

    res.locals.tags = await models.Tag.findAll({
      attributes: ["id", "name"],
    });

    res.locals.categories = await models.Category.findAll({
      attributes: ["id", "name"],
    });

    let per_page = 4;
    let start = (page - 1) * per_page;
    let end = page * per_page;
    if (category !== "All")
      res.locals.blogs = res.locals.blogs.filter(
        (i) => i.Category.name === category
      );
    console.log(tags);
    if (tags.length > 0) {
      res.locals.blogs = res.locals.blogs.filter((i) => {
        let exists = 0;
        i.Tags.map((j) => {
          if (tags.map((z) => z.name === j.name)) ++exists;
        });
        if (exists === tags.length) {
          return i;
        }
      });
    }
    let max_page = res.locals.blogs.length / per_page;
    res.locals.blogs = res.locals.blogs.slice(start, end);
    res.render("index", { max: Math.ceil(max_page), current: page, min: 1 });
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
