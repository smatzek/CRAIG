import {
  buildSubnet,
  clusterHelperTestCallback,
  disableSave,
  forceShowForm,
  invalidName,
  invalidNameText,
  newF5Vsi,
  propsMatchState,
  resourceGroupHelperTextCallback,
} from "../../lib";
import {
  AccessGroupsTemplate,
  AppIdTemplate,
  AtrackerPage,
  ClassicVlanTemplate,
  CloudDatabaseTemplate,
  ClustersTemplate,
  DnsTemplate,
  EventStreamsTemplate,
  ResourceGroupsTemplate,
  SecretsManagerTemplate,
  SecurityGroupTemplate,
  SubnetPageTemplate,
  KeyManagementTemplate,
  NetworkAclTemplate,
  ObjectStorageTemplate,
  RoutingTableTemplate,
  SshKeysTemplate,
  VpnGatewayTemplate,
  VpnServerTemplate,
  VpeTemplate,
  VsiTemplate,
  VsiLoadBalancerTemplate,
  IamAccountSettingsPage,
  SccV1Page,
  F5BigIpPage,
  PowerVsWorkspacePage,
  PowerVsVolumesPage,
  ClassicGatewaysPage,
  IcseFormTemplate,
} from "icse-react-assets";
import { RenderDocs } from "./SimplePages";
import {
  contains,
  eachKey,
  keys,
  nestedSplat,
  splat,
  isEmpty,
  getObjectFromArray,
} from "lazy-z";
import {
  cosResourceHelperTextCallback,
  disableSshKeyDelete,
  encryptionKeyFilter,
  getSubnetTierStateData,
  getTierSubnets,
  invalidCidrBlock,
  invalidSecurityGroupRuleName,
  invalidSecurityGroupRuleText,
  storageChangeDisabledCallback,
  vpnServersHelperText,
  powerImageFetch,
} from "../../lib/forms";
import {
  invalidCidr,
  invalidCrnList,
  invalidF5Vsi,
  invalidIamAccountSettings,
  invalidIdentityProviderURI,
  invalidSshPublicKey,
  invalidDescription,
  replicationDisabledCallback,
  invalidSubnetTierName,
} from "../../lib/forms/invalid-callbacks";
import {
  accessGroupPolicyHelperTextCallback,
  aclHelperTextCallback,
  genericNameCallback,
  iamAccountSettingInvalidText,
  invalidCidrText,
  powerVsWorkspaceHelperText,
  invalidDescriptionText,
  invalidSubnetTierText,
} from "../../lib/forms/text-callbacks";
import { CopyRuleForm } from "../forms";
import { f5Images } from "../../lib/json-to-iac";
import { Tile } from "@carbon/react";
import { CloudAlerting } from "@carbon/icons-react";
import {
  edgeRouterEnabledZones,
  cosPlans,
  powerStoragePoolRegionMap,
  datacenters,
} from "../../lib/constants";
import DynamicForm from "../forms/DynamicForm";
import { ClassicDisabledTile } from "../forms/dynamic-form/tiles";

const AccessGroupsPage = (craig) => {
  return (
    <AccessGroupsTemplate
      docs={RenderDocs("access_groups", craig.store.json._options.template)}
      access_groups={craig.store.json.access_groups}
      disableSave={disableSave}
      propsMatchState={propsMatchState}
      onDelete={craig.access_groups.delete}
      onSave={craig.access_groups.save}
      onSubmit={craig.access_groups.create}
      invalidCallback={invalidName("access_groups")}
      invalidTextCallback={invalidNameText("access_groups")}
      invalidPolicyCallback={invalidName("policies")}
      invalidPolicyTextCallback={invalidNameText("policies")}
      policyHelperTextCallback={accessGroupPolicyHelperTextCallback}
      onPolicyDelete={craig.access_groups.policies.delete}
      onPolicySave={craig.access_groups.policies.save}
      onPolicySubmit={craig.access_groups.policies.create}
      craig={craig}
      forceOpen={forceShowForm}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
      invalidDynamicPolicyCallback={invalidName("dynamic_policies")}
      invalidDynamicPolicyTextCallback={invalidNameText("dynamic_policies")}
      dynamicPolicyHelperTextCallback={accessGroupPolicyHelperTextCallback}
      invalidIdentityProviderCallback={invalidIdentityProviderURI}
      onDynamicPolicyDelete={craig.access_groups.dynamic_policies.delete}
      onDynamicPolicySave={craig.access_groups.dynamic_policies.save}
      onDynamicPolicySubmit={craig.access_groups.dynamic_policies.create}
    />
  );
};

const AppIdPage = (craig) => {
  return (
    <AppIdTemplate
      docs={RenderDocs("appid", craig.store.json._options.template)}
      appid={craig.store.json.appid}
      disableSave={function (field, stateData, componentProps) {
        // field is passed here but the goal is to be able to ignore the
        // parameter entirely
        return craig.appid.shouldDisableSave(stateData, componentProps);
      }}
      forceOpen={function (stateData, componentProps) {
        // goal here is to be able to pass one param `shouldDisableSave`
        // and handle both disable and force Open
        return craig.appid.shouldDisableSave(stateData, componentProps);
      }}
      onDelete={craig.appid.delete}
      onSave={craig.appid.save}
      onSubmit={craig.appid.create}
      propsMatchState={propsMatchState}
      craig={craig}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
      invalidCallback={craig.appid.name.invalid}
      invalidTextCallback={craig.appid.name.invalidText}
      invalidKeyCallback={craig.appid.keys.name.invalid}
      invalidKeyTextCallback={craig.appid.keys.name.invalidText}
      onKeySave={craig.appid.keys.save}
      onKeyDelete={craig.appid.keys.delete}
      onKeySubmit={craig.appid.keys.create}
      encryptionKeys={craig.store.encryptionKeys}
    />
  );
};

const Atracker = (craig) => {
  return (
    <AtrackerPage
      docs={RenderDocs("atracker", craig.store.json._options.template)()}
      propsMatchState={propsMatchState}
      disableSave={disableSave}
      craig={craig}
      prefix={craig.store.json._options.prefix}
      region={craig.store.json._options.region}
      data={craig.store.json.atracker}
      resourceName={`${craig.store.json._options.prefix}-atracker`}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
      cosKeys={craig.store.cosKeys}
      cosBuckets={craig.store.cosBuckets}
      onSave={craig.atracker.save}
    />
  );
};

