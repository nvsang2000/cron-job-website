// server.js
const express = require("express");
const cron = require("node-cron");
const axios = require("axios");
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

const app = express();
const PORT = 3000;

const setDelay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const handleChecking = async () => {
  const url = "https://account.riokupon.com/api/account.php";
  const data = {
    tp: "account",
    account_action: "checkin",
  };

  const headers = {
    Accept: "application/json, text/javascript, */*; q=0.01",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "vi,en-US;q=0.9,en;q=0.8",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Cookie:
      `PHPSESSID=p0eq2b651js0qkrgd28nie1s8f; sender_id=6599567076759856; ckid=2ca84ed0a2e27911664b3e8ee81cea3e; _ga=GA1.1.1547070271.1714700267; _fbp=fb.1.1714700266627.212631251; _ga_C69QL9B2DF=GS1.1.1714700266.1.1.1714701173.0.0.0; us_id=${process.env.US_ID}`,
    Origin: "https://account.riokupon.com",
    Referer: "https://account.riokupon.com/missions.php",
    "Sec-Ch-Ua":
      '"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0",
    "X-Requested-With": "XMLHttpRequest",
  };

  await axios
    .post(url, data, { headers })
    .then((response) => {
      console.log('Success:', response.data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

cron.schedule("59 59 23 * * *",
  async () => {
    console.log("Running a job at 00 00 00 AM every day * * *");
    let count = 0
    while(true) {
      if(count > 20) break;
      await handleChecking()
      await setDelay(300)
      const time = dayjs().tz("Asia/Saigon").format("YYYY-MM-DD HH:mm:ss")
      count++;
      console.log('try count:', count, time);
    }
  },
  { timezone: "Asia/Saigon" }
);

app.get("/", (req, res) => {
  res.send("Node.js server with cron job is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
