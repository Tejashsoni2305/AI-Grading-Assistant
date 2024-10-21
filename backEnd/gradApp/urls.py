
from django.urls import path
from .views import index, submitAnswer, results

urlpatterns = [
    path('', index, name='index'),
    path('submitAnswer/', submitAnswer, name='submitAnswer'),
    path('results/<int:submission_id>/', results, name='results')
]
