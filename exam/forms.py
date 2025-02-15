from django import forms
from .models import Result

class ResultAdminForm(forms.ModelForm):
    class Meta:
        model = Result
        fields = "__all__"

    def clean_user(self):
        user = self.cleaned_data.get("user")
        if user.groups.first().name == 'Teacher':
            raise forms.ValidationError("Can not assign Teacher")
        return user