import com.fasterxml.jackson.databind.jsonFormatVisitors.JsonBooleanFormatVisitor;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;

public class MongoVerticle extends AbstractVerticle {
	
	@Override
	public void start(Future<Void> future) throws Exception {
		
		JsonObject config = new JsonObject();
        config.put("db_name", "cmad");
        config.put("connection_string", "mongodb://mongo:27017");
        MongoClient client = MongoClient.createShared(vertx, config);

        vertx.eventBus().consumer("com.glarimy.vertx.library.get", message -> {
        	System.out.println(message);
            
            JsonObject params = new JsonObject(message.body().toString());
            System.out.println(params);
            String isbn = params.getString("isbn");

            client.find("books", new JsonObject().put("isbn", Integer.parseInt(isbn)), res -> {
            	if (res.succeeded()) {
                	JsonObject book = res.result().get(0);
                    message.reply(Json.encodePrettily(book));
                } else {
                    res.cause().printStackTrace();
                    message.reply(res.result());
                }
            });
        });

        vertx.eventBus().consumer("com.glarimy.vertx.library.post", message -> {
        	System.out.println(message);
            JsonObject params = new JsonObject(message.body().toString());
            System.out.println(params);
            client.insert("books", params, res -> {
            	if (res.succeeded()) {
            		message.reply(res.result());
                } else {
                    res.cause().printStackTrace();
                    message.reply(res.result());
                }
            });
        });

    }
}
