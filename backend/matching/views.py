from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .services import get_matches_for_student
from accounts.models import Student

class MatchListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            student = request.user.student_profile
        except Student.DoesNotExist:
            return Response({"error": "User has no student profile"}, status=400)

        skill_filter = request.query_params.get('skill', None)
        department_filter = request.query_params.get('department', None)
        min_score_str = request.query_params.get('min_score', None)
        
        min_score = None
        if min_score_str:
            try:
                min_score = int(min_score_str)
            except ValueError:
                return Response({"error": "min_score must be an integer"}, status=400)

        results = get_matches_for_student(student, skill_filter, department_filter, min_score)

        return Response({"results": results})
