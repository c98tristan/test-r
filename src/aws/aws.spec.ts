import { getSecret, createSecret } from "../aws/secret-manager";

describe("getSecret", () => {
  it("should store a secret", async () => {
    const secret = await createSecret("user1");
    console.log(secret);
  });
  it("should return a secret", async () => {
    const secret = await getSecret();
    console.log(secret);
  });
});
