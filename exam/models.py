import datetime
from django.db import models
from django.contrib.auth.models import User

SCALE_CHOICES = [(i, str(i)) for i in range(1, 6)]

class Quiz(models.Model):
    author = models.ForeignKey(User , on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    duration = models.SmallIntegerField(help_text='Duration in minutes', default=5)
    start = models.DateTimeField(verbose_name='Start Date and Time')
    end = models.DateTimeField(verbose_name='End Date and Time')
    is_active = models.BooleanField(default=False, db_index=True)
    instructions = models.TextField(blank=True , null=True)

    class Meta:
        verbose_name = "Quiz"
        verbose_name_plural = "Quizzes"

    def __str__(self):
        return self.title

    @property
    def is_quiz_ended(self):
        return datetime.datetime.now() >= self.end
        

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='exam_questions')
    content = models.TextField(max_length=200)
    scale = models.SmallIntegerField(choices=SCALE_CHOICES, default=1)

    def __str__(self):
        return self.content

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='question_answers')
    content = models.TextField(max_length=200)
    is_correct = models.BooleanField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['question', 'content'], name='unique_question_answer')
        ]

    def __str__(self):
        return self.content

class Result(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='exam_results')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_results')
    total_mark = models.IntegerField(default=0)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    class Meta:
        unique_together = [('user', 'quiz')]
        verbose_name = "Result"
        verbose_name_plural = "Results"
        indexes = [
            models.Index(fields=['quiz']),
            models.Index(fields=['user']),
        ]
    def __str__(self):
        return f"Result of {self.user} in {self.quiz}"
    
class StudentResult(models.Model):
    result = models.ForeignKey(Result, on_delete=models.CASCADE, related_name='student_result')
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='student_answer')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='question_answer')
    
    class Meta:
        verbose_name = "Student Result"
        verbose_name_plural = "Student Results"
        
    def __str__(self):
        return f"Student's answer for {self.question}"

    def is_correct(self):
        """Check if the student's answer is correct."""
        return self.answer.is_correct
        

    