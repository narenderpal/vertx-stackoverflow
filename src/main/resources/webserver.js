//var vertx = require('vertx');
var Router = require("vertx-web-js/router");
var StaticHandler = require("vertx-web-js/static_handler");
var BodyHandler = require("vertx-web-js/body_handler");

vertx.deployVerticle("MongoClientVerticle");
vertx.deployVerticle("UserAuthVertical");

var router = Router.router(vertx);
router.route("/static/*").handler(StaticHandler.create().setWebRoot("web").handle);

router.route("/questions").handler(BodyHandler.create().handle);
router.route("/questions/*").handler(BodyHandler.create().handle);
router.route("/users").handler(BodyHandler.create().handle);
router.route("/users/*").handler(BodyHandler.create().handle);


//router.get("/questions").handler(handleListQuestions);
router.get("/questions").handler(
    function(rctx) {
        console.log("Get all questions...");
        vertx.eventBus().send(
            "com.cisco.vertx.questions.getAll",
            "",
            function(reply, err) {
                rctx.response().setStatusCode(200).putHeader(
                    "Content-Type", "application/json").end(
                    reply.body());
            });
    });

//router.post("/questions").handler(handleAddQuestion);
router.post("/questions").handler(
    function(rctx) {
        console.log("Add a question...");
        console.log(rctx.getBodyAsJson());

        vertx.eventBus().send(
            "com.cisco.vertx.questions.post",
            rctx.getBodyAsJson(),
            function(reply, err) {
                rctx.response().setStatusCode(201)
                    .putHeader("Content-Type", "application/json")
                    .putHeader("Location", reply.body())
                    .end();
            });

    });

//router.get("/questions/:qID").handler(handleGetQuestion);
router.get("/questions/:qID").handler(
    function(rctx) {
        console.log("Get a specific question...");
        vertx.eventBus().send(
            "com.cisco.vertx.questions.get",
            {"qID": rctx.request().getParam("qID")},
            function(reply, err) {
                rctx.response().setStatusCode(200).putHeader(
                    "Content-Type", "application/json").end(
                    reply.body());
            });
    });


router.post("/questions/:qID/answers").handler(
    function(rctx) {
        console.log("Answering a question...");
        var options = {
            headers: {
                "qID" : rctx.request().getParam("qID")
            }
        };
        vertx.eventBus().send(
            "com.cisco.vertx.answers.post",
            rctx.getBodyAsJson(),
            options,
            function(reply, err) {
                rctx.response().setStatusCode(201)
                    .putHeader("Content-Type", "application/json")
                    .putHeader("Location", reply.body())
                    .end();
            });
    });

router.put("/questions/:qID/answers/:aID").handler(
    function(rctx) {
        console.log("Updating an answer...");
        var options = {
            headers: {
                "qID": rctx.request().getParam("qID"),
                "aID": rctx.request().getParam("aID")
            }
        };
        vertx.eventBus().send(
            "com.cisco.vertx.answers.put",
            rctx.getBodyAsJson(),
            options,
            function(reply, err) {
                rctx.response().setStatusCode(201)
                    .putHeader("Content-Type", "application/json")
                    .putHeader("Location", reply.body())
                    .end();
            });
    });

//router.put("/questions/:qID/answers/:aID/upvote").handler();
router.put("/questions/:qID/answers/:aID/upvote").handler(
    function(rctx) {
        console.log("Upvote an answer...");
        vertx.eventBus().send(
            "com.cisco.vertx.answers.upvote",
            {"qID": rctx.request().getParam("qID"), "aID": rctx.request().getParam("aID")},
            rctx.getBodyAsJson(),
            function(reply, err) {
                rctx.response().setStatusCode(201)
                    .putHeader("Content-Type", "application/json")
                    .putHeader("Location", reply.body())
                    .end();
            });
    });

