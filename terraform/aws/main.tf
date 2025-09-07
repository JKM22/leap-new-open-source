terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "leap-terraform-state"
    key    = "leap-new-open-source/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC and Networking
resource "aws_vpc" "leap_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "leap-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "leap_subnet_private" {
  count             = 2
  vpc_id            = aws_vpc.leap_vpc.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "leap-private-subnet-${count.index + 1}"
    Environment = var.environment
  }
}

resource "aws_subnet" "leap_subnet_public" {
  count                   = 2
  vpc_id                  = aws_vpc.leap_vpc.id
  cidr_block              = "10.0.${count.index + 10}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "leap-public-subnet-${count.index + 1}"
    Environment = var.environment
  }
}

# Internet Gateway
resource "aws_internet_gateway" "leap_igw" {
  vpc_id = aws_vpc.leap_vpc.id

  tags = {
    Name = "leap-igw"
    Environment = var.environment
  }
}

# RDS PostgreSQL Database
resource "aws_db_subnet_group" "leap_db_subnet_group" {
  name       = "leap-db-subnet-group"
  subnet_ids = aws_subnet.leap_subnet_private[*].id

  tags = {
    Name = "leap-db-subnet-group"
    Environment = var.environment
  }
}

resource "aws_security_group" "leap_db_sg" {
  name        = "leap-db-security-group"
  description = "Security group for Leap RDS database"
  vpc_id      = aws_vpc.leap_vpc.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.leap_vpc.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "leap-db-sg"
    Environment = var.environment
  }
}

resource "aws_db_instance" "leap_postgres" {
  identifier             = "leap-postgres-${var.environment}"
  engine                 = "postgres"
  engine_version         = "15.4"
  instance_class         = var.db_instance_class
  allocated_storage      = var.db_allocated_storage
  storage_encrypted      = true
  
  db_name  = "leap"
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.leap_db_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.leap_db_subnet_group.name
  
  backup_retention_period = var.environment == "production" ? 7 : 1
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = var.environment != "production"
  deletion_protection = var.environment == "production"

  tags = {
    Name = "leap-postgres"
    Environment = var.environment
  }
}

# ElastiCache Redis for Caching
resource "aws_elasticache_subnet_group" "leap_cache_subnet_group" {
  name       = "leap-cache-subnet-group"
  subnet_ids = aws_subnet.leap_subnet_private[*].id
}

resource "aws_security_group" "leap_cache_sg" {
  name        = "leap-cache-security-group"
  description = "Security group for Leap Redis cache"
  vpc_id      = aws_vpc.leap_vpc.id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.leap_vpc.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "leap-cache-sg"
    Environment = var.environment
  }
}

resource "aws_elasticache_replication_group" "leap_redis" {
  replication_group_id       = "leap-redis-${var.environment}"
  description                = "Redis cluster for Leap application"
  
  port                       = 6379
  parameter_group_name       = "default.redis7"
  node_type                  = var.cache_node_type
  num_cache_clusters         = 1
  
  subnet_group_name          = aws_elasticache_subnet_group.leap_cache_subnet_group.name
  security_group_ids         = [aws_security_group.leap_cache_sg.id]
  
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true

  tags = {
    Name = "leap-redis"
    Environment = var.environment
  }
}

# Application Load Balancer
resource "aws_security_group" "leap_alb_sg" {
  name        = "leap-alb-security-group"
  description = "Security group for Leap ALB"
  vpc_id      = aws_vpc.leap_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "leap-alb-sg"
    Environment = var.environment
  }
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

# Outputs
output "database_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.leap_postgres.endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "Redis cluster endpoint"
  value       = aws_elasticache_replication_group.leap_redis.primary_endpoint_address
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.leap_vpc.id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.leap_subnet_private[*].id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.leap_subnet_public[*].id
}
