const { isNullOrEmptyString } = require("lazy-z");
const {
  invalidName,
  invalidEncryptionKeyRing
} = require("./invalid-callbacks");

/**
 * disable save
 * @param {string} field field name
 * @param {Object} stateData
 * @param {Object} componentProps
 * @returns {boolean} true if match
 */
function disableSave(field, stateData, componentProps) {
  if (field === "object_storage") {
    return (
      invalidName("object_storage")(stateData, componentProps) ||
      isNullOrEmptyString(stateData.kms) ||
      isNullOrEmptyString(stateData.resource_group)
    );
  } else if (field === "buckets") {
    return (
      invalidName("buckets")(stateData, componentProps) ||
      isNullOrEmptyString(stateData.kms_key)
    );
  } else if (field === "cos_keys") {
    return invalidName("cos_keys")(stateData, componentProps);
  } else if (field === "encryption_keys") {
    return (
      invalidName("encryption_keys")(stateData, componentProps) ||
      invalidEncryptionKeyRing(stateData)
    );
  } else if (field === "key_management") {
    return (
      invalidName("key_management")(stateData, componentProps) ||
      isNullOrEmptyString(stateData.resource_group)
    );
  } else if (field === "secrets_manager") {
    return (
      invalidName("secrets_manager")(stateData, componentProps) ||
      isNullOrEmptyString(stateData.resource_group) ||
      isNullOrEmptyString(stateData.encryption_key)
    );
  } else if (field === "resource_groups") {
    return invalidName("resource_groups")(stateData, componentProps);
  } else return false;
}

module.exports = { disableSave };
