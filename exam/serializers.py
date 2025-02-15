from rest_framework import serializers
from .models import Quiz , Question , Answer , Result , StudentResult
from django.db.models import Sum
from authapp.serializers import UserSerializer
class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        exclude_is_correct = kwargs.pop('exclude_is_correct', False)
        super().__init__(*args, **kwargs)

        if exclude_is_correct:
            self.fields.pop('is_correct', None)

class QuestionSerializer(serializers.ModelSerializer):
    question_answers = serializers.SerializerMethodField()
    class Meta:
        model = Question
        fields = '__all__'

    def get_question_answers(self, obj):
        exclude_is_correct = self.context.get('exclude_is_correct', False)
        return AnswerSerializer(
            obj.question_answers.all(),
            many=True,
            context=self.context,  # Pass context to maintain propagation
            exclude_is_correct=exclude_is_correct,
        ).data
'''
for Student need exclude the is_correct
serializer = QuizSerializer(instance=quiz_instance, context={'exclude_is_correct': True})
print(serializer.data)

for Teacher , Admin need include the is_correct
serializer = QuizSerializer(instance=quiz_instance, context={'exclude_is_correct': False})
print(serializer.data)

'''
class QuizSerializer(serializers.ModelSerializer):
    exam_questions = QuestionSerializer(many=True)
    total_scale = serializers.SerializerMethodField()
    class Meta:
        model = Quiz
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return representation

    def get_total_scale(self , instance):
        # Aggregate the sum of the `scale` field from all related questions
        total = instance.exam_questions.aggregate(total_mark=Sum('scale'))['total_mark']
        return total or 0  # Return 0 if there are no questions

class ResultSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Result
        fields = '__all__'

class StudentResultSerializer(serializers.ModelSerializer):
    result = ResultSerializer()
    answer = AnswerSerializer()
    question = QuestionSerializer()
    class Meta:
        model = StudentResult
        fields = '__all__'
