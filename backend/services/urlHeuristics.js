const URL_SHORTENERS = [
  "bit.ly",
  "tinyurl.com",
  "goo.gl",
  "t.co",
  "ow.ly",
  "is.gd",
  "buff.ly",
  "rebrand.ly",
];
const SUSPICIOUS_DOMAIN_WORDS = [
  "secure",
  "verify",
  "account",
  "login",
  "update",
  "confirm",
  "signin",
  "billing",
];

export function checkUrlHeuristics(url) {
  const flags = [];

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    if (parsed.protocol !== "https:") {
      flags.push("No HTTPS");
    }
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      flags.push("IP address used as domain");
    }
    if (URL_SHORTENERS.some((s) => hostname.endsWith(s))) {
      flags.push("Known URL shortener");
    }
    const subdomainCount = hostname.split(".").length - 2;
    if (subdomainCount >= 3) {
      flags.push("Excessive subdomains");
    }
    const matchedWords = SUSPICIOUS_DOMAIN_WORDS.filter((w) =>
      hostname.includes(w),
    );
    if (matchedWords.length >= 2) {
      flags.push(`Suspicious keywords in domain: ${matchedWords.join(", ")}`);
    }
  } catch {
    flags.push("Malformed URL");
  }

  return flags;
}
