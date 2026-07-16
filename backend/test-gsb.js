import "dotenv/config";
import { checkSafeBrowsing } from "./services/safeBrowsing.js";

checkSafeBrowsing("http://testsafebrowsing.appspot.com/s/malware.html").then(
  console.log,
);
checkSafeBrowsing("http://example.com").then(console.log);
