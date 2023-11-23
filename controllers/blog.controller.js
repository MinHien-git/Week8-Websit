let models = require("../models");

let controller = {
  showList: async function (req, res) {
    let page = parseInt(req.query.page) || 1;
    let category = req.query.category || "All";
    // .toArray()
    // .slice(start, end);
    res.locals.blogs = await models.Blog.findAll({
      attributes: ["id", "title", "imagePath", "summary", "createdAt"],
      include: [
        { model: models.Category },
        { model: models.Tag },
        { model: models.Comment },
      ],
    });
    let per_page = 4;
    let start = (page - 1) * per_page;
    let end = page * per_page;
    let max_page = res.locals.blogs.length / per_page;
    if (category !== "All")
      res.locals.blogs = res.locals.blogs.filter(
        (i) => i.Category.name === category
      );

    res.locals.blogs = res.locals.blogs.slice(start, end);
    console.log(res.locals.blogs);
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
