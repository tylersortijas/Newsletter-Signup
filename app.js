const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', function(req, res){
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/ce4ab2de5b";

    const options = {
        method: "post", 
        auth: "tyler1:1848c1b5282b0004993de3e943563ccb-us14"
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});



app.post("/failure", function(req, res){
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function () {
    console.log("The server has started up in port 3000");
});

// API Key
// 1848c1b5282b0004993de3e943563ccb-us14

// List Id
// ce4ab2de5b