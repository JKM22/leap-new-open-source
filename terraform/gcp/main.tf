terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
  
  backend "gcs" {
    bucket = "leap-terraform-state-gcp"
    prefix = "leap-new-open-source"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# VPC Network
resource "google_compute_network" "leap_vpc" {
  name                    = "leap-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "leap_subnet" {
  name          = "leap-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.leap_vpc.id
}

# Cloud SQL PostgreSQL
resource "google_sql_database_instance" "leap_postgres" {
  name             = "leap-postgres-${var.environment}"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = var.db_tier
    
    disk_size    = var.db_disk_size
    disk_type    = "PD_SSD"
    disk_autoresize = true
    
    backup_configuration {
      enabled = true
      start_time = "03:00"
      location = var.region
    }
    
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.leap_vpc.id
      require_ssl     = true
    }
    
    database_flags {
      name  = "log_statement"
      value = "all"
    }
  }

  deletion_protection = var.environment == "production"
}

resource "google_sql_database" "leap_db" {
  name     = "leap"
  instance = google_sql_database_instance.leap_postgres.name
}

resource "google_sql_user" "leap_user" {
  name     = var.db_username
  instance = google_sql_database_instance.leap_postgres.name
  password = var.db_password
}

# Memorystore Redis
resource "google_redis_instance" "leap_redis" {
  name           = "leap-redis-${var.environment}"
  tier           = "BASIC"
  memory_size_gb = var.redis_memory_size
  region         = var.region
  
  authorized_network = google_compute_network.leap_vpc.id
  
  redis_version = "REDIS_6_X"
  display_name  = "Leap Redis Cache"
}

# Pub/Sub Topics for Event Bus
resource "google_pubsub_topic" "notes_events" {
  name = "notes-events"
}

resource "google_pubsub_topic" "codegen_events" {
  name = "codegen-events"
}

resource "google_pubsub_subscription" "notes_events_sub" {
  name  = "notes-events-subscription"
  topic = google_pubsub_topic.notes_events.name

  ack_deadline_seconds = 20

  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "600s"
  }
}

# Cloud Storage for file uploads
resource "google_storage_bucket" "leap_storage" {
  name     = "leap-storage-${var.project_id}-${var.environment}"
  location = var.region

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type = "Delete"
    }
  }
}

# IAM for Cloud Run service
resource "google_service_account" "leap_service_account" {
  account_id   = "leap-service-account"
  display_name = "Leap Service Account"
  description  = "Service account for Leap application"
}

resource "google_project_iam_member" "leap_cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.leap_service_account.email}"
}

resource "google_project_iam_member" "leap_pubsub_editor" {
  project = var.project_id
  role    = "roles/pubsub.editor"
  member  = "serviceAccount:${google_service_account.leap_service_account.email}"
}

resource "google_project_iam_member" "leap_storage_admin" {
  project = var.project_id
  role    = "roles/storage.admin"
  member  = "serviceAccount:${google_service_account.leap_service_account.email}"
}

# Outputs
output "database_connection_name" {
  description = "Cloud SQL connection name"
  value       = google_sql_database_instance.leap_postgres.connection_name
  sensitive   = true
}

output "database_private_ip" {
  description = "Cloud SQL private IP"
  value       = google_sql_database_instance.leap_postgres.private_ip_address
  sensitive   = true
}

output "redis_host" {
  description = "Redis instance host"
  value       = google_redis_instance.leap_redis.host
}

output "storage_bucket_name" {
  description = "Cloud Storage bucket name"
  value       = google_storage_bucket.leap_storage.name
}

output "service_account_email" {
  description = "Service account email"
  value       = google_service_account.leap_service_account.email
}

output "pubsub_topics" {
  description = "Pub/Sub topic names"
  value = {
    notes_events   = google_pubsub_topic.notes_events.name
    codegen_events = google_pubsub_topic.codegen_events.name
  }
}
