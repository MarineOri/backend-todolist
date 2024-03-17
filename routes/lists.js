var express = require("express");
var router = express.Router();
const List = require("../models/lists");
const Task = require("../models/tasks");
const User = require("../models/users");

//créer un document dans la collection lists
router.post("/", (req, res) => {
  List.findOne({ title: req.body.title }).then((data) => {
    if (data === null) {
      const newList = new List({
        title: req.body.title,
        tasks: [],
        author: req.body.userId,
        access: [],
      });

      newList.save().then((newDoc) => {
        User.findByIdAndUpdate(req.body.userId, {
          $push: { lists: newDoc._id },
        }).then(res.json({ result: true, newDoc }));
      });
    } else {
      res.json({ result: false, error: "Title List already exists" });
    }
  });
});

//créer un document dans la collection tasks
router.post("/newMark", (req, res) => {
  Task.findOne({ title: req.body.name }).then((data) => {
    if (data === null) {
      const newTask = new Task({
        name: req.body.name,
        isFinished: false,
        author: req.body.listId,
      });

      newTask.save().then((newDoc) => {
        List.findByIdAndUpdate(req.body.listId, {
          $push: { tasks: newDoc._id },
        }).then(res.json({ result: true, newDoc }));
      });
    } else {
      res.json({ result: false, error: "Title List already exists" });
    }
  });
});

//*afficher toutes les lists en fonction de l'utilisateur
router.get("/:userId", (req, res) => {
  List.find({ author: req.params.userId })
    .populate("lists")
    .populate("tasks")
    .then((data) => {
      if (data) {
        res.json({ result: true, data });
      } else {
        res.json({ result: false, error: "No lists" });
      }
    });
});

//*afficher toutes les lists en fonction de l'utilisateur
// router.get("/:userId", (req, res) => {
//     User.find({ author: req.params.userId })
//       .populate("lists").populate("tasks")
//       .then((data) => {
//         if (data) {
//           res.json({ result: true, data });
//         } else {
//           res.json({ result: false, error: "No lists" });
//         }
//       });
//   });

module.exports = router;
