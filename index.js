const express = require("express");
const app = express();
const port = 4000 || process.env.PORT;
const expressHbs = require("express-handlebars");

app.use(express.urlencoded({ extended: true }));
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
      times: function (n, block) {
        var accum = "";
        for (var i = 0; i < n; ++i) {
          block.data.index = i;
          block.data.first = i === 0;
          block.data.last = i === n - 1;
          accum += block.fn(this);
        }
        return accum;
      },
      math: function (lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
          "+": lvalue + rvalue,
          "-": lvalue - rvalue,
          "*": lvalue * rvalue,
          "/": lvalue / rvalue,
          "%": lvalue % rvalue,
        }[operator];
      },
      when: function (operand_1, operator, operand_2, options) {
        var operators = {
            gteq: function (l, r) {
              return Number(l) >= Number(r);
            },
            lteq: function (l, r) {
              return Number(l) <= Number(r);
            },
            lt: function (l, r) {
              return Number(l) < Number(r);
            },
            gt: function (l, r) {
              return Number(l) > Number(r);
            },
          },
          result = operators[operator](operand_1, operand_2);

        if (result) return options.fn(this);
        else return options.inverse(this);
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
