Here's a system desgin of the project 

![download](https://github.com/user-attachments/assets/25ffb74f-374b-4dd4-85a0-fedb6de78d98)

#  Auto Deployment System

This project provides a seamless CI/CD pipeline for deploying user-selected GitHub repositories onto AWS infrastructure. It utilizes WebSockets, Redis, Docker, and AWS EC2 instances to deliver a real-time, scalable deployment experience.

---

##  System Overview

The system enables users to deploy their GitHub repositories with minimal configuration. The process involves:

1. **User Input**:
   - Repository URL
   - Port number
   - Build commands
   - Output directory
   - Required libraries
   - `projectId` for real-time tracking

2. **Real-Time Communication**:
   - Users are connected via a WebSocket server.
   - Upon connection, the user subscribes to updates related to their specific `projectId`.

3. **Deployment Trigger**:
   - When the user clicks **Deploy**, all inputs along with the `projectId` are pushed into a Redis queue.

4. **Worker Node**:
   - A Node.js worker listens to the Redis queue.
   - Upon receiving a job:
     - It launches a new EC2 instance using AWS Auto Scaling Groups.
     - Retrieves the instance's IP address.
     - Publishes this info to the corresponding `projectId` WebSocket channel.

5. **Server-Side Automation**:
   - The WebSocket server:
     - SSHs into the new EC2 instance.
     - Clones the provided GitHub repository.
     - Dynamically generates:
       - `Dockerfile` (with environment variables, build commands, etc.)
       - `nginx` reverse proxy configuration.
     - Builds a Docker image.
     - Runs the container, mapping the user-defined port.

6. **Live Deployment Logs**:
   - All logs generated during the deployment process are streamed in real-time to the user's WebSocket connection.
