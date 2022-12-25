const Item = require("../models/Item");
const router = require("express").Router();
const formidable = require("formidable");
const excelToJson = require("convert-excel-to-json");

// http://localhost:5000/items/pagintate?page=1&size=10
router.get("/paginate", async (req, res, next) => {
  try {
    let keyword = req.query.q
      ? {
          name: { $regex: req.query.q, $options: "i" },
        }
      : {};

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.size) || 10;

    const count = await Item.countDocuments({ ...keyword });
    const pages = Math.ceil(count / pageSize);

    const items = await Item.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort("-updatedAt");

    res.status(200).send({ items, page, pages });
  } catch (error) {
    next(error);
  }
});

// Create a item
router.post("/", async (req, res, next) => {
  try {
    // create new items
    const item = await Item(req.body);
    const response = await item.save();
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

//List all items
router.get("/export", async (req, res, next) => {
  try {
    let items = await Item.find().select("name description");
    res.status(201).json(items);
  } catch (error) {
    next(error);
  }
});

//List all items
router.get("/", async (req, res, next) => {
  try {
    let items = await Item.find().select("_id name description createdAt");
    res.status(201).json(items);
  } catch (error) {
    next(error);
  }
});

//Fetch a item
router.get("/:id", async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

//Update a item
router.put("/:id", async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

//Delete a item
router.post("/more", async (req, res, next) => {
  try {
    const response = await Item.deleteMany({ _id: { $in: req.body } });
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

//Delete a item
router.delete("/:id", async (req, res, next) => {
  try {
    const response = await Item.findByIdAndDelete(req.params.id);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// import customers
router.post("/import", async (req, res, next) => {
  try {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400).json({
          message: "Data could not be uploaded",
        });
      }

      const { data } = excelToJson({
        sourceFile: files.excelFile.filepath,
        columnToKey: {
          A: "name",
          B: "description",
        },
      });

      data.map(async (d) => {
        try {
          const item = new Item(d);
          const response = await item.save();
          res.status(201).json(response);
        } catch (error) {
          next(error);
        }
      });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
