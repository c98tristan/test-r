import {
  dropboxOauthUrl,
  createCodeVerifier,
  createCodeChallenge,
  getAccessToken,
} from "./auth";
import { assert } from "chai";
import http from "http";
import url from "url";
import { URL } from "url";
import open from "open";
import destroyer from "server-destroy";

describe("dropboxOauthUrl", () => {
  it("should return a url", async () => {
    const codeVerifier = createCodeVerifier();
    const codeChallenge = createCodeChallenge(codeVerifier);
    const authorizeUrl = dropboxOauthUrl(codeVerifier);
    console.log("url", authorizeUrl);
    assert.equal(
      authorizeUrl,
      `https://www.dropbox.com/oauth2/authorize?client_id=0ckrmzgmbylbqf1&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256&redirect_uri=http://localhost:3000/oauth2callback`
    );

    const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url && req.url.indexOf("/oauth2callback") > -1) {
            // acquire the code from the querystring, and close the web server.
            const qs = new URL(req.url, "http://localhost:3000").searchParams;
            const authCode = qs.get("code");
            console.log(`Code is ${authCode}`);
            res.end("Authentication successful! Please return to the console.");
            server.destroy();

            const accessToken = await getAccessToken(authCode, codeVerifier);
            console.log("accessToken", accessToken);
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(3000, async () => {
        // open the browser to the authorize url to start the workflow
        open(authorizeUrl, { wait: false }).then(
          async (cp) => await cp.unref()
        );
      });
    destroyer(server);
  });
});
function reject(e: unknown) {
  throw new Error("Function not implemented.");
}
