# ============ EKS CLUSTER ============
resource "aws_eks_cluster" "eks" {
  name     = var.cluster_name
  role_arn = data.aws_iam_role.labrole.arn
  version  = "1.28"

  vpc_config {
    subnet_ids              = [aws_subnet.eks_subnet_1.id, aws_subnet.eks_subnet_2.id]
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  tags = {
    Name = var.cluster_name
  }
}

# ============ EKS NODE GROUP ============
resource "aws_eks_node_group" "workers" {
  cluster_name    = aws_eks_cluster.eks.name
  node_group_name = "${var.cluster_name}-workers"
  node_role_arn   = data.aws_iam_role.labrole.arn
  subnet_ids      = [aws_subnet.eks_subnet_1.id, aws_subnet.eks_subnet_2.id]

  scaling_config {
    desired_size = var.desired_size
    max_size     = var.max_size
    min_size     = var.min_size
  }

  instance_types = var.instance_types
  capacity_type  = "ON_DEMAND"

  tags = {
    Name = "${var.cluster_name}-workers"
  }
}
