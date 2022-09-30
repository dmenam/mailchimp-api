//HEROKU
const cool = require('cool-ascii-faces');

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("mailchimp-marketing");

const app = express();

//Use static resources
app.use(express.static("public"));
//Use Body Parser
app.use(bodyParser.urlencoded({extended:false}));

const port = process.env.PORT || 3000;

//API KEY
//7ba4ddc0f4e7abea155c46c08e129a44-us13

// Unique ID for audience
// be02957aa1

mailchimp.setConfig({
  apiKey: "7ba4ddc0f4e7abea155c46c08e129a44-us13",
  server: "us13",
});

app.get('/cool', (req, res) => res.send(cool()));

app.get("/",(req,res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const name = req.body.fname;
  const lastname = req.body.lname;
  const email = req.body.email;
  console.log(name, lastname, email);

  const run = async () => {
  const response = await mailchimp.lists.batchListMembers("be02957aa1", {
    members:[{
      email_address:email,
      status:"subscribed",
      merge_fields:{
        FNAME: name,
        LNAME: lastname
      }
    }],
  });
    console.log(response.error_count);
    if (response.error_count>0) {
      res.sendFile(__dirname + "/failure.html");
    }
    else{
      res.sendFile(__dirname + "/success.html");
    }
  }

  run();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(port,function(){
  console.log("Server running on port: " + port);
});
