import React from "react";
import { CraigFormHeading } from "../../forms/utils";
import { GatewayPublic, VirtualPrivateCloud } from "@carbon/icons-react";
import PropTypes from "prop-types";
import "./diagrams.css";
import { isNullOrEmptyString, splatContains } from "lazy-z";
import { DeploymentIcon } from "./DeploymentIcon";
import { CraigEmptyResourceTile } from "../../forms/dynamic-form";
import HoverClassNameWrapper from "./HoverClassNameWrapper";

export const VpcMap = (props) => {
  let craig = props.craig;
  let nullVpcResources = false;
  [
    "fortigate_vnf",
    "vsi",
    "vpn_servers",
    "vpn_gateways",
    "clusters",
    "routing_tables",
    "load_balancers",
    "security_groups",
    "virtual_private_endpoints",
  ].forEach((item) => {
    if (
      !nullVpcResources &&
      splatContains(craig.store.json[item], "vpc", null)
    ) {
      nullVpcResources = true;
    }
  });
  return craig.store.json.vpcs.length === 0 && !props.static ? (
    <CraigEmptyResourceTile
      name="VPCs"
      className="width580 marginTopHalfRem"
      customClick={
        window.location.pathname !== "/v2/vpc" ? (
          <>
            Add one from the{" "}
            <a href="/v2/vpc" style={{ marginLeft: "0.33rem" }}>
              VPC Page
            </a>
            .
          </>
        ) : undefined
      }
    />
  ) : (
    (nullVpcResources && !props.noDeployments
      ? [{ name: null, public_gateways: [] }]
      : []
    )
      .concat(craig.store.json.vpcs)
      .map((vpc, calcVpcIndex) => {
        let vpcBoxClassName =
          "subForm marginBottomSmall marginRight1Rem " +
          (props.small ? " width300" : " width580");
        let isRed =
          isNullOrEmptyString(vpc.resource_group, true) ||
          isNullOrEmptyString(vpc.bucket, true) ||
          vpc.name === null;
        // vpc index needs to be modified when there are rresources with no vpc
        let vpcIndex = props.noDeployments
          ? calcVpcIndex
          : vpc.name === null // if vpc name is null
          ? -2 // set index to number that is unselecteable, -1 is used for none
          : nullVpcResources // if null resources
          ? calcVpcIndex - 1 // vpc index is -1
          : calcVpcIndex; // otherwise use raw number
        if (props.isSelected && props.isSelected(vpcIndex)) {
          vpcBoxClassName += " diagramBoxSelected";
          isRed = false;
        }
        return (
          <HoverClassNameWrapper
            className={vpcBoxClassName}
            key={vpc.name + vpc.index}
            hoverClassName="diagramBoxSelected"
            static={props.static}
          >
            <div
              className={props.static || !props.onTitleClick ? "" : "clicky"}
            >
              <CraigFormHeading
                isRed={isRed}
                icon={<VirtualPrivateCloud className="diagramTitleIcon" />}
                className="marginBottomSmall"
                type="subHeading"
                name={
                  nullVpcResources && !vpc.name
                    ? "No VPC Selected"
                    : vpc.name + " VPC"
                }
                buttons={props.buttons ? props.buttons(vpcIndex) : ""}
                onClick={
                  props.onTitleClick
                    ? () => props.onTitleClick(vpcIndex)
                    : undefined
                }
              />
            </div>
            {React.Children.map(props.children, (child) =>
              // clone react child
              React.cloneElement(child, {
                vpc: vpc,
                vpc_index: vpcIndex,
              })
            )}
            <div
              className="displayFlex overrideGap alignItemsCenter"
              style={{
                justifyContent: "center",
              }}
            >
              {["1", "2", "3"].map((num) => {
                return (
                  <div style={{ width: "150px" }} key={num}>
                    {splatContains(vpc.public_gateways, "zone", Number(num)) ? (
                      <DeploymentIcon
                        icon={GatewayPublic}
                        item={{ name: "Public Gateway" }}
                        isSelected={() => {
                          return false;
                        }}
                        itemName="public_gateway"
                        small={props.small}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          </HoverClassNameWrapper>
        );
      })
  );
};

VpcMap.propTypes = {
  craig: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func,
  buttons: PropTypes.func,
};
