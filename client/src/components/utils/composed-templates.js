import MixedPattern from "../../images/mixed.png";
import VsiPattern from "../../images/VsiPattern.png";
import VsiEdgePattern from "../../images/VsiEdgePattern.png";
import PowerSAP_HanaPattern from "../../images/PowerSAP_HanaPattern.png";
import OracleRac from "../../images/oracle-rac.png";
import Empty from "../../images/empty.png";
import PowerVsQuickStart from "../../images/quick-start-power.png";
import OracleSI from "../../images/oracle-si.png";
import Vpnaas from "../../images/vpnaas.png";
import PowerVsPoc from "../../images/power-poc.png";
import { keys } from "lazy-z";
const { template_dropdown_map } = require("../../lib/constants");

const templateImages = {
  Mixed: MixedPattern,
  VSI: VsiPattern,
  "VSI Edge": VsiEdgePattern,
  "Power VS SAP Hana": PowerSAP_HanaPattern,
  "Power VS Oracle Ready": OracleRac,
  "Empty Project": Empty,
  "Power VS Quick Start": PowerVsQuickStart,
  "Power VS Oracle Single Instance": OracleSI,
  "VPN as a Service": Vpnaas,
  "Power VS POC": PowerVsPoc,
};

keys(template_dropdown_map).forEach((template) => {
  template_dropdown_map[template].image = templateImages[template];
});

export { template_dropdown_map as templates };
