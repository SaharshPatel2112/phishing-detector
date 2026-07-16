import axios from "axios";

axios
  .post("http://localhost:5000/api/scan/url", {
    url: "http://testsafebrowsing.appspot.com/s/malware.html",
  })
  .then((res) => console.log(res.data));
