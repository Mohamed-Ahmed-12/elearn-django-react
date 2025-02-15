from celery import shared_task
from .models import Quiz


@shared_task
def open_quiz(quiz_id):
    try:
        quiz = Quiz.objects.get(id=quiz_id)
        quiz.is_active = True
        quiz.save()
        print(f"Quiz {quiz.title} is now open.")
    except Quiz.DoesNotExist:
        print(f"Quiz with ID {quiz_id} does not exist.")

@shared_task
def close_quiz(quiz_id):
    try:
        quiz = Quiz.objects.get(id=quiz_id)
        quiz.is_active = False
        quiz.save()
        print(f"Quiz {quiz.title} is now closed.")
    except Quiz.DoesNotExist:
        print(f"Quiz with ID {quiz_id} does not exist.")