const Cis = (craig) => {
  return (
    <IcseFormTemplate
      name="Cloud Internet Services (CIS)"
      addText="Create a CIS Instance"
      docs={RenderDocs("cis", craig.store.json._options.template)}
      innerForm={DynamicForm}
      arrayData={craig.store.json.cis}
      onDelete={craig.cis.delete}
      onSave={craig.cis.save}
      onSubmit={craig.cis.create}
      propsMatchState={propsMatchState}
      disableSave={disableSave}
      forceOpen={forceShowForm}
      innerFormProps={{
        craig: craig,
        disableSave: disableSave,
        formName: "CIS",
        form: {
          jsonField: "cis",
          setDefault: {
            domains: [],
            dns_records: [],
          },
          groups: [
            {
              name: craig.cis.name,
              resource_group: craig.cis.resource_group,
              plan: craig.cis.plan,
            },
          ],
          subForms: [
            {
              name: "Domains",
              createText: "Add a domain",
              jsonField: "domains",
              toggleFormFieldName: "domain",
              form: {
                groups: [
                  {
                    domain: craig.cis.domains.domain,
                    type: craig.cis.domains.type,
                  },
                ],
              },
            },
            {
              name: "DNS Records",
              createText: "Add a DNS Record",
              jsonField: "dns_records",
              hideFormTitleButton: function (stateData, componentProps) {
                return componentProps.data.domains.length === 0;
              },
              form: {
                groups: [
                  {
                    name: craig.cis.dns_records.name,
                    domain: craig.cis.dns_records.domain,
                  },
                  {
                    type: craig.cis.dns_records.type,
                    content: craig.cis.dns_records.content,
                  },
                  {
                    ttl: craig.cis.dns_records.ttl,
                  },
                ],
              },
            },
          ],
        },
      }}
      toggleFormProps={{
        craig: craig,
        disableSave: disableSave,
        submissionFieldName: "cis",
        hideName: true,
      }}
    />
  );
};

const NoClassicSshKeys = () => {
  return (
    <Tile className="tileBackground displayFlex alignItemsCenter wrap marginTop">
      <CloudAlerting size="24" className="iconMargin" /> No Classic SSH Keys
      have been created. Create one from the
      <a className="no-secrets-link" href="/form/classicSshKeys">
        Classic SSH Keys Page.
      </a>{" "}
    </Tile>
  );
};

const NoClassicVlans = () => {
  return (
    <Tile className="tileBackground displayFlex alignItemsCenter wrap marginTop">
      <CloudAlerting size="24" className="iconMargin" /> No Classic VLANs have
      been created. Create one from the
      <a className="no-secrets-link" href="/form/classicVlans">
        Classic VLANs Page.
      </a>{" "}
    </Tile>
  );
};

const ClassicGateways = (craig) => {
  return (
    <ClassicGatewaysPage
      overrideTile={
        !craig.store.json._options.enable_classic ? (
          <ClassicDisabledTile />
        ) : craig.store.json.classic_ssh_keys.length === 0 ? (
          <NoClassicSshKeys />
        ) : craig.store.json.classic_vlans.length === 0 ? (
          <NoClassicVlans />
        ) : undefined
      }
      classic_gateways={craig.store.json.classic_gateways || []}
      disableSave={disableSave}
      propsMatchState={propsMatchState}
      onSave={craig.classic_gateways.save}
      onSubmit={craig.classic_gateways.create}
      onDelete={craig.classic_gateways.delete}
      craig={craig}
      docs={RenderDocs("classic_gateways", craig.store.json._options.template)}
      composedNameCallback={function (stateData) {
        return `${craig.store.json._options.prefix}-gateway-${stateData.name}`;
      }}
      invalidCallback={craig.classic_gateways.name.invalid}
      invalidTextCallback={craig.classic_gateways.name.invalidText}
      datacenterList={datacenters}
      classicSshKeyList={splat(craig.store.json.classic_ssh_keys, "name")}
      classic_vlans={craig.store.json.classic_vlans}
      invalidMemoryCallback={craig.classic_gateways.memory.invalid}
      invalidMemoryTextCallback={craig.classic_gateways.memory.invalidText}
      invalidDomainCallback={craig.classic_gateways.domain.invalid}
      invalidDomainTextCallback={craig.classic_gateways.domain.invalidText}
    />
  );
};

const ClassicSshKeyPage = (craig) => {
  return (
    <SshKeysTemplate
      classic
      overrideTile={
        craig.store.json._options.enable_classic ? undefined : (
          <ClassicDisabledTile />
        )
      }
      ssh_keys={craig.store.json.classic_ssh_keys}
      disableSave={(field, stateData, componentProps) => {
        return disableSave("classic_ssh_keys", stateData, componentProps);
      }}
      onDelete={craig.classic_ssh_keys.delete}
      onSave={craig.classic_ssh_keys.save}
      onSubmit={craig.classic_ssh_keys.create}
      propsMatchState={propsMatchState}
      forceOpen={forceShowForm}
      invalidCallback={craig.classic_ssh_keys.name.invalid}
      invalidTextCallback={craig.classic_ssh_keys.name.invalidText}
      deleteDisabled={() => {
        // currently ssh keys are not in use, this will be updated when they are
        return false;
      }}
      // sends both invalid and invalidText, should change when we move to dynamic forms
      invalidKeyCallback={invalidSshPublicKey}
      craig={craig}
      docs={RenderDocs("classic_ssh_keys", craig.store.json._options.template)}
    />
  );
};

const ClassicVlanPage = (craig) => {
  return (
    <IcseFormTemplate
      name="Classic VLANs"
      addText="Create a VLAN"
      docs={RenderDocs("classic_vlans", craig.store.json._options.template)}
      innerForm={DynamicForm}
      arrayData={craig.store.json.classic_vlans}
      disableSave={disableSave}
      onDelete={craig.classic_vlans.delete}
      onSave={craig.classic_vlans.save}
      onSubmit={craig.classic_vlans.create}
      propsMatchState={propsMatchState}
      forceOpen={forceShowForm}
      hideFormTitleButton={
        craig.store.json._options.enable_classic ? false : true
      }
      overrideTile={
        craig.store.json._options.enable_classic ? undefined : (
          <ClassicDisabledTile />
        )
      }
      innerFormProps={{
        craig: craig,
        disableSave: disableSave,
        form: {
          groups: [
            {
              name: craig.classic_vlans.name,
              datacenter: craig.classic_vlans.datacenter,
            },
            {
              type: craig.classic_vlans.type,
              router_hostname: craig.classic_vlans.router_hostname,
            },
          ],
        },
        formName: "classic-vlan",
      }}
      toggleFormProps={{
        craig: craig,
        disableSave: disableSave,
        submissionFieldName: "classic_vlans",
        hideName: true,
      }}
    />
  );
};

const CloudDatabasePage = (craig) => {
  return (
    <CloudDatabaseTemplate
      icd={craig.store.json.icd}
      disableSave={disableSave}
      onDelete={craig.icd.delete}
      onSave={craig.icd.save}
      onSubmit={craig.icd.create}
      propsMatchState={propsMatchState}
      forceOpen={forceShowForm}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
      encryptionKeys={craig.store.encryptionKeys}
      invalidCallback={craig.icd.name.invalid}
      invalidTextCallback={craig.icd.name.invalidText}
      invalidCpuCallback={craig.icd.cpu.invalid}
      invalidCpuTextCallback={craig.icd.cpu.invalidText}
      craig={craig}
      docs={RenderDocs("icd", craig.store.json._options.template)}
    />
  );
};

