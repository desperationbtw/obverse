const fbp = require("./fingerprint/fpByPass");
const { UAGenerator } = require("./fingerprint/userAgent");

const url = [
  "https://fingerprintjs.com/demo",
  "https://amiunique.org/fp",
  "https://bot.sannysoft.com",
  "https://arh.antoinevastel.com/bots/areyouheadless",
  "http://f.vision",
];
var browser;


async function Run() {
  var UA = new UAGenerator({deviceCategory: "mobile"});
  UA.Array(5).forEach(item=>{
    console.log(`Device: ${item.device.model}\nOS: ${item.os.name}`);
  })

  browser = await fbp.runBrowserSession({
    proxy: {ip: "91.241.180.150:6147", login: "BesheniyMax", password: "p2u039"},
    //userAgent: "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 YaBrowser/17.6.1.749 Yowser/2.5 Safari/537.36",
    headless: false
  });
  const pages = [
    await browser.newPage(),
    await browser.newPage(),
    await browser.newPage(),
    await browser.newPage(),
    await browser.newPage(),
  ];
  pages.forEach(async (page, index) => {
    await page.goto(url[index]);
  });
}

async function Close() {
  await browser.close();
}

export default {
  Run,
  Close,
};
