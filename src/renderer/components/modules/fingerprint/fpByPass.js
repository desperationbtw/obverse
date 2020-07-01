const puppeteer = require("puppeteer-extra");
const stealth = require("puppeteer-extra-plugin-stealth")();
const path = require("path");
const rimraf = require("rimraf");
const proxyServer = require("../proxy/proxyServer");
const { proxyChecker } = require("../proxy/proxyChecker");
const { UAGenerator } = require("./userAgent");
const canvasGenerator = require("./canvas");
const utils = require("../utils");

// stealth.onBrowser = () => {};
// puppeteer.use(stealth);

async function runBrowserSession(options) {
  var defaults = {
    headless: true,
    timeZone: ["ru", "ru-RU", "Europe/Moscow"],
    proxy: null,
    userAgent: new UAGenerator().Alone(),
    canvas: canvasGenerator.generateCanvas(),
    sessionPath: "guest",
    doNotTrack: true,
  };

  utils.setDefaults(options, defaults);
  function browserDataPath(fpath) {
    return `${
      process.env.NODE_ENV === "development"
        ? path.join(__static, "data", "session", String(fpath))
        : path.join(
            app.getAppPath("userData"),
            "data",
            "session",
            String(fpath)
          )
    }`;
  }

  rimraf(browserDataPath("guest"), function() {
    console.log("Rimraf: guest path cleared");
  });

  const args = [
    "--no-sandbox",
    `--lang=${options.timeZone[1]},${options.timeZone[0]}`,
    "--disable-setuid-sandbox",
    "--disable-infobars",
    "--window-position=0,0",
    "--ignore-certifcate-errors",
    "--ignore-certifcate-errors-spki-list",
  ];

  if (options.proxy) {
    if (options.proxy.password && options.proxy.login) {
      var check = await proxyServer.createLocalProxyServer(options.proxy);
      if (check) args.push(`--proxy-server=${check}`);
    } else {
      if (await proxyChecker(options.proxy.ip))
        args.push(`--proxy-server=${options.proxy.ip}`);
    }
  }

  const _options = {
    env: {
      TZ: options.timeZone[2],
      ...process.env,
    },
    args,
    headless: options.headless,
    ignoreHTTPSErrors: true,
    defaultViewport: null,
    userDataDir: browserDataPath(options.sessionPath),
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
      DNT: options.doNotTrack ? "1" : "0",
    });

    await page.evaluateOnNewDocument((options) => {
      const originalFunction = HTMLCanvasElement.prototype.toDataURL;
      HTMLCanvasElement.prototype.toDataURL = function(type) {
        if (type === "image/png" && this.width === 220 && this.height === 30) {
          return options.canvas;
        }
        return originalFunction.apply(this, arguments);
      };

      Object.defineProperty(navigator, "language", {
        configurable: false,
        enumerable: true,
        get: function() {return options.timeZone[1]},
      });
      navigator.languages = [options.timeZone[1], options.timeZone[0]];
      console.log(navigator.languages);
      Object.defineProperty(navigator, "languages", {
        configurable: false,
        enumerable: true,
        get: function() {return [options.timeZone[1], options.timeZone[0]]},
      });
    }, options);
    console.log(navigator.languages);
    return page;
  };

  return browser;
}

export { runBrowserSession };
