from rest_framework import serializers
from .models import StudentSubmission, GradingResult

class StudentSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentSubmission
        fields = '__all__'  
class GradingResultSerializer(serializers.ModelSerializer):
    submission = StudentSubmissionSerializer()  

    class Meta:
        model = GradingResult
        fields = '__all__'  