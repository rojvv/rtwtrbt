import { dirname, fromFileUrl, join } from "./deps.ts";

const blacklist = new Array<string>();

try {
  const lines = (await Deno.readTextFile(
    join(dirname(fromFileUrl(import.meta.url)), "blacklist.txt"),
  )).split(/\n/).filter((v) => v);
  for (const line of lines) {
    blacklist.push(line);
  }
} catch (_err) {
  //
}

export function isBlacklisted(text: string) {
  for (const item of blacklist) {
    const i = (item.endsWith("\t") ? item : item.toLowerCase()).trim();
    const t = item.endsWith("\t") ? text : text.toLowerCase();
    if (t.includes(i)) {
      return true;
    }
  }
  return false;
}