const ClusterPage = (craig) => {
  return (
    <ClustersTemplate
      noSecretsManager={craig.store.json.secrets_manager.length === 0}
      docs={RenderDocs("clusters", craig.store.json._options.template)}
      clusters={craig.store.json.clusters}
      disableSave={disableSave}
      onDelete={craig.clusters.delete}
      onSave={craig.clusters.save}
      onSubmit={craig.clusters.create}
      invalidCallback={craig.clusters.name.invalid}
      invalidTextCallback={craig.clusters.name.invalidText}
      propsMatchState={propsMatchState}
      forceOpen={forceShowForm}
      craig={craig}
      invalidPoolCallback={invalidName("worker_pools")}
      invalidPoolTextCallback={invalidNameText("worker_pools")}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
      vpcList={craig.store.vpcList}
      encryptionKeys={craig.store.encryptionKeys}
      subnetList={craig.getAllSubnets()}
      kubeVersionApiEndpoint="/api/cluster/versions"
      flavorApiEndpoint={`/api/cluster/${craig.store.json._options.region}/flavors`}
      helperTextCallback={clusterHelperTestCallback}
      cosNames={splat(craig.store.json.object_storage, "name")}
      secretsManagerList={splat(craig.store.json.secrets_manager, "name")}
      secretsManagerGroupCallback={function (stateData, componentProps, field) {
        return invalidName(field || "secrets_group")(
          stateData,
          componentProps,
          field
        );
      }}
      secretsManagerGroupCallbackText={invalidNameText("secrets_group")}
      secretCallback={function (stateData, componentProps, field) {
        return invalidName(field || "opaque_secrets")(
          stateData,
          componentProps,
          field
        );
      }}
      secretCallbackText={function (stateData, componentProps, field) {
        return invalidNameText(field || "opaque_secrets")(
          stateData,
          componentProps,
          field
        );
      }}
      descriptionInvalid={invalidDescription}
      descriptionInvalidText={invalidDescriptionText}
      labelsInvalid={craig.clusters.opaque_secrets.labels.invalid}
      labelsInvalidText="One or more labels are invalid"
      onPoolSave={craig.clusters.worker_pools.save}
      onPoolDelete={craig.clusters.worker_pools.delete}
      onPoolSubmit={craig.clusters.worker_pools.create}
      onOpaqueSecretsSave={craig.clusters.opaque_secrets.save}
      onOpaqueSecretsDelete={craig.clusters.opaque_secrets.delete}
      onOpaqueSecretsSubmit={craig.clusters.opaque_secrets.create}
      disablePoolSave={function (field, stateData, componentProps) {
        // field is clusters, inject worker pools
        return disableSave("worker_pools", stateData, componentProps);
      }}
      disableOpaqueSecretsSave={function (field, stateData, componentProps) {
        // field is clusters, inject opaque secrets
        return disableSave("opaque_secrets", stateData, componentProps);
      }}
    />
  );
};

const DnsPage = (craig) => {
  return (
    <DnsTemplate
      craig={craig}
      docs={RenderDocs("dns", craig.store.json._options.template)}
      dns={craig.store.json.dns}
      disableSave={disableSave}
      propsMatchState={propsMatchState}
      onDelete={craig.dns.delete}
      onSave={craig.dns.save}
      onSubmit={craig.dns.create}
      forceOpen={forceShowForm}
      invalidCallback={craig.dns.name.invalid}
      invalidTextCallback={craig.dns.name.invalidText}
      onZoneSave={craig.dns.zones.save}
      onZoneDelete={craig.dns.zones.delete}
      onZoneSubmit={craig.dns.zones.create}
      invalidZoneNameCallback={craig.dns.zones.name.invalid}
      invalidZoneNameTextCallback={craig.dns.zones.name.invalidText}
      invalidLabelCallback={craig.dns.zones.label.invalid}
      invalidDescriptionCallback={craig.dns.zones.description.invalid}
      invalidDescriptionTextCallback={invalidDescriptionText}
      vpcList={craig.store.vpcList}
      onRecordSave={craig.dns.records.save}
      onRecordDelete={craig.dns.records.delete}
      onRecordSubmit={craig.dns.records.create}
      invalidRecordCallback={craig.dns.records.name.invalid}
      invalidRecordTextCallback={craig.dns.records.name.invalidText}
      invalidRdataCallback={craig.dns.records.rdata.invalid}
      dnsZones={nestedSplat(craig.store.json.dns, "zones", "name")}
      onResolverSave={craig.dns.custom_resolvers.save}
      onResolverSubmit={craig.dns.custom_resolvers.create}
      onResolverDelete={craig.dns.custom_resolvers.delete}
      invalidResolverNameCallback={craig.dns.custom_resolvers.name.invalid}
      invalidResolverNameTextCallback={
        craig.dns.custom_resolvers.name.invalidText
      }
      invalidResolverDescriptionCallback={
        craig.dns.custom_resolvers.description.invalid
      }
      invalidResolverDescriptionTextCallback={invalidDescriptionText}
      subnetList={craig.getAllSubnets()}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
    />
  );
};

const EventStreamsPage = (craig) => {
  return (
    <EventStreamsTemplate
      event_streams={craig.store.json.event_streams}
      disableSave={disableSave}
      onDelete={craig.event_streams.delete}
      onSave={craig.event_streams.save}
      onSubmit={craig.event_streams.create}
      propsMatchState={propsMatchState}
      forceOpen={forceShowForm}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
      invalidCallback={craig.event_streams.name.invalid}
      invalidTextCallback={craig.event_streams.name.invalidText}
      craig={craig}
      docs={RenderDocs("event_streams", craig.store.json._options.template)}
    />
  );
};

const F5BigIp = (craig) => {
  let templateData = {};
  let vsiData = {};
  if (craig.store.json.f5_vsi.length > 0) {
    // pass in defaults if instances exist
    vsiData = {
      resource_group: craig.store.json.f5_vsi[0].resource_group,
      ssh_keys: craig.store.json.f5_vsi[0].ssh_keys,
      image: /f5-bigip-(15-1-5-1-0-0-14|16-1-2-2-0-0-28)-(ltm|all)-1slot/.exec(
        craig.store.json.f5_vsi[0].image
      )[0], // keep only image name in props
      profile: craig.store.json.f5_vsi[0].profile,
      zones: craig.store.json.f5_vsi.length,
    };
    templateData = craig.store.json.f5_vsi[0].template;
  } else {
    vsiData = {
      zones: craig.store.json.f5_vsi.length,
    };
  }
  return (
    <F5BigIpPage
      docs={RenderDocs("f5", craig.store.json._options.template)()}
      craig={craig}
      propsMatchState={propsMatchState}
      disableSave={disableSave}
      invalidTemplateCallback={invalidF5Vsi}
      vsis={craig.store.json.f5_vsi || []}
      sshKeys={craig.store.sshKeys}
      edge_pattern={craig.store.edge_pattern}
      f5_on_management={craig.store.edge_vpc_name === "management"}
      instanceProfilesApiEndpoint={`/api/vsi/${craig.store.json._options.region}/instanceProfiles`}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
      encryptionKeys={craig.store.encryptionKeys}
      f5Images={Object.keys(f5Images().public_image_map)}
      initVsiCallback={newF5Vsi}
      saveVsiCallback={craig.f5.instance.save}
      templateData={templateData}
      deploymentData={vsiData}
      onTemplateSave={craig.f5.template.save}
      onVsiSave={craig.f5.vsi.save}
      noEdgePattern={craig.store.edge_pattern === undefined}
    />
  );
};

