var express = require("express");
var router = express.Router();
const List = require("../models/lists");
const Task = require("../models/tasks");
const User = require("../models/users");

//créer un document dans la collection lists
router.post("/", (req, res) => {
  const newList = new List({
    title: req.body.title,
    tasks: [],
    author: req.body.userId,
    access: [],
  });

  newList.save().then((newDoc) => {
    if (newDoc) {
      res.json({ result: true, newDoc });
    } else {
      res.json({ result: false, error: "List not created" });
    }
  });
});

//*supprimer un document dans la collection list et task correspondant
router.delete("/deleteList", (req, res) => {
  List.deleteOne({ _id: req.body.listId }).then((data) => {
    if (data) {
      Task.deleteMany({ author: req.body.listId }).then((task) => {
        if (task) {
          res.json({ result: true, task });
        } else {
          res.json({ result: false, error: "no tasks delete" });
        }
      });
    } else {
      res.json({ result: false, error: "Nothing delete" });
    }
  });
});

//créer un document dans la collection tasks
router.post("/newTask", (req, res) => {
  const newTask = new Task({
    name: req.body.name,
    isFinished: false,
    author: req.body.listId,
  });

  newTask.save().then((newDoc) => {
    List.findByIdAndUpdate(req.body.listId, {
      $push: { tasks: newDoc._id },
    }).then((data) => {
      if (data) {
        res.json({ result: true, newDoc });
      } else {
        res.json({ result: false, error: "Task not created" });
      }
    });
  });
});

//*supprimer un document dans la collection task
router.delete("/deleteTask", (req, res) => {
  Task.deleteOne({ _id: req.body.taskId }).then((data) => {
    if (data) {
      List.findByIdAndUpdate(req.body.listId, {
        $pull: { tasks: req.body.taskId },
      }).then(res.json({ result: true, data }));
    } else {
      res.json({ result: false, error: "no tasks delete" });
    }
  });
});

//*afficher toutes les lists en fonction de l'utilisateur
router.get("/:userId", (req, res) => {
  List.find({ author: req.params.userId })
    .populate("tasks")
    .populate("author", "access")
    .then((data) => {
      if (data) {
        res.json({ result: true, data });
      } else {
        res.json({ result: false, error: "No lists" });
      }
    });
});

//*afficher toutes les taches d'une liste
router.get("/one/:listId", (req, res) => {
  List.findById(req.params.listId)
    .populate("tasks")
    .populate("author", "access")
    .then((data) => {
      if (data) {
        res.json({ result: true, data });
      } else {
        res.json({ result: false, error: "No lists" });
      }
    });
});

//*partager une liste à un autre utilisateur
router.post("/share", (req, res) => {
  List.findById(req.body.listId).then((data) => {
    if (data.access && data.access.includes(req.body.userId)) {
      console.log(data.access);
      res.json({ result: false, error: "already share" });
    } else {
      List.findByIdAndUpdate(req.body.listId, {
        $push: { access: req.body.userId },
      }).then((data) => {
        if (data) {
          res.json({ result: true, message: "add user" });
        } else {
          res.json({ result: false, error: "no found list" });
        }
      });
    }
  });
});

//*afficher toutes les listes partagés
router.get("/share/:userId", (req, res) => {
  List.find({ access: { $eq: req.params.userId } })
    .populate("tasks")
    .populate("author", "access")
    .then((data) => {
      if (data) {
        res.json({ result: true, data });
      } else {
        res.json({ result: false, error: "No lists" });
      }
    });
});

//*Mofifier en base de donnée isFinished d'une tache
router.post("/isFinished", (req, res) => {
  Task.findById(req.body.taskId).then((data) => {
    if (data.isFinished) {
      Task.updateOne({ _id: req.body.taskId }, { isFinished: false }).then(
        (task) => {
          if (task) {
            res.json({ result: true, data });
          }
        }
      );
    } else {
      Task.updateOne({ _id: req.body.taskId }, { isFinished: true }).then(
        (task) => {
          if (task) {
            res.json({ result: true, data });
          }
        }
      );
    }
  });
});

//*modifier le nom d'une tache
router.post("/nameTask", (req, res) => {
  Task.updateOne({ _id: req.body.taskId}, {name: req.body.name}).then((data) => {
    if(data){
      res.json({result: true, data});
    } else {
      res.json({result: false, error: "Task not found"})
    }
  })
})

module.exports = router;
