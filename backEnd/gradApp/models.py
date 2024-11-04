from django.db import models

class StudentSubmission(models.Model):
    SUBMISSION_TYPE_CHOICES = [
        ('article', 'Article'),
        ('report', 'Report'),
        ('essay', 'Essay'),
        ('mcq', 'Multiple Choice'),
    ]

    student_name = models.CharField(max_length=255)
    submission_text = models.TextField(null=True, blank=True)  # The student's answer
    submission_type = models.CharField(
        max_length=50,
        choices=SUBMISSION_TYPE_CHOICES,
        default='essay',  # Set default to one of the choices, if desired
    )
    question_or_topic = models.CharField(max_length=500, help_text="The question or topic of the submission.")
    date_submitted = models.DateTimeField(auto_now_add=True)
    submittedFile = models.FileField(upload_to='uploads/', blank=True, null=True)

    def __str__(self):
        return f"{self.student_name} - {self.submission_type}"

class GradingResult(models.Model):
    submission = models.ForeignKey(StudentSubmission, on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    feedback = models.TextField()
    date_graded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Grade for {self.submission.student_name} ({self.submission.submission_type})"