const IamAccountSettings = (craig) => {
  return (
    <IamAccountSettingsPage
      craig={craig}
      onSave={craig.iam_account_settings.save}
      onDelete={() => {
        craig.store.json.iam_account_settings.enable = false;
        craig.update();
      }}
      docs={RenderDocs(
        "iam_account_settings",
        craig.store.json._options.template
      )()}
      data={craig.store.json.iam_account_settings}
      useAddButton={craig.store.json.iam_account_settings.enable === false}
      noDeleteButton={craig.store.json.iam_account_settings.enable === false}
      invalidCallback={invalidIamAccountSettings}
      invalidTextCallback={iamAccountSettingInvalidText}
      disableSave={disableSave}
      propsMatchState={propsMatchState}
    />
  );
};

const KeyManagementPage = (craig) => {
  return (
    <KeyManagementTemplate
      docs={RenderDocs("key_management", craig.store.json._options.template)}
      key_management={craig.store.json.key_management}
      disableSave={disableSave}
      onDelete={craig.key_management.delete}
      onSave={craig.key_management.save}
      onSubmit={craig.key_management.create}
      propsMatchState={propsMatchState}
      forceOpen={forceShowForm}
      craig={craig}
      deleteDisabled={() => {
        return (
          craig.store.json.key_management.length === 1 &&
          craig.store.json._options.fs_cloud
        );
      }}
      selectEndpoint={
        craig.store.json._options.endpoints === "public-and-private"
      }
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
      invalidCallback={craig.key_management.name.invalid}
      invalidTextCallback={craig.key_management.name.invalidText}
      invalidKeyCallback={craig.key_management.keys.name.invalid}
      invalidKeyTextCallback={craig.key_management.keys.name.invalidText}
      invalidRingCallback={craig.key_management.keys.key_ring.invalid}
      invalidRingText={
        "Invalid Key Ring Name. Must match the regular expression: /^[A-z]([a-z0-9-]*[a-z0-9])*$/s"
      }
      onKeySave={craig.key_management.keys.save}
      onKeyDelete={craig.key_management.keys.delete}
      onKeySubmit={craig.key_management.keys.create}
    />
  );
};

const NetworkAclPage = (craig) => {
  return (
    <NetworkAclTemplate
      vpcs={craig.store.json.vpcs}
      docs={RenderDocs("acls", craig.store.json._options.template)}
      forceOpen={forceShowForm}
      craig={craig}
      onAclSubmit={craig.vpcs.acls.create}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
      child={CopyRuleForm}
      invalidTextCallback={craig.vpcs.acls.name.invalidText}
      invalidCallback={craig.vpcs.acls.name.invalid}
      invalidRuleTextCallback={craig.vpcs.acls.rules.name.invalidText}
      invalidRuleText={craig.vpcs.acls.rules.name.invalid}
      disableSave={disableSave}
      propsMatchState={propsMatchState}
      helperTextCallback={aclHelperTextCallback}
      onRuleSave={craig.vpcs.acls.rules.save}
      onRuleDelete={craig.vpcs.acls.rules.delete}
      onSubmitCallback={craig.vpcs.acls.rules.create}
      onSave={craig.vpcs.acls.save}
      onDelete={craig.vpcs.acls.delete}
    />
  );
};

const LoadBalancerPage = (craig) => {
  return (
    <VsiLoadBalancerTemplate
      docs={RenderDocs("load_balancers", craig.store.json._options.template)}
      load_balancers={craig.store.json.load_balancers}
      disableSave={disableSave}
      onDelete={craig.load_balancers.delete}
      onSave={craig.load_balancers.save}
      onSubmit={craig.load_balancers.create}
      propsMatchState={propsMatchState}
      forceOpen={forceShowForm}
      craig={craig}
      invalidCallback={craig.load_balancers.name.invalid}
      invalidTextCallback={craig.load_balancers.name.invalidText}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
      vpcList={craig.store.vpcList}
      securityGroups={craig.store.json.security_groups}
      vsiDeployments={craig.store.json.vsi}
    />
  );
};

const ObjectStoragePage = (craig) => {
  return (
    <ObjectStorageTemplate
      docs={RenderDocs("object_storage", craig.store.json._options.template)}
      object_storage={craig.store.json.object_storage}
      disableSave={disableSave}
      onDelete={craig.object_storage.delete}
      onSave={craig.object_storage.save}
      onSubmit={craig.object_storage.create}
      propsMatchState={propsMatchState}
      forceOpen={forceShowForm}
      kmsList={splat(craig.store.json.key_management, "name")}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
      craig={craig}
      cosPlans={cosPlans}
      encryptionKeys={craig.store.encryptionKeys}
      invalidCallback={craig.object_storage.name.invalid}
      invalidTextCallback={craig.object_storage.name.invalidText}
      invalidKeyCallback={craig.object_storage.keys.name.invalid}
      invalidKeyTextCallback={craig.object_storage.keys.name.invalidText}
      invalidBucketCallback={craig.object_storage.buckets.name.invalid}
      invalidBucketTextCallback={craig.object_storage.buckets.name.invalidText}
      onKeySave={craig.object_storage.keys.save}
      onKeyDelete={craig.object_storage.keys.delete}
      onKeySubmit={craig.object_storage.keys.create}
      onBucketSave={craig.object_storage.buckets.save}
      onBucketDelete={craig.object_storage.buckets.delete}
      onBucketSubmit={craig.object_storage.buckets.create}
      composedNameCallback={cosResourceHelperTextCallback}
      encryptionKeyFilter={encryptionKeyFilter}
    />
  );
};

const NoPowerNetworkTile = () => {
  return (
    <Tile className="tileBackground displayFlex alignItemsCenter wrap marginTop">
      <CloudAlerting size="24" className="iconMargin" /> Power VS is not
      enabled. Return to the
      <a className="no-secrets-link" href="/">
        Options Page
      </a>{" "}
      to enable Power VS.
    </Tile>
  );
};

const NoPowerWorkspaceTile = () => {
  return (
    <Tile className="tileBackground displayFlex alignItemsCenter wrap marginTop">
      <CloudAlerting size="24" className="iconMargin" /> No Power VS Workspaces.
      Go to the
      <a className="no-secrets-link" href="/form/power">
        Power VS Workspace Page
      </a>{" "}
      to create one.
    </Tile>
  );
};

