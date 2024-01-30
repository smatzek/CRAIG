##############################################################################
# Variables
##############################################################################

variable "ibmcloud_api_key" {
  description = "The IBM Cloud platform API key needed to deploy IAM enabled resources."
  type        = string
  sensitive   = true
}
variable "prefix" {
  description = "The name prefix for the IBM Power Virtual Server Workspaces."
  type        = string
  default     = "craig"
}

variable "resource_group" {
  description = "The name of the resource group for the IBM Power Virtual Server Workspaces."
  type        = string
  default     = "craig-rg"
}

variable "use_existing_rg" {
  description = "Determines whether the resource group will be created (value=false) or and existing resource group will be used (value=true)."
  type        = bool
  default     = false
}

variable "region" {
  description = "IBM Cloud Region for the IBM Terraform Provider "
  type        = string
  default     = "us-south"
  validation {
    error_message = "Region must be in a supported IBM VPC region."
    condition     = contains(["us-south", "us-east", "br-sao", "ca-tor", "eu-gb", "eu-de", "eu-es", "jp-tok", "jp-osa", "au-syd"], var.region)
  }
}

##############################################################################
