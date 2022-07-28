# rtwtrbt

> A Twitter bot that retweets tweets matching a specific search rule.

## Features

- Action logging
- Character, term and word blacklisting
- Catching up the tweets that were missed during downtime
- Instant retweets with a maximum delay of 20s between each retweet which is
  only for not exceeding the API limits

## Live Instance

There's a running instance that retweets #deno and #denoland hashtags:

[@DenoRetweeter](https://twitter.com/DenoRetweeter)

## Configuration

| Variable          | Required | Description                                                                                                            |
| ----------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| `CLIENT_ID`       | Yes      | OAuth 2.0 Client ID                                                                                                    |
| `CLIENT_SECRET`   | Yes      | OAuth 2.0 Client Secret                                                                                                |
| `APP_BEARER`      | Yes      | App bearer token                                                                                                       |
| `RULE`            | Yes      | Search rule ([guide](https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/integrate/build-a-rule)) |
| `TAG`             | Yes      | Search rule tag (e.g. Cool tweets)                                                                                     |
| `LOG_DESTINATION` | No       | Path to log file                                                                                                       |

> Note: You can also provide these environment variables in `.env`.

After setting the variables, you will have to get a user token for your
automation account:

1. Set your app's callback URL to the following:

```txt
http://127.0.0.1:3000/callback
```

2. Run authenticate.ts:

```shell
deno run --allow-env --allow-net --allow-read authenticate.ts
```

3. Visit http://127.0.0.1:3000/login.

4. Authenticate your account.

5. Copy the printed token in your console.

6. Run import.ts:

```shell
deno run import.ts
```

7. Provide the token and skip the lastId prompt.

## Blacklisting

You can blacklist characters, words and/or terms so they are not retweeted. You
can do this by placing the characters, words and/or or terms you want to
blacklist inside a file called `blacklist.txt` in the directory you run from.

- The characters, words, and/or terms should be separated by `\n`.
- Case sensitive characters, words and/or terms can be differed by a trailing
  `\t` character.

## Running

```shell
deno run --allow-env --allow-net --allow-read --allow-write main.ts
```

## License

0. You just DO WHAT THE FUCK YOU WANT TO.

[Read again](./LICENSE)