const PowerInfraPage = (craig) => {
  let powerImageMap = {};
  craig.store.json._options.power_vs_zones.forEach((zone) => {
    powerImageFetch(zone, fetch).then((zoneImages) => {
      powerImageMap[zone] = zoneImages;
    });
  });
  return (
    <PowerVsWorkspacePage
      overrideTile={
        craig.store.json._options.enable_power_vs ? undefined : (
          <NoPowerNetworkTile />
        )
      }
      edgeRouterEnabledZones={edgeRouterEnabledZones}
      power={[...craig.store.json.power]}
      disableSave={disableSave}
      propsMatchState={propsMatchState}
      onDelete={craig.power.delete}
      onSave={craig.power.save}
      onSubmit={craig.power.create}
      forceOpen={forceShowForm}
      deleteDisabled={() => {
        return (
          craig.store.json.power.length === 1 &&
          (!isEmpty(craig.store.json.power_instances) ||
            !isEmpty(craig.store.json.power_volumes))
        );
      }}
      craig={craig}
      docs={RenderDocs("power", craig.store.json._options.template)}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
      zones={craig.store.json._options.power_vs_zones}
      onNetworkDelete={craig.power.network.delete}
      onNetworkSave={craig.power.network.save}
      onNetworkSubmit={craig.power.network.create}
      onConnectionDelete={craig.power.cloud_connections.delete}
      onConnectionSave={craig.power.cloud_connections.save}
      onConnectionSubmit={craig.power.cloud_connections.create}
      transitGatewayList={splat(craig.store.json.transit_gateways, "name")}
      onSshKeyDelete={craig.power.ssh_keys.delete}
      onSshKeySave={craig.power.ssh_keys.save}
      onSshKeySubmit={craig.power.ssh_keys.create}
      invalidCallback={craig.power.name.invalid}
      invalidTextCallback={craig.power.name.invalidText}
      helperTextCallback={powerVsWorkspaceHelperText}
      invalidKeyCallback={invalidSshPublicKey}
      invalidNetworkNameCallback={craig.power.network.name.invalid}
      invalidNetworkNameCallbackText={craig.power.network.name.invalidText}
      invalidConnectionNameCallback={craig.power.cloud_connections.name.invalid}
      invalidConnectionNameTextCallback={
        craig.power.cloud_connections.name.invalidText
      }
      sshKeyDeleteDisabled={() => {
        // currently ssh keys are not in use, this will be updated when they are
        return false;
      }}
      invalidCidrCallback={craig.power.network.pi_cidr.invalid}
      invalidSshKeyCallback={craig.power.ssh_keys.name.invalid}
      invalidSshKeyCallbackText={craig.power.ssh_keys.name.invalidText}
      invalidCidrCallbackText={craig.power.network.pi_cidr.invalidText}
      invalidDnsCallback={craig.power.network.pi_dns.invalid}
      invalidDnsCallbackText={craig.power.network.pi_dns.invalidText}
      imageMap={powerImageMap}
      onAttachmentSave={craig.power.attachments.save}
      disableAttachmentSave={storageChangeDisabledCallback}
    />
  );
};

const PowerVsInstances = (craig) => {
  let powerStoragePoolMap = {};
  craig.store.json._options.power_vs_zones.forEach((zone) => {
    powerStoragePoolFetch(zone, fetch).then((zonePools) => {
      powerStoragePoolMap[zone] = zonePools;
    });
  });
  return (
    <IcseFormTemplate
      name="Power VS Instances"
      addText="Create an Instance"
      docs={RenderDocs("power_instances", craig.store.json._options.template)}
      overrideTile={
        !craig.store.json._options.enable_power_vs ? (
          <NoPowerNetworkTile />
        ) : craig.store.json.power.length === 0 ? (
          <NoPowerWorkspaceTile />
        ) : undefined
      }
      innerForm={DynamicForm}
      arrayData={craig.store.json.power_instances}
      onSave={craig.power_instances.save}
      onSubmit={craig.power_instances.create}
      onDelete={craig.power_instances.delete}
      propsMatchState={propsMatchState}
      disableSave={disableSave}
      forceOpen={forceShowForm}
      innerFormProps={{
        craig: craig,
        disableSave: disableSave,
        // hard code for now, we will need a better solution for dynamically getting
        // storage pools with API call. The issue here is that the async fetches
        // do not set value until after the component is rendered if it is forced
        // open. In addition, the old call was happening each time anything was rendered
        // which is not ideal
        powerStoragePoolMap: powerStoragePoolRegionMap,
        formName: "Power Instances",
        form: {
          jsonField: "power_instances",
          setDefault: {},
          groups: [
            {
              sap: craig.power_instances.sap,
              sap_profile: craig.power_instances.sap_profile,
            },
            {
              name: craig.power_instances.name,
              workspace: craig.power_instances.workspace,
              network: craig.power_instances.network,
            },
            {
              ssh_key: craig.power_instances.ssh_key,
              image: craig.power_instances.image,
              pi_sys_type: craig.power_instances.pi_sys_type,
            },
            {
              pi_proc_type: craig.power_instances.pi_proc_type,
              pi_processors: craig.power_instances.pi_processors,
              pi_memory: craig.power_instances.pi_memory,
            },
            {
              pi_storage_pool_affinity:
                craig.power_instances.pi_storage_pool_affinity,
            },
            {
              heading: {
                name: "Boot Volume",
                type: "subHeading",
              },
            },
            {
              storage_option: craig.power_instances.storage_option,
              pi_storage_type: craig.power_instances.pi_storage_type,
              pi_storage_pool: craig.power_instances.pi_storage_pool,
              affinity_type: craig.power_instances.affinity_type,
              pi_affinity_volume: craig.power_instances.pi_affinity_volume,
              pi_anti_affinity_volume:
                craig.power_instances.pi_anti_affinity_volume,
              pi_anti_affinity_instance:
                craig.power_instances.pi_anti_affinity_instance,
              pi_affinity_instance: craig.power_instances.pi_affinity_instance,
            },
            {
              heading: {
                name: "IP Interface Options",
                type: "subHeading",
              },
            },
          ],
        },
      }}
      toggleFormProps={{
        craig: craig,
        disableSave: disableSave,
        submissionFieldName: "power_instances",
        hideName: true,
      }}
    />
  );
};

const PowerVsVolumes = (craig) => {
  return (
    <PowerVsVolumesPage
      overrideTile={
        !craig.store.json._options.enable_power_vs ? (
          <NoPowerNetworkTile />
        ) : craig.store.json.power.length === 0 ? (
          <NoPowerNetworkTile />
        ) : undefined
      }
      power_volumes={craig.store.json.power_volumes}
      disableSave={disableSave}
      propsMatchState={propsMatchState}
      onDelete={craig.power_volumes.delete}
      onSave={craig.power_volumes.save}
      onSubmit={craig.power_volumes.create}
      forceOpen={forceShowForm}
      deleteDisabled={(componentProps) => {
        if (componentProps.data.sap) return true;
        else return false;
      }}
      craig={craig}
      docs={RenderDocs("power_volumes", craig.store.json._options.template)}
      power={craig.store.json.power}
      power_instances={craig.store.json.power_instances}
      invalidCallback={craig.power_volumes.name.invalid}
      invalidTextCallback={craig.power_volumes.name.invalidText}
      replicationDisabledCallback={replicationDisabledCallback}
      affinityChangesDisabled={() => {
        // placeholder
        return false;
      }}
      storage_pool_map={powerStoragePoolRegionMap}
      disableCapacityCallback={function (stateData, componentProps) {
        if (stateData.sap === true && contains(stateData.name, "-sap-log-")) {
          return false;
        } else if (stateData.sap) {
          return true;
        } else return false;
      }}
    />
  );
};

