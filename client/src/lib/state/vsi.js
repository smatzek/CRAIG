const {
  revision,
  transpose,
  camelCase,
  splat,
  splatContains,
  isInRange,
  isNullOrEmptyString,
  getObjectFromArray,
} = require("lazy-z");
const { newDefaultManagementServer } = require("./defaults");
const {
  setUnfoundResourceGroup,
  hasUnfoundVpc,
  updateSubChild,
  deleteSubChild,
  pushToChildFieldModal,
} = require("./store.utils");
const {
  shouldDisableComponentSave,
  fieldIsNullOrEmptyString,
  resourceGroupsField,
  selectInvalidText,
  vpcGroups,
  subnetMultiSelect,
  fieldIsNotWholeNumber,
  unconditionalInvalidText,
  securityGroupsMultiselect,
  encryptionKeyGroups,
  vpcSshKeyMultiselect,
} = require("./utils");
const { invalidNameText, invalidName } = require("../forms");

/**
 * initialize vsi
 * @param {lazyZState} config state store
 * @param {object} config.store state store
 * @param {object} config.store.json configuration JSON
 */
function vsiInit(config) {
  config.store.json.vsi = [newDefaultManagementServer()];
  config.store.json.security_groups.push({
    vpc: "management",
    name: "management-vsi",
    resource_group: "management-rg",
    rules: [
      {
        vpc: "management",
        sg: "management-vsi",
        direction: "inbound",
        name: "allow-ibm-inbound",
        source: "161.26.0.0/16",
        tcp: {
          port_max: null,
          port_min: null,
        },
        udp: {
          port_max: null,
          port_min: null,
        },
        icmp: {
          type: null,
          code: null,
        },
      },
      {
        vpc: "management",
        sg: "management-vsi",
        direction: "inbound",
        name: "allow-vpc-inbound",
        source: "10.0.0.0/8",
        tcp: {
          port_max: null,
          port_min: null,
        },
        udp: {
          port_max: null,
          port_min: null,
        },
        icmp: {
          type: null,
          code: null,
        },
      },
      {
        vpc: "management",
        sg: "management-vsi",
        direction: "outbound",
        name: "allow-vpc-outbound",
        source: "10.0.0.0/8",
        tcp: {
          port_max: null,
          port_min: null,
        },
        udp: {
          port_max: null,
          port_min: null,
        },
        icmp: {
          type: null,
          code: null,
        },
      },
      {
        vpc: "management",
        sg: "management-vsi",
        direction: "outbound",
        name: "allow-ibm-tcp-53-outbound",
        source: "161.26.0.0/16",
        tcp: {
          port_max: 53,
          port_min: 53,
        },
        udp: {
          port_max: null,
          port_min: null,
        },
        icmp: {
          type: null,
          code: null,
        },
      },
      {
        vpc: "management",
        sg: "management-vsi",
        direction: "outbound",
        name: "allow-ibm-tcp-80-outbound",
        source: "161.26.0.0/16",
        tcp: {
          port_max: 80,
          port_min: 80,
        },
        udp: {
          port_max: null,
          port_min: null,
        },
        icmp: {
          type: null,
          code: null,
        },
      },
      {
        vpc: "management",
        sg: "management-vsi",
        direction: "outbound",
        name: "allow-ibm-tcp-443-outbound",
        source: "161.26.0.0/16",
        tcp: {
          port_max: 443,
          port_min: 443,
        },
        udp: {
          port_max: null,
          port_min: null,
        },
        icmp: {
          type: null,
          code: null,
        },
      },
    ],
  });
  config.store.json.teleport_vsi = [];
}

/**
 * update vsi based on key
 * @param {lazyZState} config state store
 * @param {object} config.store state store
 * @param {object} config.store.json configuration JSON
 * @param {object} config.store.subnets map of subnets
 * @param {string} key field to lookup
 */
function updateVsi(config, key) {
  // get data based on key
  new revision(config.store.json).child(key).then((data) => {
    // for each deployment
    data.forEach((deployment) => {
      let validVpc = hasUnfoundVpc(config, deployment) === false;
      if (!deployment.kms) {
        deployment.encryption_key = null;
      }
      config.setUnfound("encryptionKeys", deployment, "encryption_key");
      setUnfoundResourceGroup(config, deployment);
      if (!validVpc) {
        deployment.vpc = null;
        deployment.subnets = [];
        deployment.security_groups = [];
      } else {
        let vsiVpc = getObjectFromArray(
          config.store.json.vpcs,
          "name",
          deployment.vpc
        );
        deployment.subnets = deployment.subnets.filter((subnet) => {
          if (splatContains(vsiVpc.subnets, "name", subnet)) {
            return subnet;
          }
        });
        deployment.security_groups = deployment.security_groups.filter((sg) => {
          if (splatContains(config.store.json.security_groups, "name", sg)) {
            return sg;
          }
        });
      }
      let nextSshKeys = [];
      deployment.ssh_keys.forEach((key) => {
        if (splatContains(config.store.json.ssh_keys, "name", key)) {
          nextSshKeys.push(key);
        }
      });
      deployment.ssh_keys = nextSshKeys;
    });
    config.store[camelCase(key + " List")] = splat(data, "name");
  });
}

