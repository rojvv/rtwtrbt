import { cleanEnv, config, str } from "./deps.ts";

await config({ export: true });

export default cleanEnv(Deno.env.toObject(), {
  CLIENT_ID: str(),
  CLIENT_SECRET: str(),
  APP_BEARER: str(),
  RULE: str(),
  TAG: str(),
  LOG_DESTINATION: str({ default: "log" }),
});
