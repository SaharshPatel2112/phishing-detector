import "dotenv/config";
import { checkVirusTotal } from "./services/virusTotal.js";

checkVirusTotal("http://example.com").then(console.log);
