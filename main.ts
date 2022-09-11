import * as log from "std/log/mod.ts";
import { Client } from "twi/mod.ts";
import * as auth from "./auth.ts";
import env from "./env.ts";
import { isBlacklisted } from "./utils.ts";

const file = new log.handlers.FileHandler("NOTSET", {
  filename: env.LOG_DESTINATION,
  formatter: (r) => `${r.levelName} ${r.datetime.toISOString()} ${r.msg}`,
});
setInterval(() => file.flush(), 500);

await log.setup({
  handlers: { file },
  loggers: { default: { level: "DEBUG", handlers: ["file"] } },
});

const app = new Client(env.APP_BEARER);
const authClient = new auth.OAuth2User({
  client_id: env.CLIENT_ID as string,
  client_secret: env.CLIENT_SECRET as string,
  callback: "http://127.0.0.1:3000/callback",
  scopes: ["tweet.read", "users.read", "offline.access", "tweet.write"],
});

const token = JSON.parse(String(localStorage.getItem("token")));
if (token) {
  token.expires_at = new Date(token.expires_at);
  authClient.token = token;
}

const user = new Client(authClient);
const { id } = (await user.users.findMyUser()).data!;

await app.tweets.addOrDeleteRules({
  add: [{
    value: env.RULE,
    tag: env.TAG,
  }],
});

const queue = new Array<string>();

async function rtwt() {
  const tweetId = queue.shift();
  let timeout = 500;
  if (tweetId) {
    timeout = 20000;
    try {
      await user.tweets.usersIdRetweets(id, {
        tweet_id: tweetId,
      });
      log.info({ msg: "retweeted", id: tweetId });
    } catch (err) {
      log.warning({ msg: "could not retweet", id: tweetId, err: String(err) });
    } finally {
      localStorage.setItem("lastId", tweetId);
    }
  }
  setTimeout(rtwt, timeout);
}

async function catchUp() {
  const lastId = localStorage.getItem("lastId");
  if (!lastId) {
    return;
  }
  log.info("starting catch up");
  let count = 0;
  let valid = 0;
  for await (
    const { data } of app.tweets.tweetsRecentSearch({
      query: env.RULE,
      since_id: lastId,
    })
  ) {
    if (!data) {
      continue;
    }
    for (const tweet of data) {
      count++;
      if (isBlacklisted(tweet.text)) {
        continue;
      }
      valid++;
      queue.push(tweet.id);
    }
  }
  log.info({
    msg: "catch up complete",
    ...{ count, ...(count != valid ? { valid } : {}) },
  });
}

async function stream(reconnect?: boolean) {
  log.info(`${reconnect ? "re" : ""}connected`);
  try {
    for await (const { data, errors } of app.tweets.searchStream()) {
      if (!data || errors) {
        continue;
      }
      log.info({ msg: "received", id: data.id });
      if (
        isBlacklisted(data.text)
      ) {
        log.info({ msg: "skipped", id: data.id });
        continue;
      }
      queue.push(data.id);
    }
  } catch (err) {
    log.info({ msg: "connection error", err: String(err) });
  } finally {
    log.warning("connection was closed");
  }
  setTimeout(() => stream(true), 1000);
}

Promise.all([rtwt(), catchUp(), stream()]);
