const region = process.env.REGION || "us-south";

const apiCalls = {
  getBearerToken: {
    method: "post",
    url: `https://iam.cloud.ibm.com/identity/token?grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${process.env.SLZ_GUI_API_KEY}`,
    headers: {
      Accept: "application/json",
    },
  },
  clusterFlavors: {
    method: "get",
    url: `http://containers.cloud.ibm.com/global/v2/getFlavors?zone=${region}-1&provider=vpc-gen2`,
    headers: {
      Accept: "application/json",
    },
  },
  clusterVersions: {
    method: "get",
    url: "http://containers.cloud.ibm.com/global/v1/versions",
    headers: {
      Accept: "application/json",
    },
  },
  vsiImages: {
    method: "get",
    url: `http://${region}.iaas.cloud.ibm.com/v1/images?version=2022-11-15&generation=2`,
    headers: {
      "Accept-Encoding": "application/json",
    },
  },
  vsiInstanceProfiles: {
    method: "get",
    url: `http://${region}.iaas.cloud.ibm.com/v1/instance/profiles?version=2022-11-15&generation=2`,
    headers: {
      "Accept-Encoding": "application/json",
    },
  },
};

/**
 * controller constructor
 * @param {*} axios initialized axios package
 */
function controller(axios) {
  this.token = null; // access token
  this.expiration = null; // token expiration
  this.versions = []; // list of kube versions
  this.flavors = []; // list of kube flavors
  this.instanceProfiles = []; // list of vsi instance profiles
  this.images = []; // list of vsi images

  /**
   * check if a token is expired
   * @returns {boolean} true if expired
   */
  this.tokenIsExpired = () => {
    return !this.expiration || !this.token
      ? true
      : this.expiration <= Math.floor(Date.now() / 1000);
  };

  /**
   * send data from constructor when a valid token and data are found
   * by using this we can cut down on the number of needed api calls by
   * storing the data locally for a small period of time
   * @param {*} res express resolve object
   * @param {string} field name of local data store
   * @param {Promise} callback promise to return
   * @returns {Promise} promise to return data
   */
  this.sendDataOnTokenValid = (res, field, callback) => {
    if (this.tokenIsExpired() === false && this[field].length > 0) {
      return this.passThroughPromise(res, this[field]);
    } else {
      return callback();
    }
  };

  /**
   * pass through promise function to resolve when no api call needed
   * @param {*} res express resolve
   * @param {*} value arbitrary value
   * @returns {Promise}
   */
  this.passThroughPromise = (res, value) => {
    return new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
      res.send(value);
    });
  };

  /**
   * get authorization token to use ibmcloud api
   * @return {string} returns an access token
   */
  this.getBearerToken = () => {
    return new Promise((resolve, reject) => {
      if (this.tokenIsExpired()) {
        // send request to IBM Cloud IAM endpoint to get access token if no token present or if expired
        axios(apiCalls.getBearerToken)
          .then((response) => {
            this.token = response.data.access_token;
            this.expiration = response.data.expiration;
            resolve(response.data.access_token);
          })
          .catch((error) => {
            this.expiration = undefined;
            reject(error);
          });
      } else {
        // token present and not expired
        resolve(this.token);
      }
    });
  };

  /**
   * get a list of instance profiles for vsi within a region
   * @param {object} req express request object
   * @param {object} res express resolve object
   */

  this.vsiInstanceProfiles = (req, res) => {
    // inherit context with anonymous function
    return this.sendDataOnTokenValid(res, "instanceProfiles", () => {
      return this.getBearerToken()
        .then(() => {
          let requestConfig = apiCalls.vsiInstanceProfiles;
          requestConfig.headers.Authorization = `Bearer ${this.token}`;
          return axios(requestConfig);
        })
        .then((response) => {
          // iterate through the response object and collect the instance profile names
          let instanceProfiles = [];
          response.data.profiles.forEach((element) => {
            instanceProfiles.push(element.name);
          });
          this.instanceProfiles = instanceProfiles;
          res.send(instanceProfiles);
        })
        .catch((error) => {
          res.send(error.response);
        });
    });
  };

  /**
   * get a list of images for vsi in a region
   * @param {object} req express request object
   * @param {object} res express resolve object
   */
  this.vsiImages = (req, res) => {
    // inherit context with anonymous function
    return this.sendDataOnTokenValid(res, "images", () => {
      // get token and use to get vsi images
      return this.getBearerToken()
        .then(() => {
          let requestConfig = apiCalls.vsiImages;
          requestConfig.headers.Authorization = `Bearer ${this.token}`;
          return axios(requestConfig);
        })
        .then((response) => {
          // iterate through the response object and collect image names
          let images = [];
          response.data.images.forEach((element) => {
            images.push({
              display_name:
                element.operating_system.display_name + ` (${element.name})`,
              name: element.name,
            });
          });
          this.images = images;
          res.send(images);
        })
        .catch((error) => {
          res.send(error.data);
        });
    });
  };

  /**
   * get a list of cluster flavors for a region
   * @param {object} req express request object
   * @param {object} res express resolve object
   */
  this.clusterFlavors = (req, res) => {
    // inherit context with anonymous function
    return this.sendDataOnTokenValid(res, "flavors", () => {
      return axios(apiCalls.clusterFlavors)
        .then((response) => {
          // inherit context with anonymous function
          // iterate through response object and collect cluster flavors
          let flavors = [];
          response.data.forEach((element) => {
            flavors.push(element.name);
          });
          this.flavors = flavors;
          res.send(flavors);
        })
        .catch((error) => {
          res.send(error.response);
        });
    });
  };

  /**
   * clusterVersions
   * @param {object} req express request object
   * @param {object} res express resolve object
   */
  this.clusterVersions = (req, res) => {
    return this.sendDataOnTokenValid(res, "versions", () => {
      // send request
      return axios(apiCalls.clusterVersions)
        .then((response) => {
          // use anonymous function here to inherit constructor context
          let versions = [];
          /**
           * add element to versions
           * @param {object} element
           * @param {boolean=} openshift true if openshift
           */
          function addElementToVersions(element, openshift) {
            versions[element.default ? "unshift" : "push"](
              // add to front if default
              `${element.major}.${element.minor}.${element.patch}${
                openshift ? "_openshift" : "_kubernetes" // add type
              }${element.default ? " (Default)" : ""}`
            );
          }

          // collect kube versions
          response.data.kubernetes.forEach((element) => {
            addElementToVersions(element);
          });

          // collect openshift versions
          response.data.openshift.forEach((element) => {
            addElementToVersions(element, true);
          });

          this.versions = versions;
          res.send(versions);
        })
        .catch((error) => {
          res.send(error.response);
        });
    });
  };
}

module.exports = controller;