from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Profile
from tempus_dominus.widgets import DatePicker, TimePicker, DateTimePicker

class UserRegisterForm(UserCreationForm):
   email = forms.EmailField(required=True)
   first_name = forms.CharField(max_length=30)
   last_name = forms.CharField(max_length=150)
   class Meta:
      model = User #this tells us which model this form will interact with
      fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2'] #firstname lastname

   def save(self, commit=True):
      user = super().save(commit=False)
      
      user.email = self.cleaned_data['email']
      user.first_name = self.cleaned_data['first_name']
      user.last_name = self.cleaned_data['last_name']

      if commit:
         user.save()
         
      return user

class ProfileRegisterForm(forms.ModelForm):

   class Meta:
      model = Profile #this tells us which model this form will interact with
      fields = ['store_name', 'country', 'address', 'contact_num', 'quantity', 'min_price', 'max_price',
               'time_open', 'time_close', 'coor_long', 'coor_lat',] #firstname lastname
      widgets = {
         'time_open' :TimePicker(
               options= {
                  'format': 'h:mm A',
                  'ignorereadonly': True
                  },
               attrs={
                  'input_toggle': True,
                  'input_group': True,
                  'icon_toggle': True,
                  'append': 'fa fa-clock-o',
                  },
         ),
         'time_close' :TimePicker(
               options= {
                  'format': 'h:mm A',
                  'ignorereadonly': True
               },
               attrs={
                  'input_toggle': True,
                  'input_group': True,
                  'icon_toggle': True,
                  'append': 'fa fa-clock-o',
               },
            ),
       }

class UserUpdateForm(forms.ModelForm):
   class Meta:
      model = User
      fields = ['username', 'email', 'first_name', 'last_name']

class ProfileUpdateForm(forms.ModelForm):

   class Meta:
      model = Profile
      fields = ['store_name', 'country', 'address', 'contact_num', 'quantity', 'min_price', 'max_price',
               'time_open', 'time_close', 'coor_long', 'coor_lat',]
      widgets = {
         'time_open' :TimePicker(
               options= {
                  # 'defaultDate': '1970-01-01T14:56:00'
                  'format': 'h:mm A',
                  'ignorereadonly': True
                  },
               attrs={
                  'input_toggle': True,
                  'input_group': True,
                  'icon_toggle': True,
                  'append': 'fa fa-clock-o',
                  },
         ),
         'time_close' :TimePicker(
               options= {
                  # 'defaultDate': '1970-01-01T14:56:00'
                  'format': 'h:mm A',
                  'ignorereadonly': True
               },
               attrs={
                  'input_toggle': True,
                  'input_group': True,
                  'icon_toggle': True,
                  'append': 'fa fa-clock-o',
               },
            )
       }