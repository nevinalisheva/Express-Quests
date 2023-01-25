const database = require("./database");

const getUsers = (req, res) => {
  let sql = "SELECT id, firstname, lastname, email, city, language FROM users";
  const sqlValues = [];

  if (req.query.language !=null) {
    sql += " where language = ?";
    sqlValues.push(req.query.language);
    if (req.query.city != null) {
      sql += " and city = ?";
      sqlValues.push(req.query.city)
    }
  } else if (req.query.city != null) {
    sql += " where city = ?";
    sqlValues.push(req.query.city);
  } 
  // console.log(req.query)
    database
      .query(sql, sqlValues)
      .then(([users]) => {
        res.json(users);
        res.status(200);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error retrieving data from database");
      });
};



const getUserById = (req, res) => {
  const id = req.params.id;
  database
    .query(
      "SELECT id, firstname, lastname, email, city, language FROM users WHERE id = ?",
      [id]
    )
    .then(([users]) => {
      if (users[0] != null) {
        res.status(200);
        res.json(users[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving data from database");
    });
};

  const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
    const {email} = req.body;

    database
      .query(
        "SELECT id, firstname, lastname, email, city, language, hashedPassword FROM users WHERE email = ?",
        [email]
      )
      .then(([users]) => {
        if (users[0] != null) {
          req.user=(users[0]);
          next();
        } else {
          res.status(401);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error retrieving data from database");
      });
  }; 


//post with "password" instead of "hashedPassword"
const postUser = (req, res) => {
  const { firstname, lastname, email, city, language, hashedPassword } = req.body;
  database
    .query(
      "INSERT INTO users (firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language, hashedPassword]
    )
    .then(([result]) => {
      res.location(`/api/users`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the user");
    });
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language, hashedPassword } =
    req.body;
  database
    .query(
      "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ?, hashedPassword = ? WHERE id = ?",
      [firstname, lastname, email, city, language, hashedPassword, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the user");
    });
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("DELETE FROM users WHERE id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting user");
    });
};

module.exports = {
  getUsers,
  getUserByEmailWithPasswordAndPassToNext,
  getUserById,
  postUser,
  updateUser,
  deleteUser,
};
