# SkillSync AI Backend

This is the Django backend for the SkillSync AI project, a student skill exchange platform.

## Features
- Student Profiles: User profiles with academic details.
- Skills Management: Track skills students want to learn and can teach.
- Exchange Requests: Send and receive skill exchange requests.
- Learning Sessions: Schedule and complete learning sessions.
- Feedback: Provide ratings and comments for completed sessions.
- REST API: Built with Django REST Framework for easy frontend integration.

## Setup Instructions
1. Install requirements (assuming virtual environment is active):
   ```bash
   pip install -r requirements.txt
   ```
2. Copy `.env.example` to `.env` and fill in any secrets if needed (currently using SQLite).
3. Apply migrations:
   ```bash
   python manage.py migrate
   ```
4. Run the development server:
   ```bash
   python manage.py runserver
   ```

## Apps
- `accounts`: Manages `Student` profiles linked to Django's `User` (includes availability & learning preferences).
- `skills`: Manages the `Skill` catalog and `StudentSkill` relations (teach/learn, proficiencies).
- `matching`: Smart reciprocal matching engine.
- `exchanges`: Manages `ExchangeRequest`, `LearningSession`, and `Feedback`.

## Smart Reciprocal Matching Engine
The system analyzes skill demands and offers between students to recommend ideal learning partners. 

### Compatibility Scoring (0 to 100)
- **Reciprocal match (60 pts):** Both students teach a skill the other wants to learn.
- **One-way match (30 pts):** Only one student teaches a skill the other wants to learn.
- **Proficiency compatibility (up to 20 pts):** Points are added if a teacher's proficiency is higher than or equal to the learner's proficiency for a given skill.
- **Availability compatibility (10 pts):** Both students have overlapping availability preferences (e.g. Weekends, Any).
- **Learning Preference (10 pts):** Both students have compatible modes of learning (e.g. Online, Both).

### Demo Data Setup
To populate the database with demo users (Arun, Priya, Rahul, Meena) who have pre-configured complementary skills:
```bash
python manage.py seed_demo_data
```

## API Endpoints (Prefix `/api/`)
- `/api/accounts/students/` - Student profiles
- `/api/skills/skills/` - Skill catalog
- `/api/skills/student-skills/` - Student skill mappings
- `/api/matches/` - Returns recommended learning partners for the currently authenticated user.

### Example Match Request
```http
GET /api/matches/?skill=Python&department=CSE&min_score=50
Authorization: Basic <credentials>
```

### Example Match Response
```json
{
  "results": [
    {
      "student_id": 2,
      "name": "Priya",
      "department": "Design",
      "year": 3,
      "teaches": ["UI/UX"],
      "wants_to_learn": ["Python"],
      "match_score": 100,
      "matching_skills": ["Python", "UI/UX"],
      "explanation": [
        "Reciprocal match: You can teach each other complementary skills.",
        "Priya teaches UI/UX, which you want to learn.",
        "You teach Python, which Priya wants to learn.",
        "Proficiency compatibility adds 20 points.",
        "You have compatible availability.",
        "You have compatible learning preferences."
      ]
    }
  ]
}
```
