import {
  IbmCloudSubnets,
  SubnetAclRules,
  VirtualPrivateCloud,
} from "@carbon/icons-react";
import React from "react";
import {
  codeMirrorAclTf,
  codeMirrorSubnetsTf,
  codeMirrorVpcTf,
  disableSave,
} from "../../../lib";
import { DynamicAclForm } from "./DynamicAclForm";
import { docTabs } from "../diagrams/DocTabs";
import { DynamicSubnetTierForm } from "./DynamicSubnetTierForm";
import {
  PrimaryButton,
  CraigToggleForm,
  DynamicFormModal,
  CraigFormHeading,
  RenderForm,
  StatefulTabs,
} from "../../forms/utils";
import DynamicForm from "../../forms/DynamicForm";
import "./vpc.css";
import { craigForms } from "../CraigForms";
import { AclMap, SubnetTierMap, VpcMap } from "../diagrams";
import { ScrollFormWrapper } from "../diagrams/ScrollFormWrapper";

class VpcDiagramPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      aclIndex: -1,
      vpcIndex: -1,
      subnetTierIndex: -1,
      subnetTierCreateModal: false,
      aclCreateModal: false,
      vpcModal: false,
    };
    this.onAclEditClick = this.onAclEditClick.bind(this);
    this.onSubnetTierEditClick = this.onSubnetTierEditClick.bind(this);
    this.resetValues = this.resetValues.bind(this);
    this.onSubnetTierSubmit = this.onSubnetTierSubmit.bind(this);
    this.onSubnetTierDelete = this.onSubnetTierDelete.bind(this);
    this.onAclDelete = this.onAclDelete.bind(this);
    this.onAclSubmit = this.onAclSubmit.bind(this);
    this.onVpcSubmit = this.onVpcSubmit.bind(this);
    this.onVpcDelete = this.onVpcDelete.bind(this);
    this.onAclCreateClick = this.onAclCreateClick.bind(this);
    this.onVpcEditClick = this.onVpcEditClick.bind(this);
    this.onAclButtonClick = this.onAclButtonClick.bind(this);
  }

  onAclCreateClick(vpcIndex) {
    this.setState({
      vpcIndex: vpcIndex,
      aclIndex: -1,
      aclCreateModal: true,
      editing: false,
    });
  }

  /**
   * stop displaying form
   */
  resetValues(vpcIndex) {
    this.setState({
      editing: false,
      aclIndex: -1,
      subnetTierIndex: -1,
      aclCreateModal: false,
      vpcIndex: vpcIndex ? vpcIndex : this.state.vpcIndex,
    });
  }

  /**
   * on subnet tier click
   * @param {number} vpcIndex
   * @param {number} tierIndex
   */
  onSubnetTierEditClick(vpcIndex, tierIndex) {
    if (
      vpcIndex === this.state.vpcIndex &&
      tierIndex === this.state.subnetTierIndex
    ) {
      this.resetValues();
    } else {
      this.setState({
        vpcIndex: vpcIndex,
        subnetTierIndex: tierIndex,
        editing: true,
      });
    }
  }

  /**
   * on acl edit click
   * @param {number} vpcIndex
   * @param {number} aclIndex
   */
  onAclEditClick(vpcIndex, aclIndex) {
    if (vpcIndex === this.state.vpcIndex && aclIndex === this.state.aclIndex) {
      this.resetValues();
    } else {
      this.setState({
        editing: true,
        vpcIndex: vpcIndex,
        aclIndex: aclIndex,
        subnetTierIndex: -1,
      });
    }
  }

  /**
   * on vpc edit click
   * @param {*} vpcIndex
   */
  onVpcEditClick(vpcIndex) {
    if (
      vpcIndex === this.state.vpcIndex &&
      this.state.aclIndex === -1 &&
      this.state.subnetTierIndex === -1
    ) {
      this.resetValues();
      this.setState({ vpcIndex: -1 });
    } else {
      if (this.state.aclIndex > -1 || this.state.subnetTierIndex > -1) {
        this.resetValues();
      }
      this.setState({ vpcIndex: vpcIndex, editing: true });
    }
  }

  onSubnetTierSubmit(data) {
    this.props.craig.vpcs.subnetTiers.create(data, {
      vpc_name: this.props.craig.store.json.vpcs[this.state.vpcIndex].name,
    });
    this.setState({
      subnetTierCreateModal: false,
    });
  }

  onAclSubmit(data) {
    this.props.craig.vpcs.acls.create(data, {
      vpc_name: this.props.craig.store.json.vpcs[this.state.vpcIndex].name,
    });
    this.setState({
      aclCreateModal: false,
    });
  }

  // Delete functions are overriden to prevent component from trying to mount unfound
  // data as part of the editing form

  onSubnetTierDelete(stateData, componentProps) {
    this.resetValues();
    this.props.craig.vpcs.subnetTiers.delete(stateData, componentProps);
  }

  onAclDelete(stateData, componentProps) {
    this.resetValues();
    this.props.craig.vpcs.acls.delete(stateData, componentProps);
  }

  onVpcDelete(stateData, componentProps) {
    this.resetValues(-1);
    this.props.craig.vpcs.delete(stateData, componentProps);
  }

  onVpcSubmit(data) {
    this.props.craig.vpcs.create(data);
    this.setState({ vpcModal: false });
  }

  onAclButtonClick(vpcIndex, aclIndex) {
    this.setState({
      vpcIndex: vpcIndex,
      subnetTierCreateModal: true,
      aclIndex: aclIndex,
      editing: false,
    });
  }

  render() {
    let craig = this.props.craig;
    let modalName =
      (this.state.subnetTierCreateModal || this.state.aclCreateModal) &&
      this.state.vpcIndex > -1
        ? craig.store.json.vpcs[this.state.vpcIndex].name
        : "";
    let vpcFormData = craigForms(craig).vpcs;
    return (
      <>
        <DynamicFormModal
          name="Create a VPC"
          show={this.state.vpcModal}
          beginDisabled
          submissionFieldName="vpcs"
          onRequestClose={() => {
            this.setState({ vpcModal: false });
          }}
          onRequestSubmit={this.onVpcSubmit}
        >
          {RenderForm(DynamicForm, {
            className: "dynamic-form-modal",
            isModal: true,
            shouldDisableSubmit: function () {
              // references to `this` in function are intentionally vague
              // in order to pass the correct functions and field values to the
              // child modal component
              // by passing `this` in a function that it scoped to the component
              // we allow the function to be successfully bound to the modal form
              // while still referencing the local value `enableSubmitField`
              // to use it's own values for state and props including enableModal
              // and disableModal, which are dynamically added to the component
              // at time of render
              if (disableSave("vpcs", this.state, this.props) === false) {
                this.props.enableModal();
              } else {
                this.props.disableModal();
              }
            },
            craig: craig,
            form: vpcFormData,
          })}
        </DynamicFormModal>
        <DynamicFormModal
          name={`Create a Subnet Tier in ${modalName} VPC`}
          show={this.state.subnetTierCreateModal}
          beginDisabled
          submissionFieldName="subnetTiers"
          onRequestSubmit={this.onSubnetTierSubmit}
          onRequestClose={() => {
            this.setState({ subnetTierCreateModal: false });
          }}
        >
          {RenderForm(DynamicSubnetTierForm, {
            craig: craig,
            vpcIndex: this.state.vpcIndex,
            subnetTierIndex: -1,
            // set acl name for dynamic form
            aclName:
              this.state.aclIndex > -1
                ? craig.store.json.vpcs[this.state.vpcIndex].acls[
                    this.state.aclIndex
                  ].name
                : "",
            isModal: true,
            innerFormProps: {
              isModal: true,
              shouldDisableSubmit: function () {
                // see above
                this.props.setRefUpstream(this.state);
                if (
                  disableSave("subnetTier", this.state, this.props) === false
                ) {
                  this.props.enableModal();
                } else {
                  this.props.disableModal();
                }
              },
            },
          })}
        </DynamicFormModal>
        <DynamicFormModal
          name={`Create an ACL in ${modalName} VPC`}
          show={this.state.aclCreateModal}
          beginDisabled
          submissionFieldName="acls"
          onRequestSubmit={this.onAclSubmit}
          onRequestClose={() => {
            this.resetValues();
          }}
        >
          {RenderForm(DynamicAclForm, {
            craig: craig,
            vpcIndex: this.state.vpcIndex,
            aclIndex: -1,
            innerFormProps: {
              isModal: true,
              shouldDisableSubmit: function () {
                // see above
                this.props.setRefUpstream(this.state);
                if (disableSave("acls", this.state, this.props) === false) {
                  this.props.enableModal();
                } else {
                  this.props.disableModal();
                }
              },
            },
          })}
        </DynamicFormModal>
        <StatefulTabs
          h2
          icon={
            <VirtualPrivateCloud
              style={{ marginTop: "0.4rem", marginRight: "0.5rem" }}
              size="20"
            />
          }
          formName="Manage VPC Networks"
          nestedDocs={docTabs(
            [
              "Virtual Private Cloud",
              "Access Control Lists (ACLs)",
              "Subnets & Subnet Tiers",
            ],
            craig
          )}
          tfTabs={[
            {
              name: "VPCs",
              tf: codeMirrorVpcTf(craig.store.json),
            },
            {
              name: "Network ACLs",
              tf: codeMirrorAclTf(craig.store.json),
            },
            {
              name: "Subnets",
              tf: codeMirrorSubnetsTf(craig.store.json),
            },
          ]}
          name="VPC Networks"
          form={
            <>
              <div className="marginRight1Rem width580">
                <div className="marginBottomSmall" />
                <CraigFormHeading
                  name="VPC Networks"
                  noMarginBottom
                  buttons={
                    <PrimaryButton
                      type="add"
                      hoverText="Create a VPC"
                      onClick={() => {
                        this.setState({ vpcModal: true });
                      }}
                      noDeleteButton
                    />
                  }
                />
              </div>
              <div className="displayFlex rightForm">
                <div id="left-vpc">
                  <VpcMap
                    key={JSON.stringify(craig.store.json.vpcs)}
                    craig={craig}
                    onTitleClick={(vpcIndex) => this.onVpcEditClick(vpcIndex)}
                    isSelected={(vpcIndex) => {
                      return vpcIndex === this.state.vpcIndex;
                    }}
                    noDeployments
                    buttons={(vpcIndex) => {
                      return (
                        <PrimaryButton
                          type="add"
                          hoverText="Create an ACL"
                          onClick={() => {
                            this.onAclCreateClick(vpcIndex);
                          }}
                          noDeleteButton
                        />
                      );
                    }}
                  >
                    <AclMap
                      aclTitleClick={this.onAclEditClick}
                      isSelected={(vpcIndex, aclIndex) => {
                        return (
                          this.state.vpcIndex === vpcIndex &&
                          this.state.aclIndex === aclIndex
                        );
                      }}
                      buttons={(acl, vpcIndex, aclIndex) => {
                        return acl.name ? (
                          <>
                            <PrimaryButton
                              type="add"
                              hoverText="Create a new Subnet Tier"
                              noDeleteButton
                              onClick={() => {
                                this.onAclButtonClick(vpcIndex, aclIndex);
                              }}
                            />
                          </>
                        ) : (
                          ""
                        );
                      }}
                    >
                      <SubnetTierMap
                        foundSubnetsOnly
                        craig={craig}
                        isSelected={(
                          vpcIndex,
                          tierIndex,
                          allSubnetsHaveAcl
                        ) => {
                          return (
                            this.state.vpcIndex === vpcIndex &&
                            allSubnetsHaveAcl &&
                            this.state.subnetTierIndex === tierIndex
                          );
                        }}
                        onClick={(vpcIndex, tierIndex) => {
                          this.onSubnetTierEditClick(vpcIndex, tierIndex);
                        }}
                      />
                    </AclMap>
                  </VpcMap>
                </div>
                <div id="right-vpc">
                  {this.state.editing === true &&
                  this.state.aclCreateModal === false &&
                  this.state.subnetTierCreateModal === false ? (
                    <ScrollFormWrapper>
                      <CraigFormHeading
                        noMarginBottom
                        type="subHeading"
                        icon={
                          this.state.subnetTierIndex > -1 ? (
                            <IbmCloudSubnets className="diagramTitleIcon" />
                          ) : this.state.aclIndex > -1 ? (
                            <SubnetAclRules className="diagramTitleIcon" />
                          ) : (
                            <VirtualPrivateCloud className="diagramTitleIcon" />
                          )
                        }
                        name={`Editing ${
                          this.state.aclIndex > -1
                            ? "ACL for"
                            : this.state.subnetTierIndex > -1
                            ? "Subnet Tier for"
                            : ""
                        } ${
                          craig.store.json.vpcs[this.state.vpcIndex].name
                        } VPC`}
                      />
                      <div>
                        {this.state.subnetTierIndex > -1 ? (
                          <DynamicSubnetTierForm
                            vpcIndex={this.state.vpcIndex}
                            subnetTierIndex={this.state.subnetTierIndex}
                            craig={craig}
                            onDelete={this.onSubnetTierDelete}
                          />
                        ) : this.state.aclIndex > -1 ? (
                          <DynamicAclForm
                            vpcIndex={this.state.vpcIndex}
                            aclIndex={this.state.aclIndex}
                            craig={craig}
                            onDelete={this.onAclDelete}
                          />
                        ) : this.state.vpcIndex !== -1 ? (
                          <CraigToggleForm
                            key={this.state.vpcIndex}
                            tabPanel={{
                              hideAbout: true,
                            }}
                            onSave={craig.vpcs.save}
                            onDelete={this.onVpcDelete}
                            hide={false}
                            hideChevron
                            hideName
                            submissionFieldName="vpcs"
                            name={
                              craig.store.json.vpcs[this.state.vpcIndex].name +
                              " VPC"
                            }
                            innerFormProps={{
                              form: vpcFormData,
                              craig: craig,
                              data: craig.store.json.vpcs[this.state.vpcIndex],
                            }}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </ScrollFormWrapper>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </>
          }
        />
      </>
    );
  }
}

export default VpcDiagramPage;
