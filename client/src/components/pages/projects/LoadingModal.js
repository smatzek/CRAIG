import React from "react";
import {
  Loading,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@carbon/react";
import { CheckmarkOutline, CloseOutline } from "@carbon/icons-react";
import PropTypes from "prop-types";
import { distinct, eachKey, keys, splat, titleCase } from "lazy-z";

export const LoadingModal = (props) => {
  return (
    <Modal
      preventCloseOnClickOutside
      className={props.className}
      open={props.open}
      passiveModal={!props.completed}
      modalHeading={
        props.action === "upload"
          ? props.completed === false
            ? `Upload to Schematics Workspace: ${props.workspace}`
            : "Upload " + (props.failed === true ? "Failed!" : "Completed!")
          : props.completed === false
          ? `Create Schematics Workspace: ${props.workspace}`
          : "Create " + (props.failed === true ? "Failed!" : "Completed!")
      }
      // complete
      onRequestSubmit={() => {
        if (props.failed === true) {
          if (props.action === "create") {
            // for fake state for onProjectSave when action is "create"
            let fakeState = {
              name: props.project,
              description: props.projects[props.project].description,
              json: props.projects[props.project].json,
              last_save: props.projects[props.project].last_save,
              template: props.projects[props.project].template,
              use_schematics: true,
              use_template: props.projects[props.project].use_template,
              workspace_name: props.workspace,
            };

            let fakeProps = { data: { ...fakeState } };
            props.retryCallback(fakeState, fakeProps);
          } else props.retryCallback();
        } else {
          // didn't fail so only need onRequestSubmit for upload
          props.action === "upload"
            ? window.open(props.workspace_url + "/jobs", "_blank")
            : window.open(props.workspace_url, "_blank");
        }
      }}
      onSecondarySubmit={props.toggleModal}
      primaryButtonText={
        props.failed === true ? "Retry" : "Launch Workspace in New Tab"
      }
      secondaryButtonText={props.failed === true ? "Cancel" : "Close"}
      onRequestClose={props.toggleModal}
    >
      {props.completed === false ? (
        <>
          <div className="loadingWheel flexDirectionColumn marginBottomSmall">
            <Loading active={true} withOverlay={false} />
          </div>
          <div className="warningText yellowText marginBottomSmall">
            Warning: Do not close or reload window.
          </div>
        </>
      ) : (
        <>
          {props.failed === true ? (
            <>
              {/* when complete but failed show X */}
              <div className="loadingWheel flexDirectionColumn">
                <CloseOutline color="red" size="100" />
              </div>
              <div className="warningText marginBottomSmall">
                Oh, no! An error occurred.
              </div>
            </>
          ) : (
            <>
              {/* when complete but worked show check */}
              <div className="loadingWheel flexDirectionColumn">
                <CheckmarkOutline color="green" size="100" />
              </div>
            </>
          )}
        </>
      )}
    </Modal>
  );
};

LoadingModal.defaultProps = {
  action: "upload",
};

LoadingModal.propTypes = {
  action: PropTypes.string.isRequired,
  project: PropTypes.string,
  workspace: PropTypes.string,
  open: PropTypes.bool,
  completed: PropTypes.bool,
  workspace_url: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired,
  failed: PropTypes.bool,
  retryCallback: PropTypes.func.isRequired,
};

export const ValidationModal = (props) => {
  let hasInvalidItems = false;
  if (props.invalidItems) {
    eachKey(props.invalidItems, (item) => {
      if (props.invalidItems[item].length > 0) {
        hasInvalidItems = true;
      }
    });
  }

  return (
    <Modal
      open
      preventCloseOnClickOutside
      passiveModal={hasInvalidItems === false}
      modalHeading={
        hasInvalidItems === false
          ? "Validating Configuration..."
          : "Invalid Items"
      }
      danger={hasInvalidItems}
      primaryButtonText="Remove invalid references (Recommended)"
      secondaryButtonText="Do not update"
      onRequestClose={() => props.afterValidation({})}
      onRequestSubmit={() => {
        props.removeInvalidReferences();
      }}
    >
      {Object.keys(props.invalidItems).length === 0 ? (
        <>
          <div className="loadingWheel flexDirectionColumn marginBottomSmall">
            <Loading active={true} withOverlay={false} />
          </div>
          <div className="warningText yellowText marginBottomSmall">
            Warning: Do not close or reload window.
          </div>
        </>
      ) : (
        <>
          <div>
            <h3>
              The following items have out of date references.{" "}
              <b style={{ fontWeight: "bold" }}>
                New resources cannot be provisioned with these settings.
              </b>
            </h3>
            <div className="marginBottomSmall" />
            {keys(props.invalidItems).map((item) => {
              return props.invalidItems[item].length === 0 ? (
                ""
              ) : item === "power_images" ? (
                <div key={item}>
                  <h3 className="marginBottomSmall">Power Workspace Images</h3>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Workspace</TableHeader>
                        <TableHeader>Zone</TableHeader>
                        <TableHeader>Image Name</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.invalidItems.power_images
                        .sort((a, b) => {
                          if (a.name < b.name) {
                            return -1;
                          } else if (a.name > b.name) {
                            return 1;
                          }
                        })
                        .map((image) => (
                          <TableRow key={image.workspace + image.image}>
                            <TableCell>{image.workspace}</TableCell>
                            <TableCell>{image.zone}</TableCell>
                            <TableCell>{image.image}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div key={item}>
                  <h3 className="marginBottomSmall">
                    {titleCase(item).replace(/Vsi/, "VSI")}
                  </h3>
                  <Table className="marginBottomSmall">
                    <TableHead>
                      <TableRow>
                        <TableHeader>
                          {item === "vsi" ? "VSI" : "Cluster"} Deployment
                        </TableHeader>
                        <TableHeader>
                          {item === "vsi" ? "Image" : "Kubernetes Version"}
                        </TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.invalidItems[item].map((resource) => (
                        <TableRow key={JSON.stringify(resource)}>
                          <TableCell>
                            {item === "vsi" ? resource.vsi : resource.cluster}
                          </TableCell>
                          <TableCell>
                            {item === "vsi"
                              ? resource.image.replace(/\[.+/g, "")
                              : resource.kube_version}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Modal>
  );
};
