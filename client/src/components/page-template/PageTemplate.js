import React from "react";
import {
  IbmCloudKeyProtect,
  ObjectStorage,
  VirtualPrivateCloud,
  SubnetAclRules,
  IbmCloudSubnets,
  IbmCloudTransitGateway,
  Security,
  IbmCloudVpcEndpoints,
  CloudAuditing,
  Password,
  BareMetalServer_02,
  IbmCloudKubernetesService,
  CloudApp,
  GatewayVpn,
  IdManagement,
  GroupAccess,
  GroupResource,
  IbmCloudSecretsManager,
  IbmCloudSecurityComplianceCenter,
  IbmCloudEventStreams,
  LoadBalancerVpc,
  Report,
  Router,
  Folders,
  ServerProxy,
  DnsServices,
  IbmCloudSysdigSecure,
  IbmDb2,
  IbmPowerVs,
  VirtualMachine,
  Help,
  Bullhorn,
  JsonReference,
  FileStorage,
  Settings,
  DocumentSigned,
  VlanIbm,
  FirewallClassic,
  IbmCloudInternetServices,
  Voicemail,
  IbmCloudSecurityComplianceCenterWorkloadProtection,
  LoadBalancerPool,
  AppConnectivity,
  ChartLine,
} from "@carbon/icons-react";
import f5 from "../../images/f5.png";
import {
  arraySplatIndex,
  contains,
  getObjectFromArray,
  isBoolean,
} from "lazy-z";
import { CraigCodeMirror, Navigation, Footer } from ".";
import PropTypes from "prop-types";
import "./page-template.css";
import { codeMirrorGetDisplay } from "../../lib";
import { Notification } from "./Notification";
import CBRIcon from "../../images/cbr";
import { ActionableNotification } from "@carbon/react";
import NoProjectModal from "./NoProjectModal";

function F5Icon() {
  return <img src={f5} />;
}

const releaseNotes = require("../../lib/docs/release-notes.json");
const navCategories = require("../../lib/nav-catagories");
const navIcons = {
  IbmCloudKeyProtect: IbmCloudKeyProtect,
  ObjectStorage: ObjectStorage,
  VirtualPrivateCloud: VirtualPrivateCloud,
  SubnetAclRules: SubnetAclRules,
  IbmCloudSubnets: IbmCloudSubnets,
  IbmCloudTransitGateway: IbmCloudTransitGateway,
  Security: Security,
  IbmCloudVpcEndpoints: IbmCloudVpcEndpoints,
  CloudAuditing: CloudAuditing,
  Password: Password,
  BareMetalServer_02: BareMetalServer_02,
  IbmCloudKubernetesService: IbmCloudKubernetesService,
  CloudApp: CloudApp,
  GatewayVpn: GatewayVpn,
  IdManagement: IdManagement,
  GroupAccess: GroupAccess,
  GroupResource: GroupResource,
  IbmCloudSecretsManager: IbmCloudSecretsManager,
  IbmCloudSecurityComplianceCenter: IbmCloudSecurityComplianceCenter,
  IbmCloudEventStreams: IbmCloudEventStreams,
  LoadBalancerVpc: LoadBalancerVpc,
  Report: Report,
  Router: Router,
  Folders: Folders,
  ServerProxy: ServerProxy,
  DnsServices: DnsServices,
  IbmCloudSysdigSecure: IbmCloudSysdigSecure,
  IbmDb2: IbmDb2,
  CBRIcon: CBRIcon,
  F5Icon: F5Icon,
  IbmPowerVs: IbmPowerVs,
  IbmPowerVsInstance: VirtualMachine,
  IbmPowerVsVolumes: FileStorage,
  IBMClassicSshKeys: DocumentSigned,
  VlanIbm: VlanIbm,
  FirewallClassic: FirewallClassic,
  IbmCloudInternetServices: IbmCloudInternetServices,
  Voicemail: Voicemail,
  IbmCloudSecurityComplianceCenterWorkloadProtection:
    IbmCloudSecurityComplianceCenterWorkloadProtection,
  LoadBalancerPool: LoadBalancerPool,
  AppConnectivity: AppConnectivity,
};

let pageOrder = [
  { title: "About", path: "/docs/about", icon: Help },
  { title: "Release Notes", path: "/docs/releaseNotes", icon: Bullhorn },
  {
    title: "JSON Documentation",
    path: "/docs/json",
    icon: JsonReference,
  },
  {
    title: "Projects",
    path: "/projects",
    icon: Folders,
  },
  {
    title: "Options",
    path: "/",
    icon: Settings,
  },
  {
    title: "Stats",
    path: "/stats",
    icon: ChartLine,
  },
].concat(
  contains(window.location.pathname, "/v2")
    ? [
        {
          // temporary to get page to render
          title: "Cloud Services",
          path: "/v2/services",
          icon: Settings,
        },
        {
          // temporary to get page to render
          title: "VPC Network",
          path: "/v2/vpc",
          icon: Settings,
        },
        {
          // temporary to get page to render
          title: "VPC Deployments",
          path: "/v2/vpcDeployments",
          icon: Settings,
        },
      ]
    : []
);

// for each nav category
navCategories.forEach((category) => {
  // for each link
  category.links.forEach((link) => {
    // add icon
    link.icon = navIcons[link.react_icon];
    // add the title and path to path order
    pageOrder.push(link);
  });
});

