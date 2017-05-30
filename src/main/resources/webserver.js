//var vertx = require('vertx');
var Router = require("vertx-web-js/router");
var StaticHandler = require("vertx-web-js/static_handler");
var BodyHandler = require("vertx-web-js/body_handler");

//vertx.deployVerticle("MongoVerticle");
vertx.deployVerticle("MongoClientVerticle");

var router = Router.router(vertx);
router.route("/static/*").handler(StaticHandler.create().setWebRoot("web").handle);
//router.route("/book").handler(BodyHandler.create().handle);

router.route("/questions").handler(BodyHandler.create().handle);
router.route("/questions/*").handler(BodyHandler.create().handle);


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


//router.post("/questions/:qID/answers").handler(handleAddQuestion);
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

//router.put("/questions/:qID/answers/:aID").handler(handleAddQuestion);
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

//router.put("/questions/:qID/answers/:aID/upvote").handler(handleAddQuestion);
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

//router.put("/questions/:qID/upvote").handler(handleAddQuestion);
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

//router.put("/questions/:qID/answers/:aID/downvote").handler(handleAddQuestion);
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

//router.put("/questions/:qID/downvote").handler(handleAddQuestion);
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

//TODO : how to define route for search api with query parameters -  questions?[tag=][title=][description=]
//router.get("/questions?[tag=][title=][description=]").handler(handleGetQuestion);
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


var options = { "logActivity" : true };
var server = vertx.createHttpServer(options);
server.requestHandler(router.accept).listen(8084);


/*
//TODO : vertx library example ..cleanup later
router.post("/book").handler(
		function(rctx) {
			console.log("POST...");
			vertx.eventBus().send(
					"com.glarimy.vertx.library.post",
					rctx.getBodyAsJson(),
					function(reply, err) {
						rctx.response().setStatusCode(200)
							.putHeader("Content-Type", "application/json")
							.putHeader("Location", reply.body())
							.end();
					});

		});


router.get("/book/:isbn").handler(
		function(rctx) {
			console.log("GET...");
			vertx.eventBus().send(
					"com.glarimy.vertx.library.get",
					{"isbn": rctx.request().getParam("isbn")},
					function(reply, err) {
						rctx.response().setStatusCode(200).putHeader(
								"Content-Type", "application/json").end(
								reply.body());
					});

		});

router.get("/book").handler(
		function(rctx) {
			vertx.eventBus.send(
					"com.glarimy.vertx.library.get.all",
					null,
					function(reply, err) {
						
					});
			
    });
*/

