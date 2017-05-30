import java.util.List;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Vertx;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

/**
 * Created by napal on 15/05/17.
 */
public class MongoClientVerticle extends AbstractVerticle {
    /*
  Convenience method so you can run it in your IDE
   */
    //public static void main(String[] args) {
      //  Runner.runExample(MongoClientVerticle.class);
    //}

    @Override
    public void start() throws Exception {

        JsonObject config = Vertx.currentContext().config();

        String uri = config.getString("mongo_uri");
        if (uri == null) {
            // running locally using local mongo
            //uri = "mongodb://localhost:27017";
            // using mongo docker container
            uri = "mongodb://mongo:27017";
        }
        String dbName = config.getString("mongo_db");
        if (dbName == null) {
            dbName = "cmad";
        }

        JsonObject mongoConfig = new JsonObject()
                .put("connection_string", uri)
                .put("db_name", dbName);

        MongoClient mongoClient = MongoClient.createShared(vertx, mongoConfig);

        JsonObject question = new JsonObject()
                .put("title", "First question")
                .put("description", "This is first question posted on stack overflow");

        mongoClient.save("questions", question, id -> {
            System.out.println("Inserted id: " + id.result());

            mongoClient.find("questions", new JsonObject().put("qid", "12355"), res -> {
                //System.out.println("Question title is " + res.result().get(0).getString("title"));
                System.out.println("Question title is " + res.result());

                //mongoClient.remove("questions", new JsonObject().put("qid", "12345"), rs -> {
                //    if (rs.succeeded()) {
                //        System.out.println("Question removed ");
                //    }
                //});
            });

        });

        vertx.eventBus().consumer("com.cisco.vertx.questions.getAll", message -> {
            System.out.println("headers:" + message.headers().toString());
            System.out.println("body:"+ message.body().toString());

            mongoClient.find("questions", new JsonObject(), result -> {
                if (result.succeeded()) {
                    List<JsonObject> questions = result.result();
                    message.reply(Json.encodePrettily(questions));
                } else {
                    result.cause().printStackTrace();
                    message.reply(result.result());
                }
            });
        });

        vertx.eventBus().consumer("com.cisco.vertx.questions.post", message -> {
            System.out.println("headers:" + message.headers().toString());
            System.out.println("body:"+ message.body().toString());

            JsonObject quest = new JsonObject(message.body().toString());
            //System.out.println(quest);
            mongoClient.save("questions", quest, id -> {
                if (id.succeeded()) {
                    message.reply(id.result());
                } else {
                    id.cause().printStackTrace();
                    message.reply(id.result());
                }
            });
        });

        vertx.eventBus().consumer("com.cisco.vertx.questions.get", message -> {
            System.out.println("headers:" + message.headers().toString());
            System.out.println("body:"+ message.body().toString());

            JsonObject params = new JsonObject(message.body().toString());
            System.out.println(params);
            String qID = params.getString("qID");

            mongoClient.find("questions", new JsonObject().put("_id", qID), res -> {
                if (res.succeeded()) {
                    JsonObject ques = res.result().get(0);
                    message.reply(Json.encodePrettily(ques));
                } else {
                    res.cause().printStackTrace();
                    message.reply(res.result());
                }
            });
        });

        vertx.eventBus().consumer("com.cisco.vertx.answers.post", message -> {
            System.out.println("headers:" + message.headers().get("qID"));
            System.out.println("body:"+ message.body());

            JsonObject params = new JsonObject(message.body().toString());
            String qID = params.getString("qID");

            mongoClient.insert("questions", params, res -> {
                if (res.succeeded()) {
                    message.reply(res.result());
                } else {
                    res.cause().printStackTrace();
                    message.reply(res.result());
                }
            });
        });

        vertx.eventBus().consumer("com.cisco.vertx.answers.put", message -> {
            System.out.println("headers:" + message.headers().toString());
            System.out.println("body:"+ message.body().toString());

            JsonObject params = new JsonObject(message.body().toString());
            System.out.println(params);
            String qID = params.getString("qID");
            String aID = params.getString("aID");

            mongoClient.insert("questions", params, res -> {
                if (res.succeeded()) {
                    message.reply(res.result());
                } else {
                    res.cause().printStackTrace();
                    message.reply(res.result());
                }
            });
        });

        vertx.eventBus().consumer("com.cisco.vertx.questions.upvote", message -> {
            System.out.println("headers:" + message.headers().toString());
            System.out.println("body:"+ message.body().toString());

            JsonObject params = new JsonObject(message.body().toString());
            System.out.println(params);
            String qID = params.getString("qID");

            mongoClient.insert("questions", params, res -> {
                if (res.succeeded()) {
                    message.reply(res.result());
                } else {
                    res.cause().printStackTrace();
                    message.reply(res.result());
                }
            });
        });

        vertx.eventBus().consumer("com.cisco.vertx.answers.upvote", message -> {
            System.out.println("headers:" + message.headers().toString());
            System.out.println("body:"+ message.body().toString());

            JsonObject params = new JsonObject(message.body().toString());
            System.out.println(params);
            String qID = params.getString("qID");
            String aID = params.getString("aID");

            mongoClient.insert("questions", params, res -> {
                if (res.succeeded()) {
                    message.reply(res.result());
                } else {
                    res.cause().printStackTrace();
                    message.reply(res.result());
                }
            });
        });

        vertx.eventBus().consumer("com.cisco.vertx.questions.downvote", message -> {
            System.out.println("headers:" + message.headers().toString());
            System.out.println("body:"+ message.body().toString());

            JsonObject params = new JsonObject(message.body().toString());
            System.out.println(params);
            String qID = params.getString("qID");

            mongoClient.insert("questions", params, res -> {
                if (res.succeeded()) {
                    message.reply(res.result());
                } else {
                    res.cause().printStackTrace();
                    message.reply(res.result());
                }
            });
        });

        vertx.eventBus().consumer("com.cisco.vertx.answers.downvote", message -> {
            System.out.println("headers:" + message.headers().toString());
            System.out.println("body:"+ message.body().toString());

            JsonObject params = new JsonObject(message.body().toString());
            System.out.println(params);
            String qID = params.getString("qID");
            String aID = params.getString("aID");

            mongoClient.insert("questions", params, res -> {
                if (res.succeeded()) {
                    message.reply(res.result());
                } else {
                    res.cause().printStackTrace();
                    message.reply(res.result());
                }
            });
        });

        // TODO : find out how to process query params
        /*
        vertx.eventBus().consumer("com.cisco.vertx.questions.search", message -> {
            System.out.println(message);

            JsonObject params = new JsonObject(message.body().toString());
            System.out.println(params);
            String qID = params.getString("qID");

            mongoClient.find("questions", new JsonObject().put("_id", Integer.parseInt(qID)), res -> {
                if (res.succeeded()) {
                    JsonObject book = res.result().get(0);
                    message.reply(Json.encodePrettily(book));
                } else {
                    res.cause().printStackTrace();
                    message.reply(res.result());
                }
            });
        }); */

    }

}
