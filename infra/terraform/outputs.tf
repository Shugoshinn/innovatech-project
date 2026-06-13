# ============ OUTPUTS - CLUSTER ============
output "cluster_name" {
  description = "Nombre del clúster EKS"
  value       = aws_eks_cluster.eks.name
}

output "cluster_endpoint" {
  description = "Endpoint del clúster EKS"
  value       = aws_eks_cluster.eks.endpoint
}

output "cluster_security_group_id" {
  description = "Security group ID del clúster"
  value       = aws_security_group.eks_cluster_sg.id
}

output "nodes_security_group_id" {
  description = "Security group ID de los nodos"
  value       = aws_security_group.eks_nodes_sg.id
}

# ============ OUTPUTS - VPC ============
output "vpc_id" {
  description = "ID de la VPC"
  value       = aws_vpc.eks_vpc.id
}

output "subnet_ids" {
  description = "IDs de las subnets"
  value       = [aws_subnet.eks_subnet_1.id, aws_subnet.eks_subnet_2.id]
}

# ============ OUTPUTS - ECR ============
output "backend_ventas_ecr_url" {
  description = "URL del repositorio ECR backend-ventas"
  value       = aws_ecr_repository.backend_ventas.repository_url
}

output "backend_despacho_ecr_url" {
  description = "URL del repositorio ECR backend-despacho"
  value       = aws_ecr_repository.backend_despacho.repository_url
}

output "frontend_ecr_url" {
  description = "URL del repositorio ECR frontend"
  value       = aws_ecr_repository.frontend.repository_url
}
