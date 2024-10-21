from django.shortcuts import render, get_object_or_404
from .models import StudentSubmission, GradingResult
from django.http import HttpResponseRedirect
from django.urls import reverse


import requests

import datetime

import openai

from dotenv import load_dotenv

import os

load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')


# Create your views here.

def index(request):
    submissions = StudentSubmission.objects.all()
    results = GradingResult.objects.all()
    context = {'submissions': submissions, 'results': results}
    return render(request, 'index.html', context)

def submitAnswer(request):
    if request.method == 'POST':
        studentName = request.POST.get('student_name')
        questionTopic = request.POST.get('question_topic')
        submitType = request.POST.get('submission_type')
        submissionText = request.POST.get('submission_text')
    
        submission = StudentSubmission.objects.create(
                        student_name = studentName,
                        question_or_topic = questionTopic,
                        submission_type = submitType,
                        submission_text = submissionText
                    )

        return HttpResponseRedirect(reverse('results', args=[submission.id]))
        
       
    

    return render(request, 'submit.html')


def results(request, submission_id):
    submission = get_object_or_404(StudentSubmission, id=submission_id)
    answerToGrade = submission.submission_text
    topicOrQuestion = submission.question_or_topic
    typeOfQuestion = submission.submission_type

    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "user", "content": (
                f"Grade the following essay submission on the topic of '{topicOrQuestion}' out of 100 based on the criteria below. "
                "Please total up the individual rubric scores and provide a final grade based on the sum of these scores. "
                "Ensure the final grade reflects the exact total, and format your response as 'Grade: (single integer) - Feedback: (short feedback, breakdown).' "
                "Strictly adhere to the rubric, and do not be lenient, especially on content quality and depth.\n\n"
                "Grading Criteria:\n"
                "First of all check if it has atleast 200 words and also atleast 3 paragraphs, if not then it cannot score more than 30 no matter what. if its not fullfilling this condition then see the final grade and deduct marks to limit the final grade less than 30\n"
                "1. Content (40 points): Assess the depth of analysis and the ability to cover key points comprehensively.\n"
                "2. Structure (30 points): Evaluate the organization of the essay. It should have a clear introduction, body, and conclusion.\n"
                "3. Examples (20 points): Check for specific examples or evidence that support the arguments made in the essay.\n"
                "4. Relevance (10 points): Ensure the essay stays focused on the topic throughout. No off-topic discussions.\n"
                "5. Word Count: If the essay is under 200 words or less than three paragraphs it cannot score more than 30 as final grade.\n\n"
                "Calculate the total grade based on these scores and ensure the feedback matches the scoring.\n\n"
                f"Submission: {answerToGrade}"
            )}
        ],
        temperature=0.0,  # Low temperature for deterministic responses
    )


    response_content = response.choices[0].message["content"]

    try:
        # Attempt to split the response content
        gradeLine, feedbackLine = response_content.split(" - ")
        grade = int(gradeLine.split(": ")[1])
    except ValueError:
        # Log the response content for debugging
        print("Error parsing the response:", response_content)
        return render(request, 'results.html', {'submission': submission, 'error': 'Failed to parse the grading response.'})


    resultObject = GradingResult.objects.create(
                        submission = submission,
                        score = grade,
                        feedback = feedbackLine,
                    )




    return render(request, 'results.html', {'submission': submission, 'resultObject': resultObject})