const ResourceGroupPage = (craig) => {
  return (
    <ResourceGroupsTemplate
      resource_groups={craig.store.json.resource_groups}
      docs={RenderDocs("resource_groups", craig.store.json._options.template)}
      disableSave={disableSave}
      onDelete={craig.resource_groups.delete}
      onSave={craig.resource_groups.save}
      onSubmit={craig.resource_groups.create}
      propsMatchState={propsMatchState}
      forceOpen={forceShowForm}
      craig={craig}
      deleteDisabled={() => {
        return craig.store.json.resource_groups.length === 1;
      }}
      helperTextCallback={resourceGroupHelperTextCallback}
      invalidCallback={craig.resource_groups.name.invalid}
      invalidTextCallback={craig.resource_groups.name.invalidText}
    />
  );
};

const RoutingTablesPage = (craig) => {
  return (
    <RoutingTableTemplate
      routing_tables={craig.store.json.routing_tables}
      disableSave={disableSave}
      docs={RenderDocs("routing_tables", craig.store.json._options.template)}
      propsMatchState={propsMatchState}
      onDelete={craig.routing_tables.delete}
      onSave={craig.routing_tables.save}
      onSubmit={craig.routing_tables.create}
      forceOpen={forceShowForm}
      craig={craig}
      vpcList={craig.store.vpcList}
      invalidCallback={craig.routing_tables.name.invalid}
      invalidTextCallback={craig.routing_tables.name.invalidText}
      invalidRouteTextCallback={craig.routing_tables.routes.name.invalidText}
      invalidRouteCallback={craig.routing_tables.routes.name.invalid}
      onRouteSave={craig.routing_tables.routes.save}
      onRouteDelete={craig.routing_tables.routes.delete}
      onRouteSubmit={craig.routing_tables.routes.create}
    />
  );
};

const SccV1 = (craig) => {
  let sccData = { ...craig.store.json.scc },
    sccEnabled = craig.store.json.scc.enable === false;
  eachKey(sccData, (key) => {
    if (sccData[key] === null) {
      sccData[key] = "";
    }
  });
  return (
    <SccV1Page
      docs={RenderDocs(
        "security_compliance_center",
        craig.store.json._options.template
      )()}
      propsMatchState={propsMatchState}
      disableSave={disableSave}
      craig={craig}
      data={sccData}
      onSave={craig.scc.save}
      useAddButton={sccEnabled}
      invalidCallback={invalidName("scc")}
      invalidTextCallback={() => {
        return genericNameCallback();
      }}
      noDeleteButton={sccEnabled}
      onDelete={() => {
        craig.store.json.scc.enable = false;
        craig.update();
      }}
    />
  );
};

const SecretsManagerPage = (craig) => {
  return (
    <SecretsManagerTemplate
      secrets_managers={craig.store.json.secrets_manager}
      disableSave={disableSave}
      onDelete={craig.secrets_manager.delete}
      onSave={craig.secrets_manager.save}
      onSubmit={craig.secrets_manager.create}
      propsMatchState={propsMatchState}
      forceOpen={forceShowForm}
      craig={craig}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
      encryptionKeys={craig.store.encryptionKeys}
      invalidCallback={craig.secrets_manager.name.invalid}
      invalidTextCallback={craig.secrets_manager.name.invalidText}
      secrets={craig.getAllResourceKeys()}
      docs={RenderDocs("secrets_manager", craig.store.json._options.template)}
    />
  );
};

const SecurityGroupPage = (craig) => {
  return (
    <>
      <SecurityGroupTemplate
        docs={RenderDocs("security_groups", craig.store.json._options.template)}
        security_groups={craig.store.json.security_groups}
        disableSave={disableSave}
        onDelete={craig.security_groups.delete}
        onSave={craig.security_groups.save}
        onSubmit={craig.security_groups.create}
        propsMatchState={propsMatchState}
        forceOpen={forceShowForm}
        craig={craig}
        resourceGroups={splat(craig.store.json.resource_groups, "name")}
        invalidCallback={craig.security_groups.name.invalid}
        invalidTextCallback={craig.security_groups.name.invalidText}
        disableSaveCallback={function (stateData, componentProps) {
          return (
            propsMatchState("sg_rules", stateData, componentProps) ||
            disableSave("sg_rules", stateData, componentProps)
          );
        }}
        // due to the complex table and the way these are rendered it is
        // unlikely that a dynamic form is practical to use for the creation
        // of sg rules, so I'm fine leaving these as is
        invalidRuleText={invalidSecurityGroupRuleName}
        invalidRuleTextCallback={invalidSecurityGroupRuleText}
        onSubmitCallback={craig.security_groups.rules.create}
        onRuleSave={craig.security_groups.rules.save}
        onRuleDelete={craig.security_groups.rules.delete}
        vpcList={craig.store.vpcList}
      />
      {craig.store.json.security_groups.length > 0 && (
        <CopyRuleForm craig={craig} isAclForm={false} />
      )}
    </>
  );
};

const SubnetsPage = (craig) => {
  return (
    <SubnetPageTemplate
      vpcs={craig.store.json.vpcs}
      docs={RenderDocs("subnets", craig.store.json._options.template)}
      forceOpen={forceShowForm}
      subnetTiers={craig.store.subnetTiers}
      dynamicSubnets={craig.store.json._options.dynamic_subnets}
      subnetListCallback={(stateData, componentProps) => {
        let nextTier = [craig.store.subnetTiers[componentProps.data.name]]
          .length;
        let subnets = [];
        while (subnets.length < stateData.zones) {
          subnets.push(
            buildSubnet(
              componentProps.vpc_name,
              keys(craig.store.subnetTiers).indexOf(componentProps.vpc_name),
              stateData.name,
              nextTier,
              stateData.networkAcl,
              componentProps.data.resource_group,
              subnets.length + 1,
              stateData.addPublicGateway
            )
          );
        }
        return subnets;
      }}
      craig={craig}
      propsMatchState={propsMatchState}
      disableSave={disableSave}
      invalidSubnetTierText={craig.vpcs.subnetTiers.name.invalidText}
      invalidSubnetTierName={craig.vpcs.subnetTiers.name.invalid}
      invalidCidr={invalidCidr}
      invalidName={invalidName} // needed due to deeply rooted logic with subnet tier names
      // not changing below invalid name text for now due to complexity, likely
      // these forms will be easier to manage whem moving to dynamic forms
      invalidCidrText={invalidCidrText}
      invalidNameText={invalidNameText}
      getSubnetTierStateData={getSubnetTierStateData}
      getTierSubnets={getTierSubnets}
      onSubnetSubmit={craig.vpcs.subnetTiers}
      onSubnetSave={craig.vpcs.subnets.save}
      onSubnetTierSave={craig.vpcs.subnetTiers.save}
      onSubnetTierDelete={craig.vpcs.subnetTiers.delete}
    />
  );
};

