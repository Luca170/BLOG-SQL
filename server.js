const express = require("express")
const mysql = require("mysql2")
const app = express()

app.set("view engine" ,"ejs")
app.use(express.json())
app.use(express.static("public"))
app.use(express.urlencoded({extended:false}))

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "*****",
    database: "blogDb"
  });

  db.connect(err => {
      if(err) throw err
      console.log("Database connected")
      db.query("SELECT * FROM posts", (err,result) => {
          if(err) throw err
          console.log(result)
      })
  })

  app.get("/", (req,res) => {
      db.query("SELECT * FROM posts", (err,result) => {
          if(err) throw err
          res.render("home.ejs", {posts:result})
      })

  })
  app.post("/post", (req,res) => {
      let sql = "INSERT INTO posts (title,content,author) VALUES ?"
      let values = [[req.body.title,req.body.content,req.body.author]]
      db.query(sql,[values], (err,result) => {
          if(err) throw err
          console.log("Record inserted")
          res.redirect("/")
      })
  })
app.post("/delete", (req,res) => {
    let sql = "DELETE FROM posts WHERE id = ?"
    let value = [req.body.id]
    db.query(sql,value,(err,result) => {
        if(err) throw err
        console.log("1 record has been deleted")
        res.redirect("/")
    })
})
app.get("/edit", (req,res) => {
    res.render("edit.ejs", {id: req.query.id})
})
app.post("/edit/save", (req,res) => {
    let sql = "UPDATE posts SET title = ? WHERE id=?"
    let id = [req.body.id]
    let updatedTitle = [req.body.title] 
    let updatedContent = [req.body.content]
    let updatedAuthor = [req.body.author]
    db.query(sql, [updatedTitle, id], (err,result) => {
        if(err) throw err
        console.log("Updated title successfully")
    })
    db.query("UPDATE posts SET content = ?", [updatedContent, id], (err,result) => {
        if(err) throw err
        console.log("Content updated successfully")
    })
    db.query("UPDATE posts SET author = ?", [updatedAuthor, id], (err,result) => {
        if(err) throw err
        console.log("Author updated successfully")
        res.redirect("/")
    })
    
})
app.listen(8000)