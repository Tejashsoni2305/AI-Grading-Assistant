from django.shortcuts import render, get_object_or_404
from .models import StudentSubmission, GradingResult
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .serializers import StudentSubmissionSerializer, GradingResultSerializer
import requests
import openai
import os
from dotenv import load_dotenv
from PyPDF2 import PdfReader
import csv
import io
from django.http import HttpResponse

from django.conf import settings

# Load environment variables


openai.api_key = settings.OPENAI_API_KEY

# Index view to render submissions and results
def index(request):
    submissions = StudentSubmission.objects.all()
    results = GradingResult.objects.all()
    context = {'submissions': submissions, 'results': results}
    return render(request, 'index.html', context)


#Text extracter function from pdf
def extract_text_from_in_memory_file(file_field):
    # Open and read the file into memory
    file_field.open()
    pdf_data = file_field.read()
    file_field.close()

    # Initialize text variable to collect content from each page
    text = ""
    pdf_reader = PdfReader(io.BytesIO(pdf_data))

    # Loop through all pages and extract text
    for page in pdf_reader.pages:
        text += page.extract_text() or ""  # Use `or ""` to handle None values
    return text

# API endpoint to submit an answer
@api_view(['POST'])
def submitAnswer(request):
    
    print("Received request data:", request.data)

    serializer = StudentSubmissionSerializer(data=request.data)
    if serializer.is_valid():
        submission = serializer.save()
        return JsonResponse({'submission_id': submission.id}, status=201)
    
    return JsonResponse(serializer.errors, status=400)

# API endpoint to retrieve grading results
@api_view(['GET'])
def results(request, submission_id):
    submission = get_object_or_404(StudentSubmission, id=submission_id)
    
    if(submission.submittedFile):
        answerToGrade = extract_text_from_in_memory_file(submission.submittedFile)
    else:
        answerToGrade = submission.submission_text
    
    topicOrQuestion = submission.question_or_topic
    typeOfQuestion = submission.submission_type

    # Define grading logic based on submission type
    response = None
    if typeOfQuestion.lower() == "essay":
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": (
                f"Grade the following essay submission on the topic of '{topicOrQuestion}' out of 100 based on the criteria below. "
                "Please total up the individual rubric scores and provide a final grade based on the sum of these scores. "
                "Ensure the final grade reflects the exact total, and format your response as 'Grade: (single integer) - Feedback: (short feedback, breakdown).' "
                "Strictly adhere to the rubric, and do not be lenient, especially on content quality and depth.\n\n"
                "Grading Criteria:\n"
                "First of all check if it has at least 20 words and also at least 3 paragraphs, if not then it cannot score more than 30 no matter what. "
                "If it is not fulfilling this condition then see the final grade and deduct marks to limit the final grade less than 30.\n"
                "1. Content (40 points): Assess the depth of analysis and the ability to cover key points comprehensively.\n"
                "2. Structure (30 points): Evaluate the organization of the essay. It should have a clear introduction, body, and conclusion.\n"
                "3. Examples (20 points): Check for specific examples or evidence that support the arguments made in the essay.\n"
                "4. Relevance (10 points): Ensure the essay stays focused on the topic throughout. No off-topic discussions.\n"
                "5. Word Count: If the essay is under 200 words or less than three paragraphs it cannot score more than 30 as final grade.\n\n"
                "Calculate the total grade based on these scores and ensure the feedback matches the scoring.\n\n"
                f"Submission: {answerToGrade}"
            )}],
            temperature=0.0,
        )

    elif typeOfQuestion.lower() == "report":
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": (
                f"Grade the following report submission on the topic of '{topicOrQuestion}' out of 100 based on the criteria below. "
                "Please total up the individual rubric scores and provide a final grade based on the sum of these scores. "
                "Ensure the final grade reflects the exact total, and format your response as 'Grade: (single integer) - Feedback: (short feedback, breakdown of individual rubric section).' "
                "Strictly adhere to the rubric, and avoid leniency, especially on content quality and depth.\n\n"
                "Grading Criteria:\n"
                "First, check if the report has at least 300 words and a minimum of four sections (e.g., Introduction, Analysis, Conclusion). "
                "If it fails to meet these requirements, limit the grade to a maximum of 30 points regardless of other criteria.\n\n"
                "1. Content Depth (40 points): Assess the report's detail, coverage of essential points, and analysis depth.\n"
                "2. Organization (30 points): Evaluate the structure, including logical flow between sections, clear headings, and coherence.\n"
                "3. Supporting Evidence (20 points): Check for specific examples, references, or data that strengthen the report's claims.\n"
                "4. Relevance (10 points): Ensure the report stays focused on the topic without irrelevant information.\n"
                "5. Word Count: If the report is under 300 words or lacks four distinct sections, cap the score at 30 points.\n\n"
                "Calculate the total grade based on these scores and ensure the feedback matches the scoring.\n\n"
                f"Submission: {answerToGrade}"
            )}],
            temperature=0.0,
        )

    elif typeOfQuestion.lower() == "short answer":
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": (
                f"Grade the following short answer submission for the question: '{topicOrQuestion}' out of 20 based on the criteria below. "
                "Please total up the individual rubric scores and provide a final grade based on the sum of these scores. "
                "Ensure the final grade reflects the exact total, and format your response as 'Grade: (single integer) - Feedback: (short feedback, breakdown).' "
                "Strictly adhere to the rubric, with no leniency on clarity, relevance, or accuracy.\n\n"
                "Grading Criteria:\n"
                "1. Relevance (5 points): Evaluate whether the answer directly addresses the question and stays on topic.\n"
                "2. Clarity and Precision (5 points): Check if the answer is clear, concise, and to the point. Deduct points for vagueness or irrelevant information.\n"
                "3. Understanding (5 points): Assess the depth of understanding shown in the answer. Look for evidence of familiarity with the main concepts.\n"
                "4. Accuracy (5 points): Verify the factual correctness of the response, and ensure any examples provided are appropriate.\n\n"
                "Calculate the total grade based on these scores, and ensure the feedback aligns with the grading.\n\n"
                f"Submission: {answerToGrade}"
            )}],
            temperature=0.0,
        )

    # Process the response from OpenAI
    response_content = response.choices[0].message["content"]
    
    try:
        # Attempt to split the response content
        gradeLine, feedbackLine = response_content.split(" - ")
        grade = int(gradeLine.split(": ")[1])
    except ValueError:
        # Log the response content for debugging
        print("Error parsing the response:", response_content)
        return JsonResponse({'error': 'Failed to parse the grading response.'}, status=500)

    # Save the grading result
    resultObject = GradingResult.objects.create(
        submission=submission,
        score=grade,
        feedback=feedbackLine,
    )

    # Serialize the result and return as JSON
    result_serializer = GradingResultSerializer(resultObject)
    return JsonResponse(result_serializer.data, status=200)