const PageTemplate = (props) => {
  let isResetState = window.location.pathname === "/resetState";
  /**
   * Footer navigation function
   * @param {boolean} isBackward goes back
   * @returns {{title: string, onClick:Function}} title for page, on click function to navigate to that page
   */
  function navigate(isBackward) {
    let currentPath = window.location.pathname;

    let nextPathIndex = isBackward // get next path based on direction
      ? arraySplatIndex(pageOrder, "path", currentPath) - 1
      : arraySplatIndex(pageOrder, "path", currentPath) + 1;

    /**
     * function to send user to next path
     */
    function onClick() {
      props.nav(pageOrder[nextPathIndex].path);
    }

    return isResetState
      ? {
          title: "Reset State",
        }
      : nextPathIndex === pageOrder.length || nextPathIndex === -1
      ? {
          // if next index is out of bounds of array, send empty string
          // and no onclick function
          title: "",
        }
      : getObjectFromArray(pageOrder, "path", `/form/${props.form}`)?.isLast
      ? {
          title: "Summary",
          onClick: () => {
            props.nav("/summary");
          },
        }
      : {
          title: pageOrder[nextPathIndex].title,
          onClick: onClick,
        };
  }

  /**
   * updates craig version to newest version in release notes
   */
  function updateCraig() {
    let options = { ...props.json._options };
    options.craig_version = releaseNotes[0].version;
    props.craig.options.save(options, { data: props.json._options });
  }

  let pageObj = props.form
    ? getObjectFromArray(pageOrder, "path", `/form/${props.form}`)
    : { toTf: false };

  // if path is undefined or "form" is not present in path then hide the code mirror
  let formPathNotPresent = props.beta
    ? false
    : pageObj.path === undefined
    ? true
    : !contains(pageObj.path, "form");

  return (
    <>
      <Navigation
        hideCodeMirror={props.hideCodeMirror}
        onJsonToggle={() => props.toggleHide("hideCodeMirror")}
        navCategories={navCategories}
        json={props.json}
        project={props.project}
        notify={props.notify}
        isResetState={isResetState}
        formPathNotPresent={formPathNotPresent}
        invalidForms={props.invalidForms}
      />
      {!isResetState && (
        <>
          {props.json._options.craig_version !== releaseNotes[0].version && (
            <ActionableNotification
              className="updateBanner"
              actionButtonLabel="Update With One Click"
              onActionButtonClick={updateCraig}
              inline={true}
              kind="warning-alt"
              lowContrast={true}
              subtitle="Some elements may not function correctly."
              title="CRAIG state version out of date."
              hideCloseButton={true}
            />
          )}
        </>
      )}
      <div className="minHeight displayFlex navBarAlign boxShadow fieldPadding">
        <div
          className={
            props.hideCodeMirror ||
            formPathNotPresent ||
            contains(window.location.pathname, "/v2/")
              ? "widthOneHundredPercent"
              : "leftPanelWidth"
          }
        >
          <ul className="notification-list">
            {props.notifications.map((notification, index) => (
              <li key={index}>
                <Notification
                  kind={notification.kind}
                  text={notification.text}
                  title={notification.title}
                  timeout={notification.timeout}
                />
              </li>
            ))}
          </ul>
          {!isResetState && (
            <>
              {window.location.pathname !== "/projects" &&
                !contains(window.location.pathname, "/docs/") &&
                !contains(window.location.pathname, "/v2/projects") &&
                !props.craig.store.project_name && (
                  <NoProjectModal
                    craig={props.craig}
                    onProjectSave={props.onProjectSave}
                  />
                )}
            </>
          )}
          {props.children}
        </div>
        <CraigCodeMirror
          hideCodeMirror={
            formPathNotPresent === true ||
            props.hideCodeMirror ||
            contains(window.location.pathname, "/v2")
          }
          code={codeMirrorGetDisplay(
            props.json,
            props.jsonInCodeMirror,
            props.beta ? "/v2/services" : pageObj.path,
            pageObj.toTf,
            pageObj.jsonField
          )}
          onTabClick={props.onTabClick}
          jsonInCodeMirror={props.jsonInCodeMirror}
        />
      </div>
      {isResetState !== true && !contains(window.location.pathname, "/v2") && (
        <Footer
          toggleFooter={() => {
            props.craig.store.json._options.hideFooter =
              !props.craig.store.json._options.hideFooter;
            props.saveAndSendNotification("updating footer", false, true);
          }}
          hideFooter={
            isBoolean(props.craig.store.json._options.hideFooter)
              ? props.craig.store.json._options.hideFooter
              : true
          }
          navigate={navigate}
        />
      )}
    </>
  );
};

PageTemplate.defaultProps = {
  hideFooter: false,
  hideCodeMirror: false,
  jsonInCodeMirror: false,
};

PageTemplate.propTypes = {
  code: PropTypes.string, // can be null or undefined
  hideCodeMirror: PropTypes.bool.isRequired,
  hideFooter: PropTypes.bool.isRequired,
  toggleHide: PropTypes.func,
  jsonInCodeMirror: PropTypes.bool.isRequired,
  invalidForms: PropTypes.arrayOf(PropTypes.string),
  craig: PropTypes.shape({}),
  onProjectSave: PropTypes.func,
  saveAndSendNotification: PropTypes.func,
};

export default PageTemplate;
