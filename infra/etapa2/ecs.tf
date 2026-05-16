resource "aws_ecs_cluster" "name" {
    name = "${var.project_name}-cluster"
}

data "aws_iam_role" "lab" {
  name = "LabRole"
}