@api_view(['POST'])
def bulkSubmit(request):
    csv_file = request.FILES['file']
    file_data = csv_file.read().decode('utf-8')
    csv_reader = csv.DictReader(io.StringIO(file_data))

    responseFile = HttpResponse(
        content_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="Results.csv"'},
    )
    writer = csv.writer(responseFile, quoting=csv.QUOTE_ALL)
    writer.writerow(["student_name", "topic_or_question", "grade", "feedback"])

    for row in csv_reader:
        # Extracting each submission's details

        student_name = row.get("student_name")
        answerToGrade = row.get("submission_text")
        topicOrQuestion = row.get("question_or_topic")
        typeOfQuestion = row.get("submission_type")

        response = None
        if typeOfQuestion.lower() == "essay":
            response = openai.ChatCompletion.create(
                model="gpt-4-turbo",
                messages=[{"role": "user", "content": (
                    f"Grade the following essay submission on the topic of '{topicOrQuestion}' out of 100 based on the criteria below. "
                    "Please total up the individual rubric scores and provide a final grade based on the sum of these scores. "
                    "Ensure the final grade reflects the exact total, and format your response as 'Grade: (single integer) - Feedback: (short feedback, breakdown).' "
                    "Strictly adhere to the rubric, and do not be lenient, especially on content quality and depth.\n\n"
                    "Grading Criteria:\n"
                    "First of all check if it has at least 20 words and also at least 3 paragraphs, if not then it cannot score more than 30 no matter what. "
                    "If it is not fulfilling this condition then see the final grade and deduct marks to limit the final grade less than 30.\n"
                    "1. Content (40 points): Assess the depth of analysis and the ability to cover key points comprehensively.\n"
                    "2. Structure (30 points): Evaluate the organization of the essay. It should have a clear introduction, body, and conclusion.\n"
                    "3. Examples (20 points): Check for specific examples or evidence that support the arguments made in the essay.\n"
                    "4. Relevance (10 points): Ensure the essay stays focused on the topic throughout. No off-topic discussions.\n"
                    "5. Word Count: If the essay is under 200 words or less than three paragraphs it cannot score more than 30 as final grade.\n\n"
                    "Calculate the total grade based on these scores and ensure the feedback matches the scoring.\n\n"
                    f"Submission: {answerToGrade}"
                )}],
                temperature=0.0,
            )
        response_content = response.choices[0].message["content"]
        try:
            # Attempt to split the response content
            gradeLine, feedbackLine = response_content.split(" - ")
            grade = int(gradeLine.split(": ")[1])
        except ValueError:
            # Log the response content for debugging
            grade = 0
            feedback_line = "Error in response parsing."
            
        result = {
                    "student_name": student_name,
                    "topic_or_question": topicOrQuestion,
                    "grade": grade,
                    "feedback": feedbackLine
                }
        
        
        writer.writerow([student_name, topicOrQuestion, grade, feedbackLine])




    return responseFile
