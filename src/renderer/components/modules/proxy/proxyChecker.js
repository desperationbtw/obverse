const { ProxyChecker } = require("proxy-checker");

async function proxyChecker(proxy) {
  let a = document.createElement("a");
  a.href = proxy;

  let pc = new ProxyChecker(a.hostname, a.port);
  var result = await pc.check();
  if (!result.connect) console.log("Proxy checker: Bad proxy");
  return result.connect;
}

export { proxyChecker };
