const fbp = require("./fingerprint/fpByPass");

const url = [
  "https://fingerprintjs.com/demo",
  "https://amiunique.org/fp",
  "https://bot.sannysoft.com",
  "https://arh.antoinevastel.com/bots/areyouheadless",
];
var browser;


async function Run() {
  var proxy = {};
  proxy.isLocal = true;
  proxy.ip = '91.241.180.150:6147';
  proxy.login = 'BesheniyMax';
  proxy.password = 'p2u039';
  browser = await fbp.runBrowserSession(proxy);
  const pages = [
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
