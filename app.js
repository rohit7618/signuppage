const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const port = 3000;
const apiKey = "d5601c9ef9e91c1079c46bfb39361ef6-us20";
const audienceListId = "91fdb1a98b";
const dc = "us21"; // Data center specific to your Mailchimp account

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.listen(port|| process.env.PORT, function() {
  console.log("Server started and listening on port", port);
});

app.post("/", function(req, res) {
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const mail = req.body.email;

  const data = {
    members: [
      {
        email_address: mail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname
        }
      }
    ]
  };

  jsonData = JSON.stringify(data);

  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceListId}`;

  const options = {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`Rohit1:${apiKey}`).toString("base64")}`
    }
  };

  const request = https.request(url, options, function(response) {
     let data = "";
    response.on("data", function(chunk) {
      data += chunk;
    });

    response.on("end", function() {
       console.log(JSON.parse(data));
      if(response.statusCode===200)
      {
      res.sendFile(__dirname+"/success.html");
      }
      else
      {
        res.sendFile(__dirname+"/failure.html");
      }

    });
  });

  request.write(jsonData);
  request.end();
});
app.post("/failure",function(req,res)
{
  res.redirect("/");
});
