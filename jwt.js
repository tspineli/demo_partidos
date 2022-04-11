const docusign = require("docusign-esign");
const configuracoes = require('./configuracoesDS');
const fs = require("fs");
const accountid = configuracoes.accountid;
const scopes = 'signature';
const rsaKey = fs.readFileSync("./private.key");
const jwtLifeSec = 3600;

async function geratoken() {
  let dsApi = new docusign.ApiClient();
  dsApi.setOAuthBasePath(configuracoes.authServer);
  let results = await dsApi.requestJWTUserToken(
    configuracoes.clientId,
    configuracoes.impersonatedUserGuid,
    scopes,
    rsaKey,
    jwtLifeSec
  );
  return results.body.access_token;
}

module.exports = { geratoken };

