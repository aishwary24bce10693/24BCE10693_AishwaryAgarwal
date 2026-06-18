# College Academic Management System Backend

A beginner-friendly backend project for managing college academic data using Node.js, Express.js, MongoDB, and Mongoose.

This project is API-based only and has no frontend. All endpoints can be tested using Postman, Thunder Client, or curl.

## Features

- CRUD operations for Students, Staff, Books, and Departments
- Drop collection endpoints
- MongoDB relationships using Mongoose `ref`
- One-to-One relationship: Staff <-> HOD of Department
- One-to-Many relationships:
  - Department -> Students
  - Department -> Staff
- Many-to-Many relationship: Students <-> Books through a borrowing system
- Beginner-friendly folder structure
- Clean Express routes and controllers
- Environment variable setup using `.env`

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- cors
- morgan
- nodemon

## Folder Structure

```text
college-academic-management-system/
  config/
    db.js
  controllers/
    bookController.js
    departmentController.js
    staffController.js
    studentController.js
  models/
    Book.js
    Department.js
    Staff.js
    Student.js
  routes/
    bookRoutes.js
    departmentRoutes.js
    staffRoutes.js
    studentRoutes.js
  .env.example
  .gitignore
  package.json
  README.md
  server.js
```

## Installation

```bash
git clone YOUR_REPOSITORY_URL
cd college-academic-management-system
npm install
```

## Environment Variables

Create a `.env` file in the root folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/college_academic_management
NODE_ENV=development
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

## Run Project

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server runs at:

```text
http://localhost:5000
```

API base URL:

```text
http://localhost:5000/api
```

## API Endpoints

### Departments

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/departments` | Create department |
| GET | `/api/departments` | Get all departments |
| GET | `/api/departments/:id` | Get department by ID |
| PUT | `/api/departments/:id` | Update department |
| DELETE | `/api/departments/:id` | Delete department |
| DELETE | `/api/departments/drop` | Drop departments collection |
| PATCH | `/api/departments/:id/hod` | Assign HOD |
| DELETE | `/api/departments/:id/hod` | Remove HOD |

### Staff

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/staff` | Create staff |
| GET | `/api/staff` | Get all staff |
| GET | `/api/staff/:id` | Get staff by ID |
| PUT | `/api/staff/:id` | Update staff |
| DELETE | `/api/staff/:id` | Delete staff |
| DELETE | `/api/staff/drop` | Drop staff collection |

### Students

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/students` | Create student |
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get student by ID |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |
| DELETE | `/api/students/drop` | Drop students collection |
| POST | `/api/students/:studentId/borrow/:bookId` | Borrow book |
| POST | `/api/students/:studentId/return/:bookId` | Return book |

### Books

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/books` | Create book |
| GET | `/api/books` | Get all books |
| GET | `/api/books/:id` | Get book by ID |
| PUT | `/api/books/:id` | Update book |
| DELETE | `/api/books/:id` | Delete book |
| DELETE | `/api/books/drop` | Drop books collection |

## Example Request Bodies

### Create Department

```json
{
  "name": "Computer Science",
  "code": "CSE",
  "description": "Department of Computer Science and Engineering"
}
```

### Update Department

```json
{
  "name": "Computer Science and Engineering",
  "description": "Updated department description"
}
```

### Create Staff

```json
{
  "employeeId": "EMP1001",
  "name": "Dr. Priya Sharma",
  "email": "priya.sharma@example.com",
  "phone": "9876543210",
  "designation": "Professor",
  "department": "PUT_DEPARTMENT_ID_HERE"
}
```

### Update Staff

```json
{
  "phone": "9876500000",
  "designation": "Associate Professor"
}
```

### Assign HOD

```json
{
  "staffId": "PUT_STAFF_ID_HERE"
}
```

### Create Student

```json
{
  "rollNumber": "CSE2026001",
  "name": "Aarav Mehta",
  "email": "aarav.mehta@example.com",
  "phone": "9123456780",
  "year": 2,
  "department": "PUT_DEPARTMENT_ID_HERE"
}
```

### Update Student

```json
{
  "phone": "9000011111",
  "year": 3
}
```

### Move Student to Another Department

```json
{
  "department": "PUT_NEW_DEPARTMENT_ID_HERE"
}
```

### Create Book

```json
{
  "title": "Database System Concepts",
  "author": "Abraham Silberschatz",
  "isbn": "9780073523323",
  "totalCopies": 5,
  "availableCopies": 5
}
```

### Update Book

```json
{
  "title": "Database System Concepts - Seventh Edition",
  "totalCopies": 6,
  "availableCopies": 6
}
```

## Borrowing System

### Borrow Book

```text
POST /api/students/:studentId/borrow/:bookId
```

No request body is needed.

This route:

- Adds the book ID to `student.borrowedBooks`
- Adds the student ID to `book.borrowedBy`
- Decreases `book.availableCopies` by 1

### Return Book

```text
POST /api/students/:studentId/return/:bookId
```

No request body is needed.

This route:

- Removes the book ID from `student.borrowedBooks`
- Removes the student ID from `book.borrowedBy`
- Increases `book.availableCopies` by 1

## Relationship Design

### One-to-One: Staff and HOD

- `Department.hod` stores one staff ID.
- `Staff.hodOfDepartment` stores one department ID.
- A staff member can be HOD of only one department.
- A department can have only one HOD.

### One-to-Many: Department and Students

- `Student.department` stores the department ID.
- `Department.students` stores student IDs.
- One department can have many students.

### One-to-Many: Department and Staff

- `Staff.department` stores the department ID.
- `Department.staff` stores staff IDs.
- One department can have many staff members.

### Many-to-Many: Students and Books

- `Student.borrowedBooks` stores book IDs.
- `Book.borrowedBy` stores student IDs.
- One student can borrow many books.
- One book can be borrowed by many students, depending on available copies.

## Recommended Testing Flow

1. Create a department.
2. Copy the department `_id`.
3. Create staff using the department `_id`.
4. Copy the staff `_id`.
5. Assign that staff member as HOD.
6. Create students using the department `_id`.
7. Create books.
8. Borrow a book using student ID and book ID.
9. Return the book using the same IDs.

## Important Notes

- All request bodies should be sent as JSON.
- In Postman, set `Content-Type: application/json`.
- Use real MongoDB ObjectIds from your database.
- Drop endpoints remove entire collections, so use them carefully.
- A department with linked students or staff should not be deleted until those records are moved or deleted.
- HOD assignment should be done using the HOD endpoint, not by directly editing raw IDs.

## License

This project is open-source and available under the MIT License.
