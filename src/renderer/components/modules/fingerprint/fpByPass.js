const puppeteer = require("puppeteer-extra");
const stealth = require("puppeteer-extra-plugin-stealth")();
const proxyChain = require("proxy-chain");
const { ProxyChecker } = require("proxy-checker");
const { UAGenerator } = require("./userAgent");
const canvasGenerator = require("./canvas");
const utils = require("../utils");

stealth.onBrowser = () => {};
puppeteer.use(stealth);

async function validProxy(proxy, isLocal = false) {
  var a = document.createElement("a");
  a.href = proxy;

  let pc = new ProxyChecker(a.hostname, a.port);
  var result = await pc.check();
  return result.connect;
}

async function startLocalProxyServer(proxy) {
  const localProxy = await proxyChain.anonymizeProxy(
    `http://${proxy.login}:${proxy.password}@${proxy.ip}`
  );

  if (!(await validProxy(localProxy, true))) {
    console.log("ValidProxy Error: bad proxy");
    return null;
  }
  return localProxy;
}

async function runBrowserSession(options) {
  var defaults = {
    headless: true,
    timeZone: ["ru", "ru-RU", "Europe/Moscow"],
    proxy: null,
    userAgent: new UAGenerator().Alone(),
    canvas: canvasGenerator.generateCanvas(),
  };

  utils.setDefaults(options, defaults);

  const args = [
    "--no-sandbox",
    "--lang=en-GB",
    "--disable-setuid-sandbox",
    "--disable-infobars",
    "--window-position=0,0",
    "--ignore-certifcate-errors",
    "--ignore-certifcate-errors-spki-list",
  ];

  if (options.proxy) {
    if (options.proxy.password && options.proxy.login) {
      var check = await startLocalProxyServer(options.proxy);
      if (check) args.push(`--proxy-server=${check}`);
    } else {
      if (await validProxy(options.proxy.ip))
        args.push(`--proxy-server=${options.proxy.ip}`);
    }
  }

  const _options = {
    args,
    headless: options.headless,
    ignoreHTTPSErrors: true,
    defaultViewport: null,
    //userDataDir: "./tmp", //?Для сейва сессий в будущем
  };

  var browser = await puppeteer.launch(_options);
  let pages = await browser.pages();
  const originalFunction = browser.newPage;
  browser.newPage = async function() {
    let page;
    if (pages) {
      page = pages[0];
      pages = null;
    } else page = await originalFunction.apply(this, arguments);
    await page.emulateTimezone(options.timeZone[2]);
    await page.setUserAgent(options.userAgent.ua);
    await page.setExtraHTTPHeaders({
      "Accept-Language": options.timeZone[0],
    });

    await page.evaluateOnNewDocument(() => {
      const originalFunction = HTMLCanvasElement.prototype.toDataURL;
      HTMLCanvasElement.prototype.toDataURL = function(type) {
        if (type === "image/png" && this.width === 220 && this.height === 30) {
          return options.canvas;
        }
        return originalFunction.apply(this, arguments);
      };
    });
    return page;
  };

  return browser;
}

export { runBrowserSession };