const SshKeysPage = (craig) => {
  return (
    <SshKeysTemplate
      ssh_keys={craig.store.json.ssh_keys}
      disableSave={disableSave}
      onDelete={craig.ssh_keys.delete}
      onSave={craig.ssh_keys.save}
      onSubmit={craig.ssh_keys.create}
      propsMatchState={propsMatchState}
      forceOpen={forceShowForm}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
      invalidCallback={invalidName("ssh_keys")}
      invalidTextCallback={invalidNameText("ssh_keys")}
      craig={craig}
      docs={RenderDocs("ssh_keys", craig.store.json._options.template)}
      deleteDisabled={disableSshKeyDelete}
      invalidKeyCallback={invalidSshPublicKey}
    />
  );
};

const TransitGatewayPage = (craig) => {
  return (
    <IcseFormTemplate
      name="Transit Gateways"
      addText="Create a Transit Gateway"
      docs={RenderDocs("transit_gateways", craig.store.json._options.template)}
      innerForm={DynamicForm}
      arrayData={craig.store.json.transit_gateways}
      onDelete={craig.transit_gateways.delete}
      onSave={craig.transit_gateways.save}
      onSubmit={craig.transit_gateways.create}
      propsMatchState={propsMatchState}
      disableSave={disableSave}
      forceOpen={forceShowForm}
      innerFormProps={{
        craig: craig,
        disableSave: disableSave,
        formName: "Transit Gateway",
        form: {
          jsonField: "transit_gateways",
          setDefault: {
            connections: [],
          },
          groups: [
            {
              use_data: craig.transit_gateways.use_data,
            },
            {
              name: craig.transit_gateways.name,
              resource_group: craig.transit_gateways.resource_group,
            },
            {
              hideWhen: function (stateData) {
                return stateData.use_data;
              },
              global: craig.transit_gateways.global,
            },
            {
              heading: {
                name: "Connections",
                type: "subHeading",
              },
            },
            {
              vpc_connections: craig.transit_gateways.vpc_connections,
              power_connections: craig.transit_gateways.power_connections,
            },
            // the patterns where existing infrastructure exists are more likely
            // to import a transit gateway than a vpc CRN. JSON-to-IaC for CRNs
            // is still supported, but will not be displayed. If we have a request
            // for that functionality, we should implement
          ],
          subForms: [
            {
              name: "GRE Tunnels",
              createText: "Create a GRE Tunnel",
              jsonField: "gre_tunnels",
              toggleFormFieldName: "gateway",
              hideFormTitleButton: function (stateData, componentProps) {
                return (
                  !componentProps.craig.store.json._options.enable_classic ||
                  componentProps.craig.store.json.classic_gateways.length === 0
                );
              },
              form: {
                groups: [
                  {
                    gateway: craig.transit_gateways.gre_tunnels.gateway,
                    zone: craig.transit_gateways.gre_tunnels.zone,
                  },
                  {
                    local_tunnel_ip:
                      craig.transit_gateways.gre_tunnels.local_tunnel_ip,
                    remote_tunnel_ip:
                      craig.transit_gateways.gre_tunnels.remote_tunnel_ip,
                  },
                  {
                    remote_bgp_asn:
                      craig.transit_gateways.gre_tunnels.remote_bgp_asn,
                  },
                ],
              },
            },
            {
              name: "Prefix Filters",
              createText: "Create a Prefix Filter",
              jsonField: "prefix_filters",
              form: {
                groups: [
                  {
                    name: craig.transit_gateways.prefix_filters.name,
                  },
                  {
                    connection_type:
                      craig.transit_gateways.prefix_filters.connection_type,
                    target: craig.transit_gateways.prefix_filters.target,
                  },
                  {
                    action: craig.transit_gateways.prefix_filters.action,
                    prefix: craig.transit_gateways.prefix_filters.prefix,
                  },
                  {
                    le: craig.transit_gateways.prefix_filters.le,
                    ge: craig.transit_gateways.prefix_filters.ge,
                  },
                ],
              },
            },
          ],
        },
      }}
      toggleFormProps={{
        craig: craig,
        disableSave: disableSave,
        submissionFieldName: "transit_gateways",
        hideName: true,
      }}
    />
  );
};

const VpnGatewayPage = (craig) => {
  return (
    <VpnGatewayTemplate
      docs={RenderDocs("vpn_gateways", craig.store.json._options.template)}
      vpn_gateways={craig.store.json.vpn_gateways}
      disableSave={disableSave}
      onDelete={craig.vpn_gateways.delete}
      onSave={craig.vpn_gateways.save}
      onSubmit={craig.vpn_gateways.create}
      propsMatchState={propsMatchState}
      forceOpen={forceShowForm}
      craig={craig}
      invalidCallback={craig.vpn_gateways.name.invalid}
      invalidTextCallback={craig.vpn_gateways.name.invalidText}
      vpcList={craig.store.vpcList}
      subnetList={craig.getAllSubnets()}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
    />
  );
};

const VpnServerPage = (craig) => {
  return (
    <VpnServerTemplate
      noSecretsManager={craig.store.json.secrets_manager.length === 0}
      vpn_servers={craig.store.json.vpn_servers}
      disableSave={disableSave}
      onDelete={craig.vpn_servers.delete}
      onSave={craig.vpn_servers.save}
      onSubmit={craig.vpn_servers.create}
      propsMatchState={propsMatchState}
      forceOpen={forceShowForm}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
      invalidCallback={craig.vpn_servers.name.invalid}
      invalidTextCallback={craig.vpn_servers.name.invalidText}
      craig={craig}
      docs={RenderDocs("vpn_servers", craig.store.json._options.template)}
      invalidCidrBlock={invalidCidrBlock}
      invalidCrnList={invalidCrnList}
      onRouteSave={craig.vpn_servers.routes.save}
      onRouteDelete={craig.vpn_servers.routes.delete}
      onRouteSubmit={craig.vpn_servers.routes.create}
      invalidRouteCallback={craig.vpn_servers.routes.name.invalid}
      invalidRouteTextCallback={craig.vpn_servers.routes.name.invalidText}
      subnetList={craig.getAllSubnets()}
      vpcList={craig.store.vpcList}
      securityGroups={craig.store.json.security_groups}
      helperTextCallback={vpnServersHelperText}
      secretsManagerList={splat(craig.store.json.secrets_manager, "name")}
    />
  );
};

