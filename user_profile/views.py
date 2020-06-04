from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import (UserRegisterForm, 
                     ProfileRegisterForm, 
                     UserUpdateForm, 
                     ProfileUpdateForm
                  )
from django.contrib.auth.decorators import login_required #so that it is required to be logged in when accessing a view
# Create your views here.
def register(request):
   if request.method == "POST": 
      u_form = UserRegisterForm(request.POST)
      p_form = ProfileRegisterForm(request.POST)
      if u_form.is_valid() and p_form.is_valid(): # validating the data
         user = u_form.save() #this saves the user after the validation
 
         profile = p_form.save(commit=False)
         profile.user = user
         profile.save()

         messages.success(request, f'Successfully created account! You can login now!')
         return redirect('login')
   else:
      u_form = UserRegisterForm()
      p_form = ProfileRegisterForm()
   return render(request, 'user_profile/register.html', {'u_form':u_form, 'p_form': p_form})


@login_required # so that it is required to be logged in
def profile(request):
   if request.method == "POST": 
      u_form = UserUpdateForm(request.POST, instance=request.user)
      p_form = ProfileUpdateForm(request.POST, instance=request.user.profile)

      if u_form.is_valid() and p_form.is_valid():
         u_form.save()
         p_form.save()
         messages.success(request, f'Successfully updated your account!')
         return redirect('profile')
   else:
      u_form = UserUpdateForm(instance=request.user)
      p_form = ProfileUpdateForm(instance=request.user.profile)

   context = {
      'u_form':u_form,
      'p_form': p_form,
      'info': {
         'time_open': request.user.profile.time_open.strftime('%I:%M %p'),
         'time_close': request.user.profile.time_close.strftime('%I:%M %p'),
         'coor_long': request.user.profile.coor_long,
         'coor_lat': request.user.profile.coor_lat,
      }
   }
   return render(request, 'user_profile/profile.html', context)
