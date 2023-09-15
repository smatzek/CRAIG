const { powerVsWorkspaceRef } = require("./power-vs");
const { jsonToTfPrint, tfBlock } = require("./utils");
const { snakeCase, isNullOrEmptyString } = require("lazy-z");

/**
 * format power vs instance
 * @param {*} instance
 * @returns {string} terraform formatted json
 */
function formatPowerVsInstance(instance) {
  let data = {
    provider: `\${ibm.power_vs${snakeCase("_" + instance.zone)}}`,
    pi_image_id: `\${ibm_pi_image.power_image_${snakeCase(
      instance.workspace
    )}_${snakeCase(instance.image)}.image_id}`,
    pi_key_pair_name: `\${ibm_pi_key.power_vs_ssh_key_${snakeCase(
      instance.ssh_key
    )}.pi_key_name}`,
    pi_cloud_instance_id: powerVsWorkspaceRef(instance.workspace),
    pi_instance_name: "${var.prefix}-" + instance.name,
    pi_memory: instance.pi_memory,
    pi_processors: instance.pi_processors,
    pi_proc_type: instance.pi_proc_type,
    pi_sys_type: instance.pi_sys_type,
    pi_pin_policy: instance.pi_pin_policy,
    pi_health_status: instance.pi_health_status,
    pi_storage_type: instance.pi_storage_type,
    pi_network: [],
  };
  instance.network.forEach((nw) => {
    let nwData = {
      network_id: `\${ibm_pi_network.power_network_${snakeCase(
        instance.workspace
      )}_${snakeCase(nw.name)}.network_id}`,
    };
    if (!isNullOrEmptyString(nw.ip_address)) {
      nwData.ip_address = nw.ip_address;
    }
    data.pi_network.push(nwData);
  });
  return jsonToTfPrint(
    "resource",
    "ibm_pi_instance",
    `${instance.workspace}_workspace_instance_${instance.name}`,
    data
  );
}

/**
 * create power instance tf
 * @param {*} config
 * @returns {string} terraform file
 */
function powerInstanceTf(config) {
  // for some reason i do not understand this code didn't work in config-to-files
  // after spending about 30 mins debugging i moved it here and now it works great
  let tf =
    config.power_instances && config.power_instances.length > 0 ? "" : null;
  (config.power_instances || []).forEach((instance) => {
    tf += tfBlock(
      `${instance.name} Power Instance`,
      formatPowerVsInstance(instance)
    );
  });
  return tf;
}

module.exports = {
  formatPowerVsInstance,
  powerInstanceTf,
};