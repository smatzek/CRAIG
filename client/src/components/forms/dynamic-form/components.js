import React from "react";
// popover wrapper needs to be imported this way to prevent an error importing
// dynamic form before initializtion
import { default as PopoverWrapper } from "../utils/PopoverWrapper";
import {
  dynamicTextInputProps,
  dynamicSelectProps,
  dynamicFieldId,
  dynamicToggleProps,
  dynamicTextAreaProps,
  dynamicMultiSelectProps,
} from "../../../lib/forms/dynamic-form-fields";
import {
  FilterableMultiSelect,
  SelectItem,
  TextArea,
  Toggle,
  TextInput,
  Select,
  Tag,
  DatePicker,
  DatePickerInput,
} from "@carbon/react";
import PropTypes from "prop-types";
import { dynamicPasswordInputProps } from "../../../lib/forms/dynamic-form-fields/password-input";
import { contains, deepEqual, isFunction, isNullOrEmptyString } from "lazy-z";
import { ToolTipWrapper } from "../utils/ToolTip";
import { RenderForm } from "../utils";

const tagColors = ["red", "magenta", "purple", "blue", "cyan", "teal", "green"];

const DynamicToolTipWrapper = (props) => {
  //make sure that either children or innerForm are passed as a prop
  if (props.children === undefined && props.innerForm === undefined) {
    throw new Error(
      "DynamicToolTipWrapper expects either `props.children` or `props.innerForm` when rendering ToolTipWrapper, got neither."
    );
  }
  return props.tooltip ? (
    <ToolTipWrapper {...props} />
  ) : props.children ? (
    props.children
  ) : (
    RenderForm(props.innerForm, {})
  );
};

DynamicToolTipWrapper.propTypes = {
  tooltip: PropTypes.shape({
    content: PropTypes.string,
    link: PropTypes.string,
  }),
  isModal: PropTypes.bool,
  children: PropTypes.node,
  innerForm: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

const DynamicFormTextInput = (props) => {
  return <TextInput {...dynamicTextInputProps(props)} />;
};

DynamicFormTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  propsName: PropTypes.string,
  keyIndex: PropTypes.number,
  field: PropTypes.shape({
    invalid: PropTypes.func.isRequired,
    invalidText: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    optional: PropTypes.bool,
    labelText: PropTypes.string,
    disabled: PropTypes.func.isRequired,
    disabledText: PropTypes.func.isRequired,
    className: PropTypes.string,
    placeholder: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  }).isRequired,
  parentState: PropTypes.shape({}).isRequired,
  parentProps: PropTypes.shape({}).isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

const DynamicFormSelect = (props) => {
  let selectProps = { ...dynamicSelectProps(props) };

  return (
    <PopoverWrapper
      hoverText={selectProps.value || ""}
      className={props.field.tooltip ? " tooltip" : "select"}
    >
      <Select {...selectProps}>
        {selectProps.groups.map((value) => (
          <SelectItem
            text={value}
            value={value}
            key={dynamicFieldId(props) + "-" + value}
          />
        ))}
      </Select>
    </PopoverWrapper>
  );
};

DynamicFormSelect.propTypes = {
  name: PropTypes.string.isRequired,
  propsName: PropTypes.string.isRequired,
  keyIndex: PropTypes.number.isRequired,
  field: PropTypes.shape({
    invalid: PropTypes.func.isRequired,
    invalidText: PropTypes.func.isRequired,
    optional: PropTypes.bool,
    labelText: PropTypes.string,
    disabled: PropTypes.func.isRequired,
    className: PropTypes.string,
    groups: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.func,
    ]).isRequired,
    readOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  }).isRequired,
  parentState: PropTypes.shape({}).isRequired,
  parentProps: PropTypes.shape({}).isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

const DynamicFormToggle = (props) => {
  return <Toggle {...dynamicToggleProps(props)} />;
};

