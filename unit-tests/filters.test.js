const { assert } = require("chai");
const { encryptionKeyFilter } = require("../client/src/lib/forms");

describe("encryptionKeyFilter", () => {
  let craig;
  beforeEach(() => {
    craig = {
      store: {
        json: {
          object_storage: [
            { name: "cosName1", kms: "kms1" },
            { name: "cosName2", kms: null },
          ],
          key_management: [
            {
              name: "kms1",
              keys: [
                { name: "key1", root_key: true },
                { name: "key2", root_key: false },
              ],
            },
            {
              name: "kms2",
              keys: [{ name: "key3", root_key: false }],
            },
          ],
        },
      },
    };
  });

  it("should return an empty array if kms is falsy", () => {
    const componentProps = {
      isModal: false,
      arrayParentName: "cosName2",
      craig: craig,
    };
    const result = encryptionKeyFilter({}, componentProps);
    assert.deepEqual(result, []);
  });

  it("should return an array of key names for root keys when kmd is selected", () => {
    const componentProps = {
      isModal: true,
      parent_name: "cosName1",
      craig: craig,
    };

    const result = encryptionKeyFilter({}, componentProps);

    assert.deepEqual(result, ["key1"]);
  });
});
