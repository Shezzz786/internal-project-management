# Functional Requirement Document (FRD)

## Project Overview
Internal Project Management System designed to support real-time task updates across multiple users working on the same project.

## Core Features
1. **User Authentication & Authorization**: Secure login/signup using JWT.
2. **Project Management**: Users can create, read, update, and delete (CRUD) projects.
3. **Task Management**: Users can create, read, update, and delete tasks within a project.
4. **Real-Time Task Board**: A Kanban-style board where tasks can be moved between statuses (e.g., Todo, In Progress, Done).
5. **Instant Sync**: Task status changes are immediately broadcasted to all connected clients viewing the same project via WebSockets.

## User Roles & Permissions
* **Standard User**: 
    * Can register and login.
    * Can view all projects.
    * Can create tasks inside any project.
    * Can update the status of any task.
    * Can delete tasks.
*(Note: To keep the initial phase focused on real-time sync, all users have equal access. Strict RBAC can be added as a future scope).*

## Assumptions
* A user can access and modify any project (no strict project-level access control for simplicity).
* The application is used internally by a single organization.
* The maximum concurrent users per project will not exceed 100 in the initial release.
* A task has basic fields: Title, Description, and Status (Todo, In Progress, Done).

## Out-of-Scope Items
* Email verification and password reset functionality.
* Task assignment to specific users (can be added later).
* Comments and file attachments on tasks.
* Activity logs or audit trails.
* Advanced reporting and analytics.
