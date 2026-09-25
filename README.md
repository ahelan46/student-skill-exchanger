# SkillSync AI — Student Skill Exchange Platform

** Learn what you want. Teach what you know. Connect with the right people.**

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

## 5. System Architecture

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

<img width="871" height="471" alt="image" src="https://github.com/user-attachments/assets/48bd240d-6da8-4a39-93ef-461d87ff6a70" />

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

## 9. Future Enhancements
- Verified student accounts using college email.
- Improved matching based on learning goals and session history.
- Calendar integration and reminders.
- Moderation and reporting tools.
- Analytics on skill demand and peer-learning activity across departments.

👥 Team Details

Team Name: NULL THEORY

Team Members:
1) AHELAN V
2) AKSHITHA BN
3) HARINI S

College Name: DR.N.G.P.INSTITUTE OF TECHNOLOGY

Problem Statement: WEB-04 – Student Skill Exchange Platform

Domain: Website Development
