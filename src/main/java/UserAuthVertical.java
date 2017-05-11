import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTOptions;
import io.vertx.ext.web.Router;

/**
 * Created by napal on 03/05/17.
 */
public class UserAuthVertical extends AbstractVerticle {

    @Override
    public void start(Future<Void> future) throws Exception {

        JsonObject config = new JsonObject().put("keyStore", new JsonObject()
                .put("path", "keystore.jceks")
                .put("type", "jceks")
                .put("password", "secret"));

        Router router = Router.router(vertx);
        JWTAuth authProvider = JWTAuth.create(vertx, config);

        router.route("/login").handler(message -> {
            // this is an example, authentication should be done with another provider...
            System.out.println(message);
            // on the verify endpoint once you verify the identity of the user by its username/password
            JsonObject params = new JsonObject(message.getBody().toString());
            System.out.println(params);
            String name = params.getString("name");
            String email = params.getString("email");
            String password = params.getString("password");

            if ("paulo".equals(message.request().getParam("username")) && "secret".equals(message.request().getParam("password"))) {
                message.response().end(authProvider.generateToken(new JsonObject().put("sub", "paulo"), new JWTOptions()));

            } else {
                message.fail(401);
            }
        });

        vertx.eventBus().consumer("com.glarimy.vertx.users.verify", message -> {
            System.out.println(message);
            // on the verify endpoint once you verify the identity of the user by its username/password
            JsonObject params = new JsonObject(message.body().toString());
            System.out.println(params);
            String name = params.getString("name");
            String email = params.getString("email");
            String password = params.getString("password");

            if ("paulo".equals(name) && "super_secret".equals(password)) {
                String token = authProvider.generateToken(new JsonObject().put("sub", "paulo"), new JWTOptions());
                message.reply(token);
                // now for any request to protected resources you should pass this string in the HTTP header Authorization as:
                // Authorization: Bearer <token>
            }
        });

    }
}
