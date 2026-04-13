# Clinic CRM - Local Development Guide

This guide explains how to run the application on your local machine, specifically configured for the Git Worktree setup.

## 📂 Project Structure

- **Root Directory** (`/home/mamee13/Documents/apps/clinic-crm`): Contains the Backend code (branch: `feature-backend`).
- **Mobile App Directory** (`./mobile-app`): Contains the Flutter Frontend code (branch: `feature-app`).

## 🚀 Starting the Backend

1.  **Ensure Docker is running:**
    ```bash
    sudo systemctl start docker
    ```

2.  **Start the SQL Server Database:**
    ```bash
    # Check if container exists
    sudo docker ps -a --filter "name=sqlserver-clinic-crm"

    # If stopped, start it:
    sudo docker start sqlserver-clinic-crm
    ```

3.  **Run the .NET API:**
    ```bash
    cd /home/mamee13/Documents/apps/clinic-crm/Clinic-CRM
    dotnet run
    ```
    The API will be available at `http://localhost:5246` (or similar, check terminal output).

## 📱 Starting the Frontend (Flutter App)

1.  **Navigate to the Worktree:**
    ```bash
    cd /home/mamee13/Documents/apps/clinic-crm/mobile-app
    ```

2.  **Run the App:**
    ```bash
    flutter run
    ```
    *   Select your target device (emulator or connected device) when prompted.

## 🌿 Git Worktree Workflow

- **Backend Work:**
    - You are already in the `feature-backend` branch in the root folder.
    - Make changes, commit, and push as usual from the root.

- **Frontend Work:**
    - Go to `./mobile-app`.
    - You are in the `feature-app` branch here.
    - Make changes, commit, and push from inside this directory.

> **Note:** This file is ignored by git, so it won't be pushed to the repository. Keep it for your local reference.
