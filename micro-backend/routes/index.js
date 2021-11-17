var express = require('express');
var router = express.Router();
const authentication = require("../validateAuth.json");
const moment = require("moment");
const insertData = require("../db-master/index")

/* GET home page. */
router.post('/', function (req, res, next) {
  console.log("req body == ", req.headers)
  if (typeof req.headers.authorization == 'undefined' || req.headers.authorization == "") {
    res.status(400).send({
      status: false,
      data: {},
      description: "",
      message: "Authorization is not passed in header."
    })
  } else if (typeof req.body.code != 'undefined' && req.body.code != "" && typeof req.body.name != 'undefined' && req.body.name != ""
    && typeof req.body.description != 'undefined' && typeof req.body.date != 'undefined' && req.body.date != "") {
      let authIndex = authentication.findIndex((elem) => elem.id == req.headers.authorization)
      let currentTime = Math.round(Date.now() / 1000)
      console.log(req.headers.authorization)
      console.log(currentTime)
      console.log(authIndex)
      console.log(authentication[authIndex])
      if(authIndex != -1 && authentication[authIndex].id == req.headers.authorization && authentication[authIndex].expiration > currentTime) {
        insertData(req.body, (err, resp) => {
          if(err){
             console.log("Error Occurred == ", err)
            res.status(500).send({
              status: false,
              data: {},
              description: "",
              message: "Something went wrong, please try again."
            })
          } else {
            let now = moment(authentication[authIndex].expiration).format("YYYY-MM-DD HH:mm:ss")
            let receivedDate = req.body.date.split("T").join(" ")
            let timeDiff = moment.utc(moment(receivedDate,"YYYY-MM-DD HH:mm:ss").diff(moment(now,"YYYY-MM-DD HH:mm:ss"))).format("HH:mm:ss")
            res.status(200).send({
              status: true,
              data: {TimeDiff: timeDiff},
              description: "",
              message: "Request processed successfully."
            })
          }
        })
      } else {
        res.status(400).send({
          status: false,
          data: {},
          description: "",
          message: "Authentication value is either not valid or expired."
        })
      }
  } else {
    res.status(400).send({
      status: false,
      data: {},
      description: "",
      message: "Request body is not in proper format."
    })
  }
});

module.exports = router;
