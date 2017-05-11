var Router = require("vertx-web-js/router");
var StaticHandler = require("vertx-web-js/static_handler");
var BodyHandler = require("vertx-web-js/body_handler");

vertx.deployVerticle("MongoVerticle");

var router = Router.router(vertx);
router.route("/static/*").handler(
		StaticHandler.create().setWebRoot("web").handle);

router.route("/book").handler(BodyHandler.create().handle);
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

var options = {
		  "logActivity" : true
		};

var server = vertx.createHttpServer(options);
server.requestHandler(router.accept).listen(8080);