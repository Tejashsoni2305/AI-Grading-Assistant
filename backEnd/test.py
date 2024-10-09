from gradApp.models import StudentSubmission, GradingResult

# Ensure there's at least one StudentSubmission
submission = StudentSubmission.objects.first()  # Get the first submission, or create one if needed
if not submission:
    submission = StudentSubmission.objects.create(student_name='Test Student', submission_text='Sample submission text.')

# Now create a GradingResult
grading_result = GradingResult.objects.create(submission=submission, score=95.00, feedback='Great work!')
print(grading_result)
