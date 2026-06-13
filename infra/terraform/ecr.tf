# ============ ECR REPOSITORIES ============
resource "aws_ecr_repository" "backend_ventas" {
  name = "innovatech-backend-ventas"
  image_scanning_configuration {
    scan_on_push = true
  }
  force_delete = true
  tags = {
    Name = "backend-ventas"
  }
}

resource "aws_ecr_repository" "backend_despacho" {
  name = "innovatech-backend-despacho"
  image_scanning_configuration {
    scan_on_push = true
  }
  force_delete = true
  tags = {
    Name = "backend-despacho"
  }
}

resource "aws_ecr_repository" "frontend" {
  name = "innovatech-frontend"
  image_scanning_configuration {
    scan_on_push = true
  }
  force_delete = true
  tags = {
    Name = "frontend"
  }
}

