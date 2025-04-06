# Event Ticket Booking System

Includes API Server utilities:

## Dependencies

- MySQl
- Sequelize

## Backend

    
    - Language : Nodejs (Xpress framework)

## Database

    kind: MySQL
    db-name : event-ticket-booking-service

## Setup

```
Clone repository from Github
```
Create .env  copy from .env.example
```
 npm install : To install the dependencies
```

## Lint

```
npm run lint
```


## Test

```
npm run test
```

## Development

```
npm run dev
```

 
 
## Architecture & Design Choice

1. Modular MVC Structure
Controllers: Manage HTTP requests and delegate business logic to service layers, ensuring clarity and separation of concerns.

Services: Contain the core business logic, keeping controllers lightweight and maintainable.

Models: Sequelize models define the database schema and entity relationships.

Middleware: Handles cross-cutting concerns such as authentication, logging, and request preprocessing.

2. Database Schema Design
Event: Captures key details such as ticket availability, title, status, and pricing.

Booking: Links users to events, tracking booking status and associated payments.

WaitingList: Manages user queues when events are sold out, promoting fairness and transparency.

User: Stores user profiles and authentication-related information.

3. Concurrency-Safe Booking
Booking and cancellation logic are designed to prevent race conditions.

Database transactions and row-level locking are employed to ensure thread-safe operations and data integrity during concurrent access.

4. Authentication & Security
JWT-based authentication ensures only verified users can access protected actions (e.g., booking, cancellation).

Authentication middleware guards sensitive routes.

Input is validated using Sequelize and reinforced with defensive programming in the service layer.

5. Logging & Monitoring
Winston is used for structured logging of API activity and error reporting, outputting to both files and the console.

Easily extensible to external monitoring tools such as Loggly, Sentry, or Datadog for production environments.

6. Testing Strategy
Unit tests validate core service logic and edge cases.

Integration tests ensure the full workflow is functional, including scenarios like creating events, updating status, booking, and cancellation.

Jest and Supertest provide comprehensive coverage for both services and endpoints.

7. RESTful API Design
Follows a clean, resource-oriented structure:
/create-user, /login, /initialize, /book, /cancel, /status/:eventId

Employs semantic HTTP methods and standardized status codes (e.g., 200 OK, 201 Created, 400 Bad Request).

8. Scalability & Maintainability
The codebase follows a modular architecture with clear separation of concerns.

Designed for easy scaling and adaptability, ensuring long-term maintainability and ease of collaboration.

## API Documentation

For detailed API documentation and testing, refer to the [Postman Collection](https://documenter.getpostman.com/view/19119257/2sB2cUC3e3).
