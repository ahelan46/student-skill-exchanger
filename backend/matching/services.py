from accounts.models import Student
from skills.models import StudentSkill

def calculate_compatibility(student_me: Student, student_other: Student):
    """
    Calculates the compatibility score between two students.
    Returns (score, matching_skills_list, explanation_list)
    """
    score = 0
    explanations = []
    matching_skills = set()

    # Get my skills
    my_learn_skills = {ss.skill_id: ss for ss in student_me.skills.filter(skill_type='LEARN')}
    my_teach_skills = {ss.skill_id: ss for ss in student_me.skills.filter(skill_type='TEACH')}

    # Get their skills
    their_learn_skills = {ss.skill_id: ss for ss in student_other.skills.filter(skill_type='LEARN')}
    their_teach_skills = {ss.skill_id: ss for ss in student_other.skills.filter(skill_type='TEACH')}

    # Check directions
    # Direction A: Do they teach what I want to learn?
    overlap_a = set(my_learn_skills.keys()).intersection(set(their_teach_skills.keys()))
    # Direction B: Do I teach what they want to learn?
    overlap_b = set(my_teach_skills.keys()).intersection(set(their_learn_skills.keys()))

    if not overlap_a and not overlap_b:
        return 0, [], []

    # Reciprocal vs one-way
    if overlap_a and overlap_b:
        score += 60
        explanations.append("Reciprocal match: You can teach each other complementary skills.")
    else:
        score += 30
        explanations.append("One-way match: Only one of you teaches a skill the other wants to learn.")

    proficiency_score = 0
    prof_map = {'BEGINNER': 1, 'INTERMEDIATE': 2, 'ADVANCED': 3}

    # Analyze Direction A matches
    for skill_id in overlap_a:
        skill_name = my_learn_skills[skill_id].skill.name
        matching_skills.add(skill_name)
        explanations.append(f"{student_other.full_name} teaches {skill_name}, which you want to learn.")
        
        my_prof = prof_map.get(my_learn_skills[skill_id].proficiency, 1)
        their_prof = prof_map.get(their_teach_skills[skill_id].proficiency, 2)
        if their_prof > my_prof:
            proficiency_score += 10
        elif their_prof == my_prof:
            proficiency_score += 5

    # Analyze Direction B matches
    for skill_id in overlap_b:
        skill_name = my_teach_skills[skill_id].skill.name
        matching_skills.add(skill_name)
        explanations.append(f"You teach {skill_name}, which {student_other.full_name} wants to learn.")
        
        my_prof = prof_map.get(my_teach_skills[skill_id].proficiency, 2)
        their_prof = prof_map.get(their_learn_skills[skill_id].proficiency, 1)
        if my_prof > their_prof:
            proficiency_score += 10
        elif my_prof == their_prof:
            proficiency_score += 5

    # Cap proficiency score at 20
    proficiency_score = min(proficiency_score, 20)
    score += proficiency_score
    if proficiency_score > 0:
        explanations.append(f"Proficiency compatibility adds {proficiency_score} points.")

    # Availability
    if student_me.availability == 'ANY' or student_other.availability == 'ANY' or student_me.availability == student_other.availability:
        score += 10
        explanations.append("You have compatible availability.")

    # Learning preference
    if student_me.learning_preference == 'BOTH' or student_other.learning_preference == 'BOTH' or student_me.learning_preference == student_other.learning_preference:
        score += 10
        explanations.append("You have compatible learning preferences.")

    return score, list(matching_skills), explanations

def get_matches_for_student(student, skill_filter=None, department_filter=None, min_score=None):
    candidates = Student.objects.exclude(id=student.id)
    
    if department_filter:
        candidates = candidates.filter(department__icontains=department_filter)

    results = []
    for candidate in candidates:
        score, matching_skills, explanations = calculate_compatibility(student, candidate)
        
        if score == 0:
            continue
            
        if min_score is not None and score < min_score:
            continue
            
        if skill_filter and skill_filter.lower() not in [s.lower() for s in matching_skills]:
            continue

        # Get their teach/learn lists for display
        teach_list = [{"id": ss.skill.id, "name": ss.skill.name} for ss in candidate.skills.filter(skill_type='TEACH')]
        learn_list = [{"id": ss.skill.id, "name": ss.skill.name} for ss in candidate.skills.filter(skill_type='LEARN')]

        results.append({
            "student_id": candidate.id,
            "name": candidate.full_name,
            "department": candidate.department,
            "year": candidate.year,
            "teaches": teach_list,
            "wants_to_learn": learn_list,
            "match_score": score,
            "matching_skills": matching_skills,
            "explanation": explanations
        })

    # Rank by compatibility score descending
    results.sort(key=lambda x: x['match_score'], reverse=True)
    return results
