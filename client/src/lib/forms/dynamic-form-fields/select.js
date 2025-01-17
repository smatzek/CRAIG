const {
  contains,
  titleCase,
  paramTest,
  isFunction,
  deepEqual,
} = require("lazy-z");
const {
  dynamicFieldId,
  addClassName,
  disabledReturnsBooleanCheck,
  fieldFunctionReturnsStringCheck,
  invalidReturnsBooleanCheck,
  groupsEvaluatesToArrayCheck,
} = require("./utils");

/**
 *
 * @param {*} props
 * @param {string} props.name
 * @param {object} props.field
 * @param {Function=} props.field.onRender
 * @param {Function} props.field.disabled
 * @param {Function} props.field.invalid
 * @param {Function} props.field.invalidText
 * @param {object} props.parentState state data for stateful foem
 * @returns {object} props object for carbon react select
 */
function dynamicSelectProps(props, isMounted, stateData) {
  paramTest(
    "dynamicSelectProps",
    "props.name",
    "string",
    props.name,
    "props.field",
    "object",
    props.field,
    "props.field.disabled",
    "Function",
    props.field.disabled,
    "props.parentState",
    "object",
    props.parentState,
    "props.parentProps",
    "object",
    props.parentProps,
    "props.field.invalid",
    "Function",
    props.field.invalid,
    "props.field.invalidText",
    "Function",
    props.field.invalidText,
    "props.handleInputChange",
    "Function",
    props.handleInputChange
  );

  // check params for disabled
  let isDisabled =
    disabledReturnsBooleanCheck(props, "dynamicSelectProps") ||
    deepEqual(stateData, ["Loading..."]);

  // state value
  let stateValue = props.field.onRender
    ? props.field.onRender(props.parentState)
    : props.parentState[props.name];

  let groups = groupsEvaluatesToArrayCheck(
    props,
    "dynamicSelectProps",
    stateValue
  );

  let invalid = isDisabled
    ? false
    : contains(groups, stateValue)
    ? invalidReturnsBooleanCheck(props, "dynamicSelectProps")
    : props.field.invalid(props.parentState, props.parentProps);

  // hide text when tooltip so that multiple name labels are not rendered
  let labelText = props.field.tooltip
    ? ""
    : props.field.labelText || titleCase(props.name);
  let invalidText = fieldFunctionReturnsStringCheck(
    props,
    "dynamicSelectProps",
    "invalidText"
  );

  return {
    key: JSON.stringify(groups),
    id: dynamicFieldId(props),
    name: props.name,
    labelText: labelText,
    // force mapped numbers to return as a string to get around warning text
    // for carbon component
    value: String(stateValue || ""),
    className: addClassName(
      `leftTextAlign${props.field.tooltip ? " tooltip" : ""}`,
      props.field
    ),
    disabled: isDisabled,
    invalid: invalid,
    invalidText: invalidText,
    readOnly: !props.field.readOnly
      ? false
      : isFunction(props.field.readOnly)
      ? props.field.readOnly(props.parentState, props.parentProps)
      : props.field.readOnly,
    onChange: props.handleInputChange,
    groups: groups,
  };
}

module.exports = {
  dynamicSelectProps,
};
