# Clinic Management Web Application

## Overview

This project is a **Clinic Management Web Application** built with **Angular** (frontend) and **Java Spring** (backend). The app facilitates easy management of appointments for patients, doctors, and administrators, with role-based functionalities and access control. **Spring Security** is used for authentication and authorization to ensure that only authorized users can perform specific actions based on their roles (Patient, Doctor, Admin).

## Features

### General Features
- **Login**: Authentication using **Spring Security** for three types of users: **Patient**, **Doctor**, and **Admin**.
- **Role-based access control**:
  - **Patient**: Can create, delete, and view their own appointments.
  - **Doctor**: Can add, delete, and view their own appointments and prescriptions to those appointments.
  - **Admin**: Can create appointments for any doctor or patient, view and manage all appointments, and add new accounts for both doctors and patients.

### Patient Features
- **View Appointments**: View a list of their own appointments with filtering and sorting capabilities.
- **Manage Appointments**: Can create and delete their own appointments.

### Doctor Features
- **View Appointments**: View all appointments assigned to them, with filtering and sorting options.
- **Manage Appointments**: Can create and delete appointments for themselves.

### Admin Features
- **View All Appointments**: Can view, filter, and sort all appointments for all users.
- **Manage Appointments**: Can add and delete appointments for any doctor or patient.
- **Manage Users**: Can add new or delete doctor and patient accounts.

### Running the Application Locally

### Prerequisites
To run the project, you'll need:
- **Node.js** and **Angular CLI** installed for frontend development.
- **Java** and **Maven** installed for backend development.
- **PostgreSQL** is used by default.

#### Backend (Java Spring)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build and run the backend service using Maven:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
3. The backend service will run at `http://localhost:8080`.

#### Frontend (Angular)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Angular application:
   ```bash
   ng serve
   ```
4. The frontend will run at `http://localhost:4200`.

## Role-Based Access Control

The app uses **Spring Security** to provide authentication and authorization. The application distinguishes between three roles: **Patient**, **Doctor**, and **Admin**, and provides different capabilities based on the logged-in user's role.

- **Patient**: Limited to managing their own appointments.
- **Doctor**: Can manage their own appointments and add prescriptions to existing appointments.
- **Admin**: Has full control over all appointments and can manage user accounts.
