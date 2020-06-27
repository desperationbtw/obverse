const puppeteer = require("puppeteer-extra");
const stealth = require("puppeteer-extra-plugin-stealth")();
const proxyChain = require("proxy-chain");
const ProxyVerifier = require("proxy-verifier");
const userAgentGenerator = require("./userAgent");
const canvasGenerator = require("./canvas");

stealth.onBrowser = () => {};
puppeteer.use(stealth);

async function validProxy(proxy, isLocal = false) {
  var a = document.createElement("a");
  a.href = proxy;

  ProxyVerifier.testAll(
    { ipAddress: a.hostname, port: a.port, protocols: ["http", "https"] },
    async function(error, result) {
      if (error) {
        console.log(`ProxyVerifier error: ${error}`);
        if (isLocal) await proxyChain.closeAnonymizedProxy(proxy, true);
        return false;
      } else if (!result.protocols.http.ok) {
        console.log(`Proxy error: invalid proxy`);
        if (isLocal) await proxyChain.closeAnonymizedProxy(proxy, true);
        return false;
      }
    }
  );
  return true;
}

async function startLocalProxyServer(ip, login, password) {
  const localProxy = await proxyChain.anonymizeProxy(
    `http://${login}:${password}@${ip}`
  );

  if (!validProxy(localProxy, true)) return null;

  return localProxy;
}

async function runBrowserSession(
  proxy,
  canvas,
  timeZone = ["ru", "ru-RU", "Europe/Moscow"],
  userAgent,
  headless = false
) {
  const args = [
    "--no-sandbox",
    "--lang=en-GB",
    "--disable-setuid-sandbox",
    "--disable-infobars",
    "--window-position=0,0",
    "--ignore-certifcate-errors",
    "--ignore-certifcate-errors-spki-list",
  ];

  if (!userAgent) userAgent = userAgentGenerator.randomUserAgent();
  if (!canvas) {
    canvas = canvasGenerator.generateCanvas();
  }
  if (proxy) {
    if (proxy.isLocal) {
      var check = await startLocalProxyServer(proxy.ip, proxy.login, proxy.password);
      if (check) args.push(`--proxy-server=${check}`);
    } else {
      if (validProxy(proxy.ip)) args.push(`--proxy-server=${proxy.ip}`);
    }
  }

  const options = {
    args,
    headless: headless,
    ignoreHTTPSErrors: true,
    defaultViewport: null,
    //userDataDir: "./tmp", //!Для сейва сессий в будущем
  };

  var browser = await puppeteer.launch(options);

  const originalFunction = browser.newPage;
  browser.newPage = async function() {
    var page = await originalFunction.apply(this, arguments);
    await page.emulateTimezone(timeZone[2]);
    await page.setUserAgent(userAgent);
    await page.setExtraHTTPHeaders({
      "Accept-Language": timeZone[0],
    });

    await page.evaluateOnNewDocument(() => {
      const originalFunction = HTMLCanvasElement.prototype.toDataURL;
      HTMLCanvasElement.prototype.toDataURL = function(type) {
        if (type === "image/png" && this.width === 220 && this.height === 30) {
          return canvas;
        }
        return originalFunction.apply(this, arguments);
      };
    });
    return page;
  };

  return browser;
}

export { runBrowserSession };
