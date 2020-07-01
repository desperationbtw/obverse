const { proxyChecker } = require("./proxyChecker");
const proxyChain = require('proxy-chain');

async function createLocalProxyServer(proxy) {
  let localProxy = await proxyChain.anonymizeProxy(
    `http://${proxy.login}:${proxy.password}@${proxy.ip}`
  );

  if (!(await proxyChecker(localProxy))) {
    await proxyChain.closeAnonymizedProxy(localProxy, true);
    return null;
  }
  return localProxy;
}

async function killLocalProxyServer(proxy) {
  await proxyChain.closeAnonymizedProxy(proxy, true);
}

export { createLocalProxyServer, killLocalProxyServer };
