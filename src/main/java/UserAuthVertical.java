import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTOptions;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.ext.web.Router;

/**
 * Created by napal on 03/05/17.
 * A typical flow of JWT usage is that in your application you have one end point that issues tokens,
 * this end point should be running in SSL mode, there after you verify the request user,
 * say by its username and password you would do:
 *
 */
public class UserAuthVertical extends AbstractVerticle {

    @Override
    public void start(Future<Void> future) throws Exception {
/*
        JsonObject conf = new JsonObject().put("keyStore", new JsonObject()
                .put("path", "keystore.jceks")
                .put("type", "jceks")
                .put("password", "secret"));

        Router router = Router.router(vertx);
        JWTAuth authProvider = JWTAuth.create(vertx, conf);*/

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
        /*
        JsonObject question = new JsonObject()
                .put("title", "First question")
                .put("description", "This is first question posted on stack overflow");

        mongoClient.save("questions", question, id -> {
            System.out.println("Inserted id: " + id.result());

            mongoClient.find("questions", new JsonObject().put("qid", "12355"), res -> {
                System.out.println("Question title is " + res.result());
            });

        });*/

        vertx.eventBus().consumer("com.cisco.vertx.users.post", message -> {
            System.out.println("body:"+ message.body().toString());

            JsonObject user = new JsonObject(message.body().toString());
            mongoClient.save("users", user, result -> {
                if (result.succeeded()) {
                    message.reply(result.result());
                } else {
                    result.cause().printStackTrace();
                    message.reply(result.result());
                }
            });
        });

        vertx.eventBus().consumer("com.cisco.vertx.users.login", message -> {
            System.out.println("body:"+ message.body().toString());

            JsonObject user = new JsonObject(message.body().toString());
            String name = user.getString("username");
            String password = user.getString("password");

            mongoClient.find("users", new JsonObject().put("username", name), result -> {
                if (result.succeeded()) {
                    JsonObject json = result.result().get(0);
                    if (name.equals(json.getString("username")) && password.equals(json.getString("password"))) {
                        message.reply("Auth test");
                        //message.reply(authProvider.generateToken(new JsonObject().put("sub", user), new JWTOptions()));
                    } else {
                        message.reply(401);
                    }
                } else {
                    result.cause().printStackTrace();
                    message.reply(result.result());
                    return;
                }
            });
        });

        vertx.eventBus().consumer("com.cisco.vertx.users.logout", message -> {
            //System.out.println("headers:" + message.headers().toString());
            System.out.println("body:"+ message.body().toString());

            JsonObject user = new JsonObject(message.body().toString());
            mongoClient.save("users", user, result -> {
                if (result.succeeded()) {
                    message.reply(result.result());
                } else {
                    result.cause().printStackTrace();
                    message.reply(result.result());
                }
            });
        });

        vertx.eventBus().consumer("com.cisco.vertx.users.verify", message -> {
            System.out.println(message);
            // on the verify endpoint once you verify the identity of the user by its username/password
            JsonObject params = new JsonObject(message.body().toString());
            System.out.println(params);
            String username = params.getString("name");
            String email = params.getString("email");
            String password = params.getString("password");

            if ("paulo".equals(username) && "super_secret".equals(password)) {
                String token = authProvider.generateToken(new JsonObject().put("sub", "paulo"), new JWTOptions());
                message.reply(token);
                // now for any request to protected resources you should pass this string in the HTTP header Authorization as:
                // Authorization: Bearer <token>
            }
        });

    }
}
