vertx.eventBus().consumer("com.glarimy.vertx.bank", function(message) {
	var params = message.body();
	var i = parseInt(params.p) * parseInt(params.r) * parseInt(params.t) / 100;
	var result = {
		"i" : i
	};
	message.reply(JSON.stringify(result));
});