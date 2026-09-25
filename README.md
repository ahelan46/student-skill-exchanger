# SkillSync AI — Student Skill Exchange Platform

**Tagline:** Learn what you want. Teach what you know. Connect with the right people.

![System Architecture](./architecture.png)

## 1. Project Overview
SkillSync AI is a web platform that helps students exchange knowledge and skills with one another. Students create profiles listing the skills they can teach and the skills they want to learn. The platform recommends suitable partners using reciprocal skill matching and supports the exchange process through requests, learning sessions, and feedback.

The project is developed for WEB-04: Student Skill Exchange Platform.

## 2. Problem Statement
Students often have useful skills but find it difficult to identify peers who can teach the skills they want to learn. Existing learning options may not provide an easy way for students to exchange knowledge directly with one another.

SkillSync AI addresses this by providing a centralized platform where students can:
- Create profiles and list skills they can teach.
- List skills they want to learn.
- Discover and filter other students by skill and relevant preferences.
- Receive explainable recommendations for mutually beneficial skill partners.
- Send and manage exchange requests.
- Schedule learning sessions and provide feedback.

## 3. Proposed Solution
The platform uses a reciprocal matching approach. For example:
- Student A can teach Python and wants to learn UI/UX design.
- Student B can teach UI/UX design and wants to learn Python.
- SkillSync identifies the complementary skills and recommends them to each other.

Recommendations can consider reciprocal skill compatibility, proficiency level, availability, and learning preferences. The compatibility score is an explainable system-generated score, not a guarantee of a successful exchange.

## 4. Main Features
### Core Features
1. **Student Profiles** — Name, department, year, bio, skills, proficiency, and availability.
2. **Skills Offered and Required** — Students maintain separate teach and learn skill lists.
3. **Search and Filters** — Find students by skill, department, proficiency, or availability.
4. **Smart Partner Matching** — Recommend compatible partners and show why they match.
5. **Exchange Request System** — Send, accept, reject, and track requests.
6. **Learning Sessions** — Schedule and track peer-learning sessions.
7. **Ratings and Feedback** — Submit feedback after a completed exchange.

### Enhancement Features
- AI-generated shared learning plans with topics and practice tasks.
- Campus skill-network visualization showing student connections and completed exchanges.

*Enhancement features are planned according to available development time and may be simplified for the prototype.*

## 5. System Architecture
```text
                 STUDENT
                    |
                    v
        React + Tailwind CSS Frontend
                    |
             REST API Requests
                    |
                    v
          Django REST Framework
          /         |           \
         v          v            v
   User/Profile  Matching     Exchange/
      APIs        Engine      Session APIs
         \          |            /
          \         |           /
                    v
               PostgreSQL
                    |
                    v
        Persistent project data

Optional:
Django Backend ---> LLM API ---> AI-generated learning plan
```

### Application Flow
1. Register / Sign In
2. Create Student Profile
3. Add Skills to Teach and Learn
4. Find Skill Partners
5. Calculate Reciprocal Compatibility
6. View Match and Explanation
7. Send Exchange Request
8. Receiver Accepts or Rejects
9. Schedule and Complete Session
10. Submit Rating and Feedback

## 6. Technology Stack
| Layer | Technology |
|---|---|
| Frontend | React |
| UI and Styling | Tailwind CSS |
| Backend | Python, Django |
| API | Django REST Framework |
| Database | PostgreSQL |
| Matching Logic | Python-based rule/score algorithm |
| Optional AI | LLM API for learning-plan generation |
| Version Control | Git and GitHub |
| Hosting Platform | To be selected based on hackathon availability |

## 7. Proposed Database Models
| Model | Purpose |
|---|---|
| Student | Student profile and academic details |
| Skill | Skill name and category |
| StudentSkill | Student, skill, teach/learn type, proficiency |
| ExchangeRequest | Sender, receiver, exchanged skills, and status |
| LearningSession | Session schedule, topic, and completion status |
| Feedback | Reviewer, reviewee, rating, and comments |

## 8. Repository Structure
```
skillsync-ai/
├── backend/
│   ├── manage.py
│   ├── config/
│   └── apps/
│       ├── accounts/
│       ├── skills/
│       ├── matching/
│       ├── exchanges/
│       └── feedback/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
├── docs/
│   └── architecture.md
├── .gitignore
└── README.md
```
*The structure is a proposed starting point and can be adjusted to match the implementation.*

## 9. Team Details
*Update the placeholders before submitting the project.*

| S. No. | Team Member Name | College Name | Role |
|---|---|---|---|
| 1 | [Team Member 1] | [College Name] | [Role] |
| 2 | [Team Member 2] | [College Name] | [Role] |
| 3 | [Team Member 3] | [College Name] | [Role] |
| 4 | [Team Member 4] | [College Name] | [Role] |

## 10. Setup Instructions
These are initial setup instructions. Add environment-specific details and deployment URLs once the application is configured.

### Backend
```bash
cd backend
python -m venv venv
```
Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

Install dependencies after creating `requirements.txt`:
```bash
pip install -r requirements.txt
```
Configure database and secret values in a local `.env` file. *Do not commit credentials or API keys.*

Run migrations and start the development server:
```bash
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Configure the frontend API base URL to point to the Django backend.

## 11. GitHub Collaboration
1. Create a new GitHub repository for SkillSync AI.
2. Add team members as repository collaborators.
3. Assign each member a module or task.
4. Use branches and pull requests to integrate work.
5. Keep `.env`, credentials, virtual environments, and dependency folders out of version control.

## 12. Project Status
**Status:** Prototype under development.

**Planned implementation priorities:**
- Student profiles and skill management.
- Reciprocal partner matching with explanations.
- Exchange request and acceptance workflow.
- Session scheduling and feedback.
- Optional learning-plan generation and campus network visualization.

## 13. Future Enhancements
- Verified student accounts using college email.
- Improved matching based on learning goals and session history.
- Calendar integration and reminders.
- Moderation and reporting tools.
- Analytics on skill demand and peer-learning activity across departments.

---
*Note: Replace all team placeholders, confirm the final hosting provider, and update the setup commands and project status to reflect the actual implementation before submission.*
