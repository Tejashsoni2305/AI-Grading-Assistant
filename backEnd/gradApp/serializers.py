from rest_framework import serializers
from .models import StudentSubmission, GradingResult

class StudentSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentSubmission
        fields = ['student_name', 'submission_text', 'submission_type', 'question_or_topic'] 
class GradingResultSerializer(serializers.ModelSerializer):
    submission = StudentSubmissionSerializer()  

    class Meta:
        model = GradingResult
        fields = '__all__'  