import { OAuth2Client } from "google-auth-library";
import http from "http";
import url from "url";
import open from "open";
import destroyer from "server-destroy";
import { google } from "googleapis";
import fs, { read } from "fs";
import path from "path";

// Download your OAuth2 configuration from the Google
import keys from "./oauth2.keys.json";

async function listFiles(authClient: OAuth2Client) {
  const drive = google.drive({ version: "v3", auth: authClient });
  const res = await drive.files.list({
    pageSize: 10,
    fields: "nextPageToken, files(id, name)",
  });
  const files: any = res.data.files;
  if (files.length === 0) {
    console.log("No files found.");
    return;
  }

  console.log("Files:");
  files.map((file: any) => {
    console.log(`${file.name} (${file.id})`);
  });
}

async function uploadBasic(authClient: OAuth2Client, folderId: string) {
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  console.log("Auth Client", authClient);
  const service = google.drive({ version: "v3", auth: authClient });
  const requestBody = {
    name: "keyshares.txt",
    parents: [folderId], // Specify the folder ID to upload the file to
    fields: "id",
  };

  const media = {
    mimeType: "**/**",
    body: fs.createReadStream(path.join(__dirname, "/keyshares.txt")),
  };
  try {
    const file = await service.files.create({
      requestBody,
      media: media,
    });
    console.log("File Id:", file.data.id);
    return file.data.id;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}

async function createFolder(authClient: OAuth2Client) {
  const drive = google.drive({ version: "v3", auth: authClient });
  const fileMetadata: any = {
    name: "TestFolder",
    mimeType: "application/vnd.google-apps.folder",
  };
  const res: any = await drive.files.create(
    {
      requestBody: fileMetadata,
      fields: "id, name",
    },
    {}
  );
  console.log("Folder Id:", res.data.id);
  return res.data.id;
}

async function readFile(authClient: OAuth2Client, fileId: string) {
  console.log("Read file");
  const drive = google.drive({ version: "v3", auth: authClient });
  const res = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" }
  );
  const dest = fs.createWriteStream("keysharesDestination.txt");
  res.data
    .on("end", () => {
      console.log("Done");
    })
    .on("error", (err: any) => {
      console.log("Error", err);
    })
    .pipe(dest);
}

async function createAppDataFile(authClient: OAuth2Client) {
  const drive = google.drive({ version: "v3", auth: authClient });
  const fileMetadata = {
    name: "keyshares.txt",
    parents: ["appDataFolder"],
  };
  const media = {
    mimeType: "text/plain",
    body: fs.createReadStream(path.join(__dirname, "/keyshares.txt")),
  };
  try {
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });
    console.log("File Id:", file.data.id);
    return file.data.id;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}

async function listAppDataFiles(authClient: OAuth2Client) {
  const drive = google.drive({ version: "v3", auth: authClient });
  const res = await drive.files.list({
    spaces: "appDataFolder",
    fields: "nextPageToken, files(id, name)",
    pageSize: 10,
  });
  const files: any = res.data.files;
  if (files.length === 0) {
    console.log("No files found.");
    return;
  }
  console.log("Files:");
  files.map((file: any) => {
    console.log(`${file.name} (${file.id})`);
  });
}

async function deleteFile(authClient: OAuth2Client, fileId: string) {
  const drive = google.drive({ version: "v3", auth: authClient });
  try {
    await drive.files.delete({ fileId });
    console.log("File deleted");
  } catch (err) {
    throw err;
  }
}

/**
 * Start by acquiring a pre-authenticated oAuth2 client.
 */
async function main() {
  const oAuth2Client: any = await getAuthenticatedClient();
  // Make a simple request to the People API using our pre-authenticated client. The `request()` method
  // takes an GaxiosOptions object.  Visit https://github.com/JustinBeckwith/gaxios.

  // const url = "https://people.googleapis.com/v1/people/me?personFields=names";
  // const res = await oAuth2Client.request({ url });
  // console.log(res.data);

  // After acquiring an access_token, you may want to check on the audience, expiration,
  // or original scopes requested.  You can do that with the `getTokenInfo` method.
  const tokenInfo = await oAuth2Client.getTokenInfo(
    oAuth2Client.credentials.access_token
  );
  console.log("tokenInfo", tokenInfo);

  // const listedFile = await listFiles(oAuth2Client);
  // console.log(listedFile);

  // const createdFolderId = await createFolder(oAuth2Client);
  // console.log(createdFolderId);

  // const uploadedFileId = await uploadBasic(oAuth2Client, createdFolderId);
  // console.log(uploadedFileId);

  // const downloadedFile = await readFile(
  //   oAuth2Client,
  //   "1adSUGAdqgA2AWFPJaxrl_FUo9pvjKuZV"
  // );

  // const createdAppDataFileId = await createAppDataFile(oAuth2Client);
  // console.log("Create App data file", createdAppDataFileId);

  await listAppDataFiles(oAuth2Client);

  await readFile(
    oAuth2Client,
    "1yaJdhOmqNWpLbERa0YQMtPBgh3gw2DZylf0xXkodomW-Xyoyb5U"
  );

  // await deleteFile(oAuth2Client, createdAppDataFileId as string);
}

/**
 * Create a new OAuth2Client, and go through the OAuth2 content
 * workflow.  Return the full client to the callback.
 */
function getAuthenticatedClient() {
  return new Promise((resolve, reject) => {
    // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
    // which should be downloaded from the Google Developers Console.
    const oAuth2Client = new OAuth2Client(
      keys.web.client_id,
      keys.web.client_secret,
      keys.web.redirect_uris[0]
    );

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      response_type: "code",
      client_id: keys.web.client_id,
      redirect_uri: "http://localhost:3000/oauth2callback",
      scope:
        "openid profile email https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata",
    });
    console.log(`Authorize this app by visiting this url: ${authorizeUrl}`);

    // Open an http server to accept the oauth callback. In this simple example, the
    // only request to our webserver is to /oauth2callback?code=<code>
    const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url && req.url.indexOf("/oauth2callback") > -1) {
            // acquire the code from the querystring, and close the web server.
            const qs = new url.URL(req.url, "http://localhost:3000")
              .searchParams;
            const code: any = qs.get("code");
            console.log(`Code is ${code}`);
            res.end("Authentication successful! Please return to the console.");
            server.destroy();

            // Now that we have the code, use that to acquire tokens.
            const r: any = await oAuth2Client.getToken(code);
            console.log("R Tokens", r.tokens);
            // Make sure to set the credentials on the OAuth2 client.
            oAuth2Client.setCredentials(r.tokens);
            console.info("Tokens acquired.");
            resolve(oAuth2Client);
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(3000, () => {
        // open the browser to the authorize url to start the workflow
        open(authorizeUrl, { wait: false }).then((cp) => cp.unref());
      });
    destroyer(server);
  });
}

main().catch(console.error);
