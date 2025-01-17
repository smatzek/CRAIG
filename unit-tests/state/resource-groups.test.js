const { assert } = require("chai");
const { state } = require("../../client/src/lib/state");

/**
 * initialize store
 * @returns {lazyZState} state store
 */
function newState() {
  let store = new state();
  store.setUpdateCallback(() => {});
  return store;
}

describe("resource_groups", () => {
  describe("resource_groups.init", () => {
    it("should initialize the resource groups", () => {
      let state = new newState();
      let expectedData = [
        {
          use_prefix: true,
          name: "service-rg",
          use_data: false,
        },
        {
          use_prefix: true,
          name: "management-rg",
          use_data: false,
        },
        {
          use_prefix: true,
          name: "workload-rg",
          use_data: false,
        },
      ];
      assert.deepEqual(
        state.store.json.resource_groups,
        expectedData,
        "it should have resource groups initialized"
      );
    });
  });
  describe("resource_groups.create", () => {
    let rgState;
    beforeEach(() => {
      rgState = new newState();
    });
    it("should add and update a non-duplicate group", () => {
      rgState.resource_groups.create({ name: "default" });
      assert.deepEqual(rgState.store.resourceGroups, [
        "service-rg",
        "management-rg",
        "workload-rg",
        "default",
      ]);
    });
    it("should add and update a non-duplicate group using prefix", () => {
      rgState.resource_groups.create({ name: "default", use_prefix: true });
      assert.deepEqual(rgState.store.resourceGroups, [
        "service-rg",
        "management-rg",
        "workload-rg",
        "default",
      ]);
    });
  });
  describe("resource_groups.delete", () => {
    let rgState;
    beforeEach(() => {
      rgState = new newState();
    });
    it("should delete a group and update names", () => {
      rgState.resource_groups.delete({}, { data: { name: "service-rg" } });
      assert.deepEqual(
        rgState.store.resourceGroups,
        ["management-rg", "workload-rg"],
        "it should set resource groups"
      );
    });
    it("should delete a vpc resource group and update vpc to use the first resource group", () => {
      rgState.resource_groups.delete({}, { data: { name: "management-rg" } });
      assert.deepEqual(
        rgState.store.resourceGroups,
        ["service-rg", "workload-rg"],
        "it should set resource groups"
      );
    });
  });
  describe("resource_groups.save", () => {
    let rgState;
    beforeEach(() => {
      rgState = new newState();
    });
    it("should change the name of a resource group in place", () => {
      let expectedData = [
        "service-rg",
        "management-rg",
        "workload-rg",
        "frog-rg",
      ];
      rgState.store.json.resource_groups.push({
        name: "dev",
      });
      rgState.resource_groups.save(
        {
          name: "frog-rg",
          use_prefix: true,
        },
        {
          data: {
            name: "dev",
          },
        }
      );
      assert.deepEqual(
        rgState.store.resourceGroups,
        expectedData,
        "it should change the name"
      );
    });
    it("should change the name of a resource group in place and update", () => {
      let expectedData = ["service-rg", "management-rg", "frog-rg"];
      ["atracker", "logdna", "sysdig"].forEach((field) => {
        rgState.store.json[field].resource_group = "workload-rg";
      });
      rgState.power.create({
        name: "power",
        resource_group: "workload-rg",
        imageNames: [],
      });
      rgState.resource_groups.save(
        {
          name: "frog-rg",
          use_prefix: true,
        },
        {
          data: {
            name: "workload-rg",
          },
        }
      );
      assert.deepEqual(
        rgState.store.resourceGroups,
        expectedData,
        "it should change the name"
      );
      assert.deepEqual(
        rgState.store.json.clusters[0].resource_group,
        "frog-rg",
        "it should change resource group"
      );
      assert.deepEqual(
        rgState.store.json.logdna.resource_group,
        "frog-rg",
        "it should update logdna resource group"
      );
      assert.deepEqual(
        rgState.store.json.power[0].resource_group,
        "frog-rg",
        "it should update power resource group"
      );
    });
    it("should change the name of a resource group in place and update vpcs when not use prefix", () => {
      rgState.store.json.resource_groups[1].use_prefix = false;
      rgState.resource_groups.save(
        { name: "management-rg", use_data: true },
        {
          data: {
            name: "management-rg",
            use_data: false,
          },
        }
      );
      assert.deepEqual(
        rgState.store.json.resource_groups[1],
        {
          use_prefix: false,
          name: "management-rg",
          use_data: true,
        },
        "it should return correct data"
      );
    });
  });
  describe("resource groups schema", () => {
    let craig;
    beforeEach(() => {
      craig = new newState();
    });
    describe("craig.resource_groups.name.helperText", () => {
      it("should return the correct helper text when using prefix", () => {
        let actualData = craig.resource_groups.name.helperText(
          {
            name: "test",
            use_prefix: true,
          },
          {
            craig: {
              store: {
                json: {
                  _options: {
                    prefix: "iac",
                  },
                },
              },
            },
          }
        );
        assert.deepEqual(
          actualData,
          "iac-test",
          "it should return correct data"
        );
      });
      it("should return the correct helper text when not using prefix", () => {
        let actualData = craig.resource_groups.name.helperText(
          {
            name: "test",
            use_prefix: false,
          },
          {
            craig: {
              store: {
                json: {
                  _options: {
                    prefix: "iac",
                  },
                },
              },
            },
          }
        );
        assert.deepEqual(actualData, "test", "it should return correct data");
      });
    });
  });
});
