import { Keys } from "..";
import { assert } from "chai";

describe("Keys", () => {
  it("Generate keys", () => {
    const keys = new Keys("seedPhase");

    const shareKeys = keys.generateKeys(3, 2);
    console.log(shareKeys);
  });

  it("Recover keys", () => {
    const keys = new Keys("seedPhase");

    const shareKeys = keys.generateKeys(3, 2);

    const seedPhase = keys.recoverKeys(shareKeys);

    assert.equal(seedPhase, "seedPhase");
  });
});
