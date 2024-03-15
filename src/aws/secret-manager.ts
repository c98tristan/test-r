// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

import {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
} from "@aws-sdk/client-secrets-manager";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const secret_name = "ramper_keyshare";

const client = new SecretsManagerClient({
  region: "ap-southeast-1",
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: "ap-southeast-2" },
    identityPoolId: "ap-southeast-2:23a94f12-e5c8-492b-ba0c-45460b653a7b",
    logins: {
      ["cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_8NUXkHwE4"]:
        "eyJraWQiOiIwNGNNSjJEUkRlUTlhQW9HVkxzemRRUzJWa0hlNFwvZ0pFVkpQbm05YWF5WT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiSTBBV3J1Z29rY2kwcjFjNFBTLTJLZyIsInN1YiI6ImMyMTk4ZmVkLTkzYjgtNDI2ZC04NzM2LWMxYjM5Zjg0NjFlNCIsImNvZ25pdG86Z3JvdXBzIjpbImFwLXNvdXRoZWFzdC0yXzhOVVhrSHdFNF9Hb29nbGUiXSwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTIuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTJfOE5VWGtId0U0IiwiY29nbml0bzp1c2VybmFtZSI6Imdvb2dsZV8xMDQxMzUyODU4MzQwMzg0OTUyMzMiLCJnaXZlbl9uYW1lIjoiSHXhu7NuaCBNaW5oIiwibm9uY2UiOiIwNHFFUUlMR19aLU5qQjUwNlMwb19mVkJ6eEtGY1dOME5MUXhud2lEQmV4Q2wxWUZITUs2aF8yM1l3am1ZRFpVODk5aU43S2MzVWtvRFhTQnh0V24wWmg2OThSNGVBYlVxSU5TSElvZkJTczdqUTFWR3hNRmVwQVJyRWNhNTRYYXp3WEtFME94ZmtOLW05cE10azNQVnl0SjJsdnJrY0FneWNBQnExVFlSZG8iLCJhdWQiOiI1bmpqOTVxMmxzMmZyZzNjZ3U2aXRsMTU3bSIsImlkZW50aXRpZXMiOlt7InVzZXJJZCI6IjEwNDEzNTI4NTgzNDAzODQ5NTIzMyIsInByb3ZpZGVyTmFtZSI6Ikdvb2dsZSIsInByb3ZpZGVyVHlwZSI6Ikdvb2dsZSIsImlzc3VlciI6bnVsbCwicHJpbWFyeSI6InRydWUiLCJkYXRlQ3JlYXRlZCI6IjE3MDU0MDMwNzU3NDIifV0sInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzA1ODkyOTQ0LCJuYW1lIjoiSHXhu7NuaCBNaW5oIFRyw60iLCJleHAiOjE3MDU4OTY1NDQsImlhdCI6MTcwNTg5Mjk0NCwiZmFtaWx5X25hbWUiOiJUcsOtIiwianRpIjoiOTZjZTg2ZTYtNWM2Yy00Y2MwLWFjODktNmVmNWE5NDBkY2FmIiwiZW1haWwiOiJ0cml2b25oYW5AZ21haWwuY29tIn0.h6VmKVkB1E9XkKzKpu9vRV1u5oVi29284pQHD4c_DDY_qnxj9pwfwVv518mbeg1Zqsri9HAMjXE6ihuZVDqb0DvvpzVk2vN_udg5has9pvUlpeVhHMbsdGoX4nWlxEUYEuQfp8b4AfAmXFXbANvatktwct-rvarFA_Xonn4-5zC0bmauvRr0cJkJpLPFWD5-zyM6GHOMtpktgRsx3HF4tRvc4rFygi3R1XtI0ozNVC5uYgZSHEGHmAgD52pQ0TtWqOEbu29w004IFo5f0fJe7iKcCP9mUWB1rChMuyY-9OpTrYcSdZ4GhaS0CXdSAorKjF1YbFemRcvltEdxg1S-TA",
    },
  }),
});

export const getSecret = async () => {
  try {
    let response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
    console.log(response);
    return response;
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }
};

export const createSecret = async (secret_name: string) => {
  try {
    let response = await client.send(
      new CreateSecretCommand({
        Name: secret_name,
        SecretString: JSON.stringify({
          seedPhase: "seedPhase",
          shareKeys: [
            {
              shareKey: "shareKey",
              shareId: "shareId",
            },
          ],
        }),
      })
    );
    console.log(response);
    return response;
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }
};
