import { dirname, fromFileUrl, join } from "std/path/mod.ts";

const blacklist = new Array<RegExp>();

try {
  const lines = (await Deno.readTextFile(
    join(dirname(fromFileUrl(import.meta.url)), "blacklist.txt"),
  )).split(/\n/).filter((v) => v);
  for (const line of lines) {
    const f = line.startsWith("/");
    const pattern = f ? line.slice(1, line.lastIndexOf("/")) : line;
    if (!pattern) {
      console.warn("Bad blacklist item:", line);
      continue;
    }
    const flags = f ? line.slice(line.lastIndexOf("/") + 1) : "";
    blacklist.push(new RegExp(pattern, flags));
  }
} catch (_err) {
  //
}

export function isBlacklisted(text: string) {
  for (const item of blacklist) {
    if (text.match(item)) {
      return true;
    }
  }
  return false;
}