const VpcPage = (craig) => {
  return (
    <IcseFormTemplate
      name="Virtual Private Clouds"
      addText="Create a VPC"
      docs={RenderDocs("vpcs", craig.store.json._options.template)}
      innerForm={DynamicForm}
      arrayData={craig.store.json.vpcs}
      onDelete={craig.vpcs.delete}
      onSave={craig.vpcs.save}
      onSubmit={craig.vpcs.create}
      propsMatchState={propsMatchState}
      disableSave={disableSave}
      forceOpen={forceShowForm}
      innerFormProps={{
        craig: craig,
        disableSave: disableSave,
        formName: "VPC",
        form: {
          setDefault: {
            public_gateways: [],
            publicGateways: [],
          },
          groups: [
            {
              name: craig.vpcs.name,
              resource_group: craig.vpcs.resource_group,
              bucket: craig.vpcs.bucket,
            },
            {
              default_network_acl_name: craig.vpcs.default_network_acl_name,
              default_security_group_name:
                craig.vpcs.default_security_group_name,
              default_routing_table_name: craig.vpcs.default_routing_table_name,
            },
            {
              heading: {
                name: "Public Gateways",
                type: "subHeading",
                tooltip: {
                  content:
                    "Public Gateways allow for all resources in a zone to communicate with the public internet. Public Gateways are not needed for subnets where a VPN gateway is created.",
                },
              },
            },
            {
              pgw_zone_1: craig.vpcs.pgw_zone_1,
              pgw_zone_2: craig.vpcs.pgw_zone_2,
              pgw_zone_3: craig.vpcs.pgw_zone_3,
            },
            {
              heading: {
                name: "Classic Access",
                type: "subHeading",
              },
            },
            {
              classic_access: craig.vpcs.classic_access,
            },
          ],
        },
      }}
      toggleFormProps={{
        craig: craig,
        disableSave: disableSave,
        submissionFieldName: "vpcs",
        hideName: true,
      }}
    />
    // <VpcTemplate
    //   docs={RenderDocs("vpcs", craig.store.json._options.template)}
    //   vpcs={craig.store.json.vpcs}
    //   disableSave={disableSave}
    //   propsMatchState={propsMatchState}
    //   forceOpen={forceShowForm}
    //   craig={craig}
    //   // vpc name and callbacks take in extra param, so for now
    //   // these will remain unchanged
    //   invalidCallback={invalidName("vpcs")}
    //   invalidTextCallback={invalidNameText("vpcs")}
    //   resourceGroups={splat(craig.store.json.resource_groups, "name")}
    //   cosBuckets={craig.store.cosBuckets}
    // />
  );
};

const VpePage = (craig) => {
  return (
    <VpeTemplate
      docs={RenderDocs(
        "virtual_private_endpoints",
        craig.store.json._options.template
      )}
      vpe={craig.store.json.virtual_private_endpoints}
      disableSave={disableSave}
      onDelete={craig.virtual_private_endpoints.delete}
      onSave={craig.virtual_private_endpoints.save}
      onSubmit={craig.virtual_private_endpoints.create}
      propsMatchState={propsMatchState}
      forceOpen={forceShowForm}
      craig={craig}
      invalidCallback={craig.virtual_private_endpoints.name.invalid}
      invalidTextCallback={craig.virtual_private_endpoints.name.invalidText}
      vpcList={craig.store.vpcList}
      subnetList={craig.getAllSubnets()}
      securityGroups={craig.store.json.security_groups}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
      secretsManagerInstances={splat(craig.store.json.secrets_manager, "name")}
    />
  );
};

const VsiPage = (craig) => {
  return (
    <VsiTemplate
      docs={RenderDocs("vsi", craig.store.json._options.template)}
      vsi={craig.store.json.vsi}
      disableSave={disableSave}
      onDelete={craig.vsi.delete}
      onSave={craig.vsi.save}
      onSubmit={craig.vsi.create}
      propsMatchState={propsMatchState}
      forceOpen={forceShowForm}
      craig={craig}
      resourceGroups={splat(craig.store.json.resource_groups, "name")}
      encryptionKeys={craig.store.encryptionKeys}
      sshKeys={craig.store.sshKeys}
      apiEndpointImages={`/api/vsi/${craig.store.json._options.region}/images`}
      apiEndpointInstanceProfiles={`/api/vsi/${craig.store.json._options.region}/instanceProfiles`}
      invalidCallback={craig.vsi.name.invalid}
      invalidTextCallback={craig.vsi.name.invalidText}
      invalidVolumeCallback={craig.vsi.volumes.name.invalid}
      invalidVolumeTextCallback={craig.vsi.volumes.name.invalidText}
      onVolumeSave={craig.vsi.volumes.save}
      onVolumeDelete={craig.vsi.volumes.delete}
      onVolumeCreate={craig.vsi.volumes.create}
      vpcList={craig.store.vpcList}
      securityGroups={craig.store.json.security_groups}
      subnetList={craig.getAllSubnets()}
    />
  );
};

export const NewFormPage = (props) => {
  let { form, craig } = props;

  if (form === "accessGroups") {
    return AccessGroupsPage(craig);
  } else if (form === "appID") {
    return AppIdPage(craig);
  } else if (form === "activityTracker") {
    return Atracker(craig);
  } else if (form === "cis") {
    return Cis(craig);
  } else if (form === "classicGateways") {
    return ClassicGateways(craig);
  } else if (form === "classicSshKeys") {
    return ClassicSshKeyPage(craig);
  } else if (form === "classicVlans") {
    return ClassicVlanPage(craig);
  } else if (form === "icd") {
    return CloudDatabasePage(craig);
  } else if (form === "clusters") {
    return ClusterPage(craig);
  } else if (form === "dns") {
    return DnsPage(craig);
  } else if (form === "eventStreams") {
    return EventStreamsPage(craig);
  } else if (form === "f5") {
    return F5BigIp(craig);
  } else if (form === "iamAccountSettings") {
    return IamAccountSettings(craig);
  } else if (form === "keyManagement") {
    return KeyManagementPage(craig);
  } else if (form === "lb") {
    return LoadBalancerPage(craig);
  } else if (form === "nacls") {
    return NetworkAclPage(craig);
  } else if (form === "objectStorage") {
    return ObjectStoragePage(craig);
  } else if (form === "power") {
    return PowerInfraPage(craig);
  } else if (form === "powerInstances") {
    return PowerVsInstances(craig);
  } else if (form === "powerVolumes") {
    return PowerVsVolumes(craig);
  } else if (form === "resourceGroups") {
    return ResourceGroupPage(craig);
  } else if (form === "securityComplianceCenter") {
    return SccV1(craig);
  } else if (form === "secretsManager") {
    return SecretsManagerPage(craig);
  } else if (form === "routingTables") {
    return RoutingTablesPage(craig);
  } else if (form === "securityGroups") {
    return SecurityGroupPage(craig);
  } else if (form === "sshKeys") {
    return SshKeysPage(craig);
  } else if (form === "subnets") {
    return SubnetsPage(craig);
  } else if (form === "transitGateways") {
    return TransitGatewayPage(craig);
  } else if (form === "vpcs") {
    return VpcPage(craig);
  } else if (form === "vpe") {
    return VpePage(craig);
  } else if (form === "vpn") {
    return VpnGatewayPage(craig);
  } else if (form === "vpnServers") {
    return VpnServerPage(craig);
  } else if (form === "vsi") {
    return VsiPage(craig);
  }
};
