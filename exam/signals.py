from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Quiz
from django.utils.timezone import now
from .tasks import open_quiz, close_quiz


@receiver(post_save, sender=Quiz)
def schedule_quiz_tasks(sender, instance, created, **kwargs):
    if created:
        # Calculate delay for opening the quiz
        start_delay = (instance.start - now()).total_seconds()

        # Schedule opening the quiz
        if start_delay > 0:
            open_quiz.apply_async((instance.id,), countdown=start_delay)
        else:
            # If the start_time is in the past, open immediately
            open_quiz(instance.id)

        # Calculate delay for closing the quiz
        end_delay = (instance.end - now()).total_seconds()

        # Schedule closing the quiz
        if end_delay > 0:
            close_quiz.apply_async((instance.id,), countdown=end_delay)