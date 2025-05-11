# CampusConnect - College Management Web Application

CampusConnect is a role-based college management web application built with HTML, CSS, JavaScript for the frontend and AWS Lambda (Node.js) for the backend. The application uses a serverless architecture deployed via Terraform and integrated with API Gateway and DynamoDB.

## Features

**Note:** The features listed below are currently at a **very basic stage of implementation**. All features require substantial further development and refinement.

### Admin
- Add new users (students/faculty)
- View all students
- Manage entry logs (visitors/events)
- Issue certificates
- Send campus-wide notifications

### Faculty
- Upload study materials (PDF/link)
- View student list
- Mark attendance
- Issue certificates

### Student
- View uploaded materials
- Submit feedback with rating
- Report lost items
- View found items

## Architecture
- Frontend: HTML, CSS, JavaScript with localStorage for session management
- Backend: AWS Lambda (Node.js) with API Gateway
- Database: DynamoDB
- Infrastructure: Terraform

## Current Status
This project is currently a **basic prototype** and requires **comprehensive improvements** across all areas. Backend functionalities are rudimentary and need significant development. The **frontend UI is in an exceptionally poor state, is largely non-functional, and is not considered good by any measure. It requires a complete overhaul, including a full redesign and substantial redevelopment from the ground up.**

## Setup and Deployment
1. Clone this repository
2. Navigate to the terraform directory
3. Run `terraform init` to initialize Terraform
4. Run `terraform apply` to deploy the infrastructure
5. Upload the frontend files to your web server or S3 bucket

## Directory Structure
- `/frontend`: Contains all HTML, CSS, and JavaScript files
- `/backend/lambda`: Contains all Lambda function code
- `/terraform`: Contains Terraform configuration files
