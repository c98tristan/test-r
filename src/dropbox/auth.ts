import crypto from "crypto";
import { Dropbox } from "dropbox";
import http from "http";
import { URL } from "url";
import open from "open";
import destroyer from "server-destroy";
import dotenv from "dotenv";
dotenv.config();

const appKey = "3yrhdc10a84omn4";
const redirectUri = `http://localhost:3000/oauth2callback`;
let code;

const base64Encode = (buffer: Buffer): string =>
  buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

// export const getCodeVerifier = (): string | null =>
//   localStorage.getItem("codeVerifier");

export const createCodeVerifier = (): string => {
  const codeVerifier = base64Encode(crypto.randomBytes(32));
  console.log("created codeVerifier", codeVerifier);
  return codeVerifier;
};

export const createCodeChallenge = (codeVerifier: string): string => {
  const sha256 = (str: string) =>
    crypto.createHash("sha256").update(str).digest();
  const codeChallenge = base64Encode(sha256(codeVerifier));
  console.log("created codeChallenge", codeChallenge);
  return codeChallenge;
};

export const dropboxOauthUrl = (codeVerifier: string) => {
  const sha256 = (str: string) =>
    crypto.createHash("sha256").update(str).digest();
  const codeChallenge = base64Encode(sha256(codeVerifier));

  return `https://www.dropbox.com/oauth2/authorize?client_id=${appKey}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256&redirect_uri=${redirectUri}`;
};

export const getAccessToken = async (
  authCode: string | null,
  codeVerifier: string
): Promise<string> => {
  const formData = new FormData();
  formData.set("code", authCode);
  formData.set("grant_type", "authorization_code");
  formData.set("client_id", appKey);
  formData.set("code_verifier", codeVerifier);
  formData.set("redirect_uri", redirectUri);
  console.log("formData", formData);

  return fetch("https://api.dropbox.com/oauth2/token", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((json: any) => json.access_token);
};

export const writeFile = async (accessToken: string) => {
  const contents = "hello world!";
  const dbx = new Dropbox({ accessToken });
  return dbx
    .filesUpload({ path: "/basic.js", contents })
    .then((response: any) => {
      console.log(response.result);
    });
};

export const readFile = async (accessToken: string) => {
  console.log("Read file");
  const dbx = new Dropbox({ accessToken });
  return dbx
    .filesDownload({ path: "/Apps/Ramper/basic.js" })
    .then((response: any) => {
      console.log(response.result.fileBinary.toString());
    });
};

/**
 * Start by acquiring a pre-authenticated oAuth2 client.
 */
async function main() {
  const accessToken: any = await getAuthenticatedClient();
  // Make a simple request to the People API using our pre-authenticated client. The `request()` method
  // takes an GaxiosOptions object.  Visit https://github.com/JustinBeckwith/gaxios.
  console.log("accessToken", accessToken);

  // await writeFile(accessToken);
  await readFile(accessToken);
}

function getAuthenticatedClient() {
  return new Promise((resolve, reject) => {
    const codeVerifier = createCodeVerifier();
    const codeChallenge = createCodeChallenge(codeVerifier);
    const authorizeUrl = dropboxOauthUrl(codeVerifier);
    console.log("url", authorizeUrl);
    const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url && req.url.indexOf("/oauth2callback") > -1) {
            // acquire the code from the querystring, and close the web server.
            const qs = new URL(req.url, "http://localhost:3000").searchParams;
            console.log("QS", qs);
            const authCode = qs.get("code");
            console.log(`Code is ${authCode}`);
            res.end("Authentication successful! Please return to the console.");
            server.destroy();

            const accessToken = await getAccessToken(authCode, codeVerifier);
            resolve(accessToken);
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
}

main().catch(console.error);
