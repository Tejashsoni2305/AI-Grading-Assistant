from rest_framework import serializers
from .models import StudentSubmission, GradingResult

class StudentSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentSubmission
        fields = ['student_name', 'submission_text', 'submission_type', 'question_or_topic', 'submittedFile'] 
    def validate(self, data):
        submission_text = data.get('submission_text')
        submittedFile = data.get('submittedFile')

        if not submission_text and not submittedFile:
            raise serializers.ValidationError("No submission text or submission file provided")
        elif submittedFile and submission_text:
            raise serializers.ValidationError("Either upload a file or text but not both")

        # Optional: Add additional file validation if needed
        if submittedFile:
            if not submittedFile.name.endswith('.pdf'):
                raise serializers.ValidationError("Only PDF files are allowed.")
            if submittedFile.size > 5 * 1024 * 1024:  # 5MB limit
                raise serializers.ValidationError("File size must be under 5MB.")
    
        return data


class GradingResultSerializer(serializers.ModelSerializer):
    submission = StudentSubmissionSerializer()  

    class Meta:
        model = GradingResult
        fields = '__all__'  