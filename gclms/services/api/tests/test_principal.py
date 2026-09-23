"""
GCLMS API — Principal Integration & Multi-Tenant Isolation Tests
"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_principal_lists_only_own_school_students(async_client: AsyncClient):
    """Principal in School 1 must only see School 1 students and never School 2 students."""
    headers = {
        "X-Dev-User-ID": "user-p1",
        "X-Dev-Role": "PRINCIPAL",
        "X-Dev-School-ID": "school-1",
    }
    response = await async_client.get("/api/v1/principal/students", headers=headers)
    assert response.status_code == 200
    data = response.json()
    items = data["data"]
    emails = [s["email"] for s in items]

    assert "student.tharun.chennai@gclms.local" in emails
    assert "student.rohan.bengaluru@gclms.local" not in emails


@pytest.mark.asyncio
async def test_principal_cannot_access_other_school_student_dossier(async_client: AsyncClient):
    """Principal in School 1 must receive 404/403 when trying to access student from School 2."""
    headers = {
        "X-Dev-User-ID": "user-p1",
        "X-Dev-Role": "PRINCIPAL",
        "X-Dev-School-ID": "school-1",
    }
    response = await async_client.get("/api/v1/principal/students/user-s2", headers=headers)
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_principal_creates_class_and_subject(async_client: AsyncClient):
    """Principal can create academic classes and curriculum subjects in own school."""
    headers = {
        "X-Dev-User-ID": "user-p1",
        "X-Dev-Role": "PRINCIPAL",
        "X-Dev-School-ID": "school-1",
    }
    # Create Class
    class_payload = {
        "academic_year_id": "ay-1",
        "name": "Grade 11 - Robotics",
        "grade_level": "Grade 11",
        "room_number": "Lab 301",
    }
    c_res = await async_client.post("/api/v1/principal/classes", json=class_payload, headers=headers)
    assert c_res.status_code == 201
    assert c_res.json()["data"]["name"] == "Grade 11 - Robotics"

    # Create Subject
    subj_payload = {
        "code": "ROB-201",
        "name": "Applied Robotics & Sensors",
        "department": "Engineering",
        "weekly_hours": 5,
    }
    s_res = await async_client.post("/api/v1/principal/subjects", json=subj_payload, headers=headers)
    assert s_res.status_code == 201
    assert s_res.json()["data"]["code"] == "ROB-201"


@pytest.mark.asyncio
async def test_principal_broadcasts_announcement(async_client: AsyncClient):
    """Principal publishes school announcement."""
    headers = {
        "X-Dev-User-ID": "user-p1",
        "X-Dev-Role": "PRINCIPAL",
        "X-Dev-School-ID": "school-1",
    }
    payload = {
        "title": "Hackathon 2026 Announcement",
        "content": "All students are requested to form teams.",
        "audience": "ALL",
        "is_pinned": True,
    }
    res = await async_client.post("/api/v1/principal/announcements", json=payload, headers=headers)
    assert res.status_code == 201
    assert res.json()["data"]["title"] == "Hackathon 2026 Announcement"
