const mongoose = require('mongoose');
const express=require('express');
const app=express();
const bodyParser = require("body-parser");
const ejs = require("ejs");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});
const articleSchema=new mongoose.Schema({
    title:String,
    content: String
  });
const Article = mongoose.model('Article', articleSchema);
// const article1 = new Article({
//     title : "API",
//     content : "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
// });
// const article2 = new Article({
//   title:"REST",
//   content:"REST stands for REpresentational State Transfer"
// });
// const article3 = new Article(
//   {title : "Bootstrap",content : "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
// });
// const article4 = new Article({
//     title : "DOM",
//     content: "The Document Object Model is like an API for interacting with our HTML"
// });
// Article.insertMany([article1,article2,article3,article4],function(err)
// {
//   if(err)
//   {
//     console.log(err);
//   }
//   else
//   {
//     console.log("successfully added persons to the databse");
//     mongoose.connection.close();
//   }
// });
app.post("/articles",function(req,res){
  const newArticle=new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if(err){
      res.send(err);
    }
    else{
      res.send("post request successfull");
    }
  });

});
app.get("/articles",function(req,res){
  Article.find(function(err,articles)
  {
    if(err)
    {
      console.log(err);
      res.send(err);
    }
     else
     {
       console.log("successfully fetched articles from the databse");
       res.send(articles);
       //mongoose.connection.close();
     }
 });
});
app.get('/articles/:id', function(req , res){
  const reqTitle=req.params.id;
  Article.find({title:reqTitle},function(err,foundArticle){
    if(err){
      res.send(err);
    }
    else{
      if(foundArticle){
        res.send(foundArticle);
      }
      else{
        res.send("no matching article found");
      }
    }
  });
});
app.delete("/articles",function(req,res){
  Article.deleteMany(function(err){
    if(err){
      res.send(err);
    }
    else{
      res.send("deletion successfull");
    }
  });
});
app.delete('/articles/:id', function(req , res){
  const reqTitle=req.params.id;
  Article.deleteMany({title:reqTitle},function(err){
    if(err){
      console.log(err);
      res.send(err);
    }
    else{
        res.send("deletion successfull");
    }
  });
});
app.put('/articles/:id', function(req , res){
  const reqTitle=req.params.id;
  Article.update({title:reqTitle},{title:req.body.title,content:req.body.content},{overwrite:true},function(err){
    if(err){
      console.log(err);
      res.send(err);
    }
    else{
        res.send("updation successfull");
    }
  });
});
app.patch('/articles/:id', function(req , res){
  const reqTitle=req.params.id;
  Article.update({title:reqTitle},{$set:req.body},function(err){
    if(err){
      console.log(err);
      res.send(err);
    }
    else{
        res.send("updation successfull");
    }
  });
});
app.listen(process.env.PORT || 3000, function()
{
  console.log("server started at port 3000");
});
