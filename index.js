const express = require("express");
const app = express();
const port = 4000;
const expressHbs = require("express-handlebars");

app.use(express.static(__dirname + "/html"));
app.engine(
  "hbs",
  expressHbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "layout",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
    helpers: {
      showDate: (date) => {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
  })
);

app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.use("/blogs", require("./routes/blog.router"));

app.get("/createTables", (req, res) => {
  let models = require("./models");
  models.sequelize.sync().then(() => {
    res.send("tables created");
  });
});

app.listen(port, () => console.log("listening to port ", port));
