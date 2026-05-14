resource "aws_ecs_task_definition" "app" {
    family = "${var.project_name}-app"
    network_mode = "awsvpc"
    requires_compatibilities = ["FARGATE"]
    cpu = "1024"
    memory = "2048"
    execution_role_arn = data.aws_iam_role.lab.arn

    container_definitions = jsonencode([
        
        {
            name = "backend"
            image = "${aws_ecr_repository.backend.repository_url}:latest"

            portMappings = [
                {
                    containerPort = 8080
                }
            ]
            healthCheck = {
                command = ["CMD-SHELL", "curl -f http://localhost:8080/actuator/health/readiness || exit 1"]
                interval = 30
                timeout = 5
                retries = 3
                startPeriod = 120
            }

            environment = [
                {
                    name = "DB_HOST"
                    value = aws_instance.db.private_ip
                },
                {
                    name = "SPRING_DATASOURCE_URL"
                    value = "jdbc:mysql://${aws_instance.db.private_ip}:3306/innovatech_db"
                },
                {
                    name = "SPRING_DATASOURCE_USERNAME"
                    value = "root"
                },
                {
                    name = "SPRING_DATASOURCE_PASSWORD"
                    value = "root"
                }
            ]
            logConfiguration = {
                logDriver = "awslogs",
                options = {
                    awslogs-group = aws_cloudwatch_log_group.ecs.name,
                    awslogs-region = var.aws_region,
                    awslogs-stream-prefix = "backend"
                }
            }
        },

        {
            name = "frontend"
            image = "${aws_ecr_repository.frontend.repository_url}:latest"

            portMappings = [
                {
                    containerPort = 80
                }
            ]

            logConfiguration = {
                logDriver = "awslogs"
                options = {
                    awslogs-group = aws_cloudwatch_log_group.ecs.name,
                    awslogs-region = var.aws_region,
                    awslogs-stream-prefix = "frontend"
                }
            }
        }
        
    ])
}