//router.put("/questions/:qID/upvote").handler();
router.put("/questions/:qID/upvote").handler(
    function(rctx) {
        console.log("Upvote a question...");
        vertx.eventBus().send(
            "com.cisco.vertx.questions.upvote",
            {"qID": rctx.request().getParam("qID")},
            rctx.getBodyAsJson(),
            function(reply, err) {
                rctx.response().setStatusCode(201)
                    .putHeader("Content-Type", "application/json")
                    .putHeader("Location", reply.body())
                    .end();
            });
    });

//router.put("/questions/:qID/answers/:aID/downvote").handler();
router.put("/questions/:qID/answers/:aID/downvote").handler(
    function(rctx) {
        console.log("Down vote an answer...");
        vertx.eventBus().send(
            "com.cisco.vertx.answers.downvote",
            {"qID": rctx.request().getParam("qID"), "aID": rctx.request().getParam("aID")},
            rctx.getBodyAsJson(),
            function(reply, err) {
                rctx.response().setStatusCode(201)
                    .putHeader("Content-Type", "application/json")
                    .putHeader("Location", reply.body())
                    .end();
            });
    });

//router.put("/questions/:qID/downvote").handler();
router.put("/questions/:qID/downvote").handler(
    function(rctx) {
        console.log("Down vote a question...");
        vertx.eventBus().send(
            "com.cisco.vertx.questions.downvote",
            {"qID": rctx.request().getParam("qID")},
            rctx.getBodyAsJson(),
            function(reply, err) {
                rctx.response().setStatusCode(201)
                    .putHeader("Content-Type", "application/json")
                    .putHeader("Location", reply.body())
                    .end();
            });
    });

//TODO : search questions -  questions?[tag=][title=][description=]
//router.get("/questions?[tag=][title=][description=]").handler();
/*
router.get("/questions/:qID").handler(
    function(rctx) {
        console.log("Search for questions...");
        vertx.eventBus().send(
            "com.cisco.vertx.questions.search",
            {"qID": rctx.request().getParam("qID")},
            function(reply, err) {
                rctx.response().setStatusCode(200).putHeader(
                    "Content-Type", "application/json").end(
                    reply.body());
            });
    }); */

//router.post("/questions").handler();
router.post("/users").handler(
    function(rctx) {
        console.log("Add a user...");
        console.log(rctx.getBodyAsJson());

        vertx.eventBus().send(
            "com.cisco.vertx.users.post",
            rctx.getBodyAsJson(),
            function(reply, err) {
                rctx.response().setStatusCode(201)
                    .putHeader("Content-Type", "application/json")
                    .putHeader("Location", reply.body())
                    .end();
            });

    });

//router.post("/users").handler();
router.post("/users/login").handler(
    function(rctx) {
        console.log("Login a user...");
        console.log(rctx.getBodyAsJson());

        vertx.eventBus().send(
            "com.cisco.vertx.users.login",
            rctx.getBodyAsJson(),
            function(reply, err) {
                rctx.response().setStatusCode(201)
                    .putHeader("Content-Type", "application/json")
                    .putHeader("Location", reply.body())
                    .end();
            });

    });

//router.post("/users").handler();
router.post("/users/logout").handler(
    function(rctx) {
        console.log("Logout a user...");
        console.log(rctx.getBodyAsJson());

        vertx.eventBus().send(
            "com.cisco.vertx.users.logout",
            rctx.getBodyAsJson(),
            function(reply, err) {
                rctx.response().setStatusCode(201)
                    .putHeader("Content-Type", "application/json")
                    .putHeader("Location", reply.body())
                    .end();
            });

    });

//router.get("/users").handler();
router.get("/users").handler(
    function(rctx) {
        console.log("Get all users...");
        vertx.eventBus().send(
            "com.cisco.vertx.users.getAll",
            "",
            function(reply, err) {
                rctx.response().setStatusCode(200).putHeader(
                    "Content-Type", "application/json").end(
                    reply.body());
            });
    });


var options = { "logActivity" : true };
var server = vertx.createHttpServer(options);
server.requestHandler(router.accept).listen(8084);


