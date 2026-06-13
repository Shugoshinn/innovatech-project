variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR block para VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "cluster_name" {
  description = "Nombre del clúster EKS"
  type        = string
  default     = "innovatech-cluster"
}

variable "desired_size" {
  description = "Número deseado de nodos"
  type        = number
  default     = 2
}

variable "max_size" {
  description = "Número máximo de nodos"
  type        = number
  default     = 5
}

variable "min_size" {
  description = "Número mínimo de nodos"
  type        = number
  default     = 1
}

variable "instance_types" {
  description = "Tipos de instancia para nodos"
  type        = list(string)
  default     = ["t3.medium"]
}

