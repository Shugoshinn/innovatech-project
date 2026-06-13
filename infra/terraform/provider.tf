terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~>5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Usar el LabRole proporcionado por AWS Academy
data "aws_iam_role" "labrole" {
  name = "LabRole"
}
