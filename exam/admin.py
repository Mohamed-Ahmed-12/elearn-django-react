from django.contrib import admin
from .models import Quiz , Answer , Result , Question , StudentResult
from .forms import ResultAdminForm
# Register your models here.


class ResultAdminForm(admin.ModelAdmin):
    form = ResultAdminForm  # Assign the form to ModelAdmin
    
admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Result,ResultAdminForm)
admin.site.register(StudentResult)



admin.site.site_header='Quizzat'


