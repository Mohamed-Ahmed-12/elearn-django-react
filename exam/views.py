import datetime
from rest_framework.views import APIView
from exam.models import Quiz , Question , Answer
from rest_framework.response import Response
from rest_framework import status

from .serializers import QuizSerializer ,ResultSerializer , StudentResultSerializer
from django.shortcuts import get_object_or_404
from .models import Result , StudentResult
from .decorators import check_authorization
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware
# Convert milliseconds to seconds
def ms_to_date_time(timestamp_ms):
  timestamp_sec = timestamp_ms / 1000
  # Convert to datetime
  dt = datetime.datetime.fromtimestamp(timestamp_sec)
  return dt


class QuizView(APIView):
  @check_authorization
  def post(self, request):
    ''' Create a quiz '''
    user = request.user  
    try:
      # Get quiz data from request
      quiz_data = request.data.get('quiz')
      if not quiz_data:
          return Response({'error': 'Quiz data is required'}, status=status.HTTP_400_BAD_REQUEST)
      
      # Create a model instance and save it
      start = parse_datetime(quiz_data['start'])
      end = parse_datetime(quiz_data['end'])
      print(quiz_data['instructions'])
      quiz_instance = Quiz.objects.create(author=user, title=quiz_data['title'],duration = quiz_data['duration'],start=start,end=end , instructions = quiz_data['instructions'])

      questions_data = request.data.get('questions')
      # Step 2: Saving Questions
      if questions_data:
        for question_data in questions_data:
          question = Question(
            quiz=quiz_instance,  # Linking to the saved quiz
            content=question_data.get('question'),
            scale=question_data.get('scale', 1),  # Default scale of 1
          )
          question.save()

          for i in range(1, 5):
              answer_content = question_data.get(f'option{i}')
              # Check if this answer already exists for the same question
              if not Answer.objects.filter(question=question, content=answer_content).exists():
                  answer = Answer(
                      question=question,  # Linking to the saved question
                      content=answer_content,
                  )
                  if int(question_data.get('correctOption')) == i:
                      answer.is_correct = True
                  else:
                      answer.is_correct = False
                  answer.save()
              else:
                  # Handle case when answer already exists (e.g., skip or log an error)
                  continue
        return Response(
            {"message": "Quiz created successfully", "data": request.data},
            status=status.HTTP_201_CREATED
        )
      return Response(status=status.HTTP_400_BAD_REQUEST)
    except KeyError as e:
      return Response({'error': f'Missing key: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
      return Response({'error': 'An unexpected error occurred', 'details': str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
  @check_authorization
  def get(self,request,pk=None):
    ''' get a teacher quiz '''
    user = request.user
    try:
      if pk:
        # Get the specific quiz
        quiz = get_object_or_404(Quiz, id=pk)

        # check if Student is have result for this quiz 
        result = Result.objects.filter(quiz=quiz , user = user)
        if result.exists():
          res_serializer = ResultSerializer(result.first())
          quiz_serializer = QuizSerializer(quiz , context={'exclude_is_correct':True})
          data = {
            "quiz": quiz_serializer.data,  # Use string keys instead of model instances
            "result": res_serializer.data
          }
          return Response(data , status=status.HTTP_200_OK)
          
        # Know the correct answer if user is teacher otherwise not
        user_role = user.groups.first()
        serializer = QuizSerializer(quiz)
        if user_role.name == 'Student':
          serializer = QuizSerializer(quiz , context={'exclude_is_correct':True})
        # Return the serialized response
        return Response(serializer.data, status=status.HTTP_200_OK)

      quizzes = Quiz.objects.filter(author = user)
      if quizzes.exists():
        serializer = QuizSerializer(quizzes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
      return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as ex:
      return Response({'error': 'An unexpected error occurred', 'details': str(ex)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class StudentView(APIView):
  # save student quiz result 
  @check_authorization
  def post(self, request):
    user = request.user
    try:
      if request.data['quizId']:
        quiz = get_object_or_404(Quiz, id=int(request.data['quizId']))
        started_at = ms_to_date_time(request.data['timing']['start'])
        completed_at = ms_to_date_time(request.data['timing']['completed'])
        result = Result.objects.create(quiz = quiz , user = user , started_at=started_at , completed_at = completed_at)
        total_mark = 0
        for question_id , answer_id in request.data['answers'].items():
          question_obj = get_object_or_404(Question, id=int(question_id))
          answer_obj = get_object_or_404(Answer , id= answer_id)
          if answer_obj.is_correct:
            total_mark += question_obj.scale
          # create the student result
          StudentResult.objects.create(result=result ,answer=answer_obj,question=question_obj)
          # Update result with total mark
          result.total_mark = total_mark
          result.save()
        serializer = ResultSerializer(result)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
      return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
      return Response({'error': 'An unexpected error occurred', 'details': str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


  # @check_authorization
  # def get(self,request,pk):  
  #   '''Get result of quiz'''
  #   user = request.user
  #   try:
  #     quiz = get_object_or_404(Quiz, id=pk)
  #     result = Result.objects.filter(quiz=quiz , user=user)
  #     if not result.exists():
  #       return Response({'error': 'Result not found'}, status=status.HTTP_404_NOT_FOUND)
  #     serializer = ResultSerializer(result.first())
  #     return Response(serializer.data, status=status.HTTP_200_OK)
  #   except Exception as e:
  #     return Response({'error': 'An unexpected error occurred', 'details': str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class QuizResult(APIView):
  @check_authorization
  def get(self,request,pk): 
    '''Get all results of specific quiz'''
    try:
      quiz = get_object_or_404(Quiz, id=pk)
      results = quiz.exam_results.all()
      serializer = ResultSerializer(results, many=True)
      return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
      return Response({'error': 'An unexpected error occurred', 'details': str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
class StudentAnswer(APIView):
  @check_authorization
  def get(self,request,result_id):
    '''get student answer'''
    try:
      result = get_object_or_404(Result, id=result_id)
      student_res = result.student_result.all()
      serializer =StudentResultSerializer(student_res, many=True)
      return Response(serializer.data , status=status.HTTP_200_OK)
    except Exception as e:
      return Response({'error': 'An unexpected error occurred', 'details': str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      
      
class CalenderView(APIView):
  @check_authorization
  def get(self,request):
    ''' Get Teacher dates to render in calender '''
    try:
      teacher = request.user
      quizzes_date = Quiz.objects.filter(author = teacher).values('title','start')
      return Response(quizzes_date, status=status.HTTP_200_OK)
    except Exception as e:
      return Response({'error': 'An unexpected error occurred', 'details': str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