/**
 * vsi on store update
 * @param {object} config.store state store
 **/
function vsiOnStoreUpdate(config) {
  ["vsi"].forEach((key) => {
    updateVsi(config, key);
  });
}

/**
 * create a new vsi deployment
 * @param {lazyZState} config state store
 * @param {object} stateData component state data
 * @param {Array<string>} stateData.ssh_keys
 * @param {string} stateData.vpc
 * @param {object} componentProps props from component form
 * @param {boolean} componentProps.isTeleport
 */
function vsiCreate(config, stateData, componentProps) {
  // default vsi values
  let defaultVsi = {
    kms: null,
    encryption_key: null,
    image: null,
    image_name: null,
    profile: null,
    name: null,
    security_groups: [],
    ssh_keys: stateData.ssh_keys || [], // or is placeholder, no vsi should be created without ssh key,
    vpc: stateData.vpc,
    vsi_per_subnet: null,
    resource_group: null,
    override_vsi_name: null,
    user_data: null,
    network_interfaces: [],
    subnets: stateData.subnets || [],
    volumes: [],
  };
  if (stateData.image_name) {
    stateData.image = stateData.image_name
      .replace(/[^\[]+\[/g, "")
      .replace(/]/g, "");
  }
  // find kms
  config.store.json.key_management.forEach((kms) => {
    kms.keys.forEach((key) => {
      if (key.name === stateData.encryption_key) stateData.kms = kms.name;
    });
  });

  transpose(stateData, defaultVsi);
  config.push(["json", "vsi"], defaultVsi);
}

/**
 * save vsi deployment
 * @param {lazyZState} config state store
 * @param {object} stateData component state data
 * @param {boolean} stateData.hideSecurityGroup
 * @param {object} componentProps props from component form
 * @param {boolean} componentProps.isTeleport
 */
function vsiSave(config, stateData, componentProps) {
  if (stateData.image_name)
    stateData.image = stateData.image_name
      .replace(/[^\[]+\[/g, "")
      .replace(/]/g, "");
  config.store.json.key_management.forEach((kms) => {
    if (splatContains(kms.keys, "name", stateData.encryption_key)) {
      stateData.kms = kms.name;
    }
  });
  config.store.json.load_balancers.forEach((lb) => {
    for (let i = 0; i < lb.target_vsi.length; i++) {
      if (lb.target_vsi[i] === componentProps.data.name)
        lb.target_vsi[i] = stateData.name;
    }
  });
  config.updateChild(["json", "vsi"], componentProps.data.name, stateData);
}

/**
 * delete vsi deployment
 * @param {lazyZState} config state store
 * @param {object} stateData component state data
 * @param {object} componentProps props from component form
 * @param {boolean} componentProps.isTeleport
 */
function vsiDelete(config, stateData, componentProps) {
  config.carve(["json", "vsi"], componentProps.data.name);
}

/**
 * create new vsi volume
 * @param {lazyZstate} config
 * @param {object} config.store
 * @param {object} config.store.json
 * @param {object} config.store.json.vsi
 * @param {Array<Object>} config.store.json.vsi.volumes
 * @param {object} stateData component state data
 */
function vsiVolumeCreate(config, stateData, componentProps) {
  pushToChildFieldModal(config, "vsi", "volumes", stateData, componentProps);
}

/**
 * update vsi volume
 * @param {lazyZstate} config
 * @param {object} config.store
 * @param {object} config.store.json
 * @param {object} config.store.json.vsi
 * @param {Array<Object>} config.store.json.vsi.volumes
 * @param {object} stateData component state data
 */
function vsiVolumeSave(config, stateData, componentProps) {
  updateSubChild(config, "vsi", "volumes", stateData, componentProps);
}

/**
 * delete a vsi volume
 * @param {lazyZstate} config
 * @param {object} config.store
 * @param {object} config.store.json
 * @param {object} config.store.json.vsi
 * @param {Array<Object>} config.store.json.vsi.volumes
 * @param {object} stateData component state data
 * @param {object} componentProps props from component form
 * @param {string} componentProps.data.name original name
 */
function vsiVolumeDelete(config, stateData, componentProps) {
  deleteSubChild(config, "vsi", "volumes", componentProps);
}

/**
 * init vsi store
 * @param {*} store
 */
function initVsiStore(store) {
  store.newField("vsi", {
    init: vsiInit,
    onStoreUpdate: vsiOnStoreUpdate,
    create: vsiCreate,
    save: vsiSave,
    delete: vsiDelete,
    shouldDisableSave: shouldDisableComponentSave(
      [
        "name",
        "resource_group",
        "vpc",
        "image_name",
        "profile",
        "encryption_key",
        "vsi_per_subnet",
        "security_groups",
        "subnets",
        "ssh_keys",
      ],
      "vsi"
    ),
    schema: {
      name: {
        size: "small",
        default: "",
        invalid: invalidName("vsi"),
        invalidText: invalidNameText("vsi"),
      },
      resource_group: resourceGroupsField(true),
      vpc: {
        type: "select",
        labelText: "VPC",
        size: "small",
        default: "",
        invalid: fieldIsNullOrEmptyString("vpc"),
        invalidText: selectInvalidText("VPC"),
        groups: vpcGroups,
        onStateChange: function (stateData) {
          stateData.security_groups = [];
          stateData.subnets = [];
        },
      },
      subnets: subnetMultiSelect(),
      image_name: {
        labelText: "Image",
        size: "small",
        type: "fetchSelect",
        default: "",
        invalid: fieldIsNullOrEmptyString("image_name"),
        invalidText: selectInvalidText("image"),
        groups: [],
        apiEndpoint: function (stateData, componentProps) {
          return `/api/vsi/${componentProps.craig.store.json._options.region}/images`;
        },
      },
      profile: {
        size: "small",
        default: "",
        invalid: fieldIsNullOrEmptyString("profile"),
        invalidText: selectInvalidText("profile"),
        size: "small",
        type: "fetchSelect",
        groups: [],
        apiEndpoint: function (stateData, componentProps) {
          return `/api/vsi/${componentProps.craig.store.json._options.region}/instanceProfiles`;
        },
      },
      encryption_key: {
        type: "select",
        size: "small",
        default: "",
        invalid: fieldIsNullOrEmptyString("encryption_key"),
        invalidText: unconditionalInvalidText("Select an encryption key"),
        groups: encryptionKeyGroups,
      },
      vsi_per_subnet: {
        size: "small",
        default: "",
        invalid: fieldIsNotWholeNumber("vsi_per_subnet", 1, 10),
        invalidText: unconditionalInvalidText(
          "Enter a whole number between 1 and 10"
        ),
        labelText: "VSI Per Subnet",
      },
      security_groups: securityGroupsMultiselect(),
      ssh_keys: vpcSshKeyMultiselect(),
      enable_floating_ip: {
        size: "small",
        type: "toggle",
        default: false,
        labelText: "Enable Floating IP",
      },
      primary_interface_ip_spoofing: {
        size: "small",
        default: false,
        labelText: "Allow IP Spoofing",
        type: "toggle",
      },
      user_data: {
        type: "textArea",
        optional: "true",
        default: "",
        labelText: "User Data",
        placeholder: "Cloud init data",
      },
    },
    subComponents: {
      volumes: {
        create: vsiVolumeCreate,
        save: vsiVolumeSave,
        delete: vsiVolumeDelete,
        shouldDisableSave: shouldDisableComponentSave(
          ["name", "encryption_key", "capacity"],
          "vsi",
          "volumes"
        ),
        schema: {
          name: {
            default: "",
            invalid: invalidName("volume"),
            invalidText: invalidNameText("volume"),
          },
          profile: {
            type: "select",
            groups: ["3iops-tier", "5iops-tier", "10iops-tier"],
            default: "",
            invalid: fieldIsNullOrEmptyString("profile"),
            invalidText: selectInvalidText("profile"),
          },
          encryption_key: {
            type: "select",
            default: "",
            invalid: fieldIsNullOrEmptyString("encryption_key"),
            invalidText: unconditionalInvalidText("Select an encryption key"),
            groups: encryptionKeyGroups,
          },
          capacity: {
            default: "",
            placeholder: "100",
            invalid: function (stateData) {
              return (
                !isNullOrEmptyString(stateData.capacity) &&
                (stateData.capacity.indexOf(".") !== -1 ||
                  !isInRange(Number(stateData.capacity), 10, 16000))
              );
            },
            invalidText: unconditionalInvalidText(
              "Must ba whole number between 10 and 16000"
            ),
          },
        },
      },
    },
  });
}

module.exports = {
  vsiOnStoreUpdate,
  vsiSave,
  vsiDelete,
  vsiCreate,
  vsiInit,
  vsiVolumeCreate,
  vsiVolumeSave,
  vsiVolumeDelete,
  initVsiStore,
};
