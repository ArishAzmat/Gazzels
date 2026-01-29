 # API Validation Requirements

This document outlines the validation requirements for all API endpoints to ensure the frontend forms match the backend expectations.

## Last Updated
2026-01-29

## Employee/User API

### Create Employee (POST /api/employees/)
**Required Fields:**
- `name` - string
- `email` - email format
- `employee_code` - string
- `department` - string (from predefined choices)
- `role` - string (Employee or Admin)
- `password` - string (validated with Django password validation)
- `password_confirm` - string (must match password)

**Optional Fields:**
- None for creation

**Backend Serializer:** `UserCreateSerializer` in `apps/authentication/serializers.py`

**Frontend Form:** `EmployeeModal.jsx`

**Status:** ✅ Fixed - Added `password_confirm` field

---

### Update Employee (PUT /api/employees/{id}/)
**Required Fields:**
- `name` - string
- `department` - string
- `is_active` - boolean

**Notes:** 
- Password updates are handled separately
- Cannot update email or employee_code after creation

**Backend Serializer:** `UserUpdateSerializer` in `apps/authentication/serializers.py`

**Frontend Form:** `EmployeeModal.jsx`

**Status:** ✅ Valid

---

## Course API

### Create Course (POST /api/courses/)
**Required Fields:**
- `title` - string (max 255 chars)
- `category` - string (max 100 chars)
- `duration_minutes` - integer (min 1)

**Optional Fields:**
- `description` - text (can be blank)
- `is_active` - boolean (default: true)
- `lessons` - array of lesson objects (optional during creation)

**Lesson Object Structure (if provided):**
- `title` - string (required)
- `content` - text (optional)
- `duration_minutes` - integer (required, min 1)
- `order` - integer (required, auto-incremented)

**Backend Serializer:** `CourseCreateSerializer` in `apps/courses/serializers.py`

**Frontend Form:** `CourseModal.jsx`

**Status:** ✅ Valid

---

### Update Course (PUT /api/courses/{id}/)
**Required Fields:**
- Same as creation, but lessons are not updated through this endpoint

**Notes:** 
- Use separate lesson endpoints for managing lessons
- The `created_by` field is set automatically and cannot be changed

**Backend Serializer:** `CourseCreateSerializer` in `apps/courses/serializers.py`

**Frontend Form:** `CourseModal.jsx`

**Status:** ✅ Valid

---

## Assignment API

### Create Assignment (POST /api/assignments/)
**Required Fields:**
- `course_id` - UUID
- `employee_ids` - array of UUIDs (must not be empty)
- `due_date` - date format (YYYY-MM-DD)

**Optional Fields:**
- `assigned_date` - date (auto-set to today if not provided)

**Backend Serializer:** `BulkAssignmentSerializer` in `apps/assignments/serializers.py`

**Frontend Form:** `AssignmentModal.jsx`

**Status:** ✅ Valid

**Notes:**
- Frontend currently supports single employee selection, wrapping it in an array
- Backend supports bulk assignment natively

---

## Lesson API

### Create Lesson (POST /api/courses/lessons/)
**Required Fields:**
- `course` - UUID (course ID)
- `title` - string (max 255 chars)
- `duration_minutes` - integer (min 1)
- `order` - integer

**Optional Fields:**
- `content` - text (can be blank)

**Backend Serializer:** `LessonSerializer` in `apps/courses/serializers.py`

**Frontend:** Handled within `CourseModal.jsx` during course creation

**Status:** ✅ Valid

---

### Update Lesson (PUT /api/courses/lessons/{id}/)
**Required Fields:**
- Same as creation

**Backend Serializer:** `LessonSerializer` in `apps/courses/serializers.py`

**Status:** ✅ Valid

---

## Common Validation Patterns

### Password Validation
- Minimum length: 8 characters (Django default)
- Must contain at least one number
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- `password_confirm` must match `password`

### Email Validation
- Must be valid email format
- Must be unique in the system

### Employee Code Validation
- Must be unique in the system
- Required field

### Date Validation
- Must be in YYYY-MM-DD format
- `due_date` should be in the future (business logic)

### UUID Validation
- Must be valid UUID v4 format
- Referenced objects must exist in database

---

## Frontend-Backend Alignment Checklist

✅ **EmployeeModal** - All fields match backend requirements
✅ **CourseModal** - All fields match backend requirements  
✅ **AssignmentModal** - All fields match backend requirements

---

## Testing Recommendations

1. **Employee Creation:**
   - Test password mismatch error
   - Test password validation rules
   - Test duplicate email/employee_code

2. **Course Creation:**
   - Test with and without lessons
   - Test required field validation
   - Test duration_minutes minimum value

3. **Assignment Creation:**
   - Test with invalid course_id
   - Test with invalid employee_id
   - Test with past due_date

---

## Error Response Format

All validation errors follow Django REST Framework format:

```json
{
  "field_name": ["Error message 1", "Error message 2"]
}
```

Or for non-field errors:

```json
{
  "detail": "Error message"
}
```
