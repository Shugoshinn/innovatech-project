data "aws_ami" "amazon_linux" {
  most_recent = true
  owners     = ["amazon"]

  filter {
    name = "name"
    values = [ "al2023-ami-*-x86_64" ]
  }
}

resource "aws_instance" "db" {
  ami =data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"
  subnet_id = aws_subnet.public.id
  vpc_security_group_ids = [ aws_security_group.main.id ]
  key_name = var.key_pair_name
  
  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y docker

              systemctl start docker
              systemctl enable docker

              until docker info > /dev/null 2>&1; do
                echo "Esperando a docker :P"
                sleep 3
              done

              docker system prune -f

              docker run -d \}
              -name mysql \
              -e MYSQL_ROOT_PASSWORD=root \
              -e MYSQL_DATABASE=innovatech_db \
              -e MYSQL_ROOT_HOST=% \
              -p 3306:3306 \
              --log opt max-size=10m \
              --log-opt max-file=3 \
              mysql:8-oracle
               --bind-address=0.0.0.0\
               --perfomance_schema=OFF \
              EOF

  tags = {
    Name = "${var.project_name}-mysql"
  }
}

#Cloud watch
resource "aws_cloudwatch_log_group" "ecs" {
  name = "/ecs/${var.project_name}"
  retention_in_days = 7
}