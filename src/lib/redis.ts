import { createClient } from "redis"

const client = createClient ({
  url : "redis://default:81f3ff0acd7a468e9a45a4d33ef9c769@us1-helpful-dassie-42158.upstash.io:42158"
});

client.on("error", function(err) {
  throw err;
});
client.connect()
client.set('foo','bar');