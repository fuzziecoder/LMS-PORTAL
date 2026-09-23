"""
GCLMS API — Teacher Integration & Scoping Tests
"""

from datetime import datetime, timedelta, timezone
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_teacher_dashboard_shows_assigned_scope(async_client: AsyncClient):
    """Teacher dashboard returns only assigned classes, courses, and students."""
    headers = {
        "X-Dev-User-ID": "user-t1",
        "X-Dev-Role": "TEACHER",
        "X-Dev-School-ID": "school-1",
    }
    response = await async_client.get("/api/v1/teacher/dashboard", headers=headers)
    assert response.status_code == 200
    data = response.json()["data"]

    assert len(data["assigned_classes"]) == 1
    assert data["assigned_classes"][0]["name"] == "Grade 10"
    assert data["assigned_courses_count"] == 1
    assert data["assigned_students_count"] == 1


@pytest.mark.asyncio
async def test_teacher_creates_and_lists_assignments(async_client: AsyncClient):
    """Teacher can create an assignment in their assigned course."""
    headers = {
        "X-Dev-User-ID": "user-t1",
        "X-Dev-Role": "TEACHER",
        "X-Dev-School-ID": "school-1",
    }
    payload = {
        "course_id": "course-1",
        "target_class_id": "class-1",
        "title": "Assignment 1: Logic Gates & Bitwise Ops",
        "instructions": "Implement 32-bit ALU logic operations in Python.",
        "due_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "max_marks": 100,
        "allow_late": True,
        "status": "PUBLISHED",
    }
    res = await async_client.post("/api/v1/teacher/assignments", json=payload, headers=headers)
    assert res.status_code == 201
    asg_id = res.json()["data"]["id"]

    # List assignments
    list_res = await async_client.get("/api/v1/teacher/assignments", headers=headers)
    assert list_res.status_code == 200
    items = list_res.json()["data"]
    assert any(a["id"] == asg_id for a in items)


@pytest.mark.asyncio
async def test_teacher_records_attendance_roll_call(async_client: AsyncClient):
    """Teacher can record attendance for assigned class section."""
    headers = {
        "X-Dev-User-ID": "user-t1",
        "X-Dev-Role": "TEACHER",
        "X-Dev-School-ID": "school-1",
    }
    payload = {
        "class_id": "class-1",
        "section_id": "sec-1",
        "date": "2026-03-23",
        "records": [
            {"student_id": "user-s1", "status": "PRESENT", "notes": "Active participation"},
        ],
    }
    res = await async_client.post("/api/v1/teacher/attendance/sessions", json=payload, headers=headers)
    assert res.status_code == 200
    assert "Attendance roll call submitted" in res.json()["data"]["message"]