DynamicFormToggle.propTypes = {
  tooltip: PropTypes.shape({
    content: PropTypes.string.isRequired,
    link: PropTypes.string,
    alignModal: PropTypes.string,
  }),
  className: PropTypes.string,
  labelText: PropTypes.string,
  propsName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  parentState: PropTypes.shape({}).isRequired,
  parentProps: PropTypes.shape({}).isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

const DynamicTextArea = (props) => {
  return (
    <>
      <TextArea {...dynamicTextAreaProps(props)} />
      <div>
        {props.field.labelText === "Tags"
          ? props.parentState.tags.map((tag, i) => (
              <Tag
                key={"tag" + i}
                size="md"
                type={tagColors[i % tagColors.length]}
              >
                {tag}
              </Tag>
            ))
          : ""}
      </div>
    </>
  );
};

DynamicTextArea.propTypes = {
  name: PropTypes.string.isRequired,
  propsName: PropTypes.string.isRequired,
  keyIndex: PropTypes.number.isRequired,
  field: PropTypes.shape({
    labelText: PropTypes.string, // not required for toolip wrapper
    invalid: PropTypes.func.isRequired,
    invalidText: PropTypes.func.isRequired,
    placeholder: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
      .isRequired,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  parentState: PropTypes.shape({}).isRequired,
  parentProps: PropTypes.shape({}).isRequired,
};

const DynamicMultiSelect = (props) => {
  return <FilterableMultiSelect {...dynamicMultiSelectProps(props)} />;
};

DynamicMultiSelect.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  parentState: PropTypes.shape({}).isRequired,
  parentProps: PropTypes.shape({}).isRequired,
  field: PropTypes.shape({
    onRender: PropTypes.func,
    invalid: PropTypes.func.isRequired,
    groups: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.func,
    ]).isRequired,
    tooltip: PropTypes.shape({}),
    labelText: PropTypes.string,
    forceUpdateKey: PropTypes.func,
    disabled: PropTypes.func.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

const DynamicPublicKey = (props) => {
  return (
    <div className="fieldWidthBigger leftTextAlign">
      <TextInput {...dynamicPasswordInputProps(props)} />
    </div>
  );
};

DynamicPublicKey.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  parentState: PropTypes.shape({}).isRequired,
  parentProps: PropTypes.shape({}).isRequired,
  field: PropTypes.shape({
    onRender: PropTypes.func,
    invalid: PropTypes.func.isRequired,
    tooltip: PropTypes.shape({}),
    labelText: PropTypes.string,
    forceUpdateKey: PropTypes.func,
  }).isRequired,
  name: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export class DynamicFetchSelect extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: ["Loading..."],
    };
    this.dataToGroups = this.dataToGroups.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    // on mount if not items have been set
    if (deepEqual(this.state.data, ["Loading..."]))
      fetch(
        // generate api endpoint based on state and props
        this.props.field.apiEndpoint(
          this.props.parentState,
          this.props.parentProps
        )
      )
        .then((res) => res.json())
        .then((data) => {
          // set state with data if mounted
          if (this._isMounted) {
            this.setState({ data: data });
          }
        })
        .catch((err) => {
          console.error(err);
        });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  dataToGroups() {
    let apiEndpoint = this.props.field.apiEndpoint(
      this.props.parentState,
      this.props.parentProps
    );
    if (apiEndpoint === "/api/cluster/versions") {
      // add "" if kube version is reset
      return (
        this.props.parentProps.isModal ||
        isNullOrEmptyString(this.props.parentState.kube_version)
          ? [""]
          : []
      ).concat(
        // filter version based on kube type
        this.state.data.filter((version) => {
          if (
            (this.props.parentState.kube_type === "openshift" &&
              contains(version, "openshift")) ||
            (this.props.parentState.kube_type === "iks" &&
              !contains(version, "openshift")) ||
            version === "default"
          ) {
            return version.replace(/\s\(Default\)/g, "");
          }
        })
      );
    } else {
      return (
        // to prevent storage pools from being loaded incorrectly,
        // prevent first item in storage groups from being loaded when not selected
        (
          dynamicSelectProps(this.props).value === "" &&
          this._isMounted &&
          !deepEqual(this.state.data, ["Loading..."])
            ? [""]
            : []
        )
          .concat(this.state.data)
          .map((item) => {
            if (isFunction(this.props.field.onRender)) {
              return this.props.field.onRender({
                [this.props.name]: item,
              });
            } else return item;
          })
      );
    }
  }

  render() {
    let props = { ...this.props };
    return (
      <PopoverWrapper
        key={this.dataToGroups()}
        hoverText={dynamicSelectProps(props).value || ""}
        className={props.field.tooltip ? " tooltip" : "select"}
      >
        <Select
          {...dynamicSelectProps(props, this._isMounted, this.state.data)}
        >
          {this.dataToGroups().map((value) => (
            <SelectItem
              text={value}
              value={value}
              key={dynamicFieldId(props) + "-" + value + this.dataToGroups()}
            />
          ))}
        </Select>
      </PopoverWrapper>
    );
  }
}

export class DynamicFetchMultiSelect extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: ["Loading..."],
    };
  }

  componentDidMount() {
    this._isMounted = true;
    // on mount if not items have been set
    if (deepEqual(this.state.data, ["Loading..."])) {
      fetch(
        // generate api endpoint based on state and props
        this.props.field.apiEndpoint(
          this.props.parentState,
          this.props.parentProps
        )
      )
        .then((res) => res.json())
        .then((data) => {
          // set state with data if mounted
          if (this._isMounted) {
            this.setState({ data: data }, () => {
              this.props.onPowerImageLoad(data);
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // Force re-fetch of images on zone change
  componentDidUpdate(prevProps) {
    if (prevProps.parentState.zone != this.props.parentState.zone) {
      this._isMounted = false;
      this.setState({ data: ["Loading..."] }, () => {
        this.componentDidMount();
      });
    }
  }

  render() {
    let props = { ...this.props };
    return (
      <FilterableMultiSelect
        {...dynamicMultiSelectProps(props, this.state.data)}
      />
    );
  }
}

const DynamicDatePicker = (props) => {
  // only used in opaque secrets, if we use this in other places we can
  // change it to be more dynamic
  return (
    <DatePicker
      datePickerType="single"
      dateFormat="Y-m-d"
      value={props.parentState.expiration_date}
      onChange={(selectEvent) => {
        let event = {
          target: {
            name: "expiration_date",
            value: selectEvent[0],
          },
        };
        props.handleInputChange(event);
      }}
    >
      <DatePickerInput
        placeholder="YYYY-MM-DD"
        labelText="Expiration Date"
        id={"expiration-date"}
        invalid={!props.parentState.expiration_date}
        invalidText={"Select an expiration date"}
      />
    </DatePicker>
  );
};

export {
  DynamicFormTextInput,
  DynamicFormSelect,
  DynamicFormToggle,
  DynamicTextArea,
  DynamicMultiSelect,
  DynamicPublicKey,
  DynamicToolTipWrapper,
  tagColors,
  DynamicDatePicker,
};
