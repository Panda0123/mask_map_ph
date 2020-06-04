from django.shortcuts import render
from django.contrib.auth.models import User

# Create your models here.
def map(request):
   users = User.objects.all();
   lt_user = []
   for user in users:
      prof = user.profile
      temp_dic = {}
      temp_dic["username"] =  user.username
      temp_dic["firstname"] = user.first_name
      temp_dic['lastname'] = user.last_name
      temp_dic['email'] = user.email
      temp_dic['contact_num'] = prof.contact_num
      temp_dic['store_name'] = prof.store_name
      temp_dic['quantity'] = prof.quantity
      temp_dic['min_price'] = prof.min_price
      temp_dic['max_price'] = prof.max_price
      temp_dic['country'] = prof.country.name
      temp_dic['address'] = prof.address
      temp_dic['time_in'] = prof.time_open.strftime('%I:%M %p')
      temp_dic['time_out'] = prof.time_close.strftime('%I:%M %p')
      temp_dic['coor_long'] = prof.coor_long
      temp_dic['coor_lat'] = prof.coor_lat

      lt_user.append(temp_dic)
      
   context = {'lt_user': lt_user, 'is_logged_in': 0}

   if request.user.is_authenticated:
      context['is_logged_in'] = 1
      context['logged_in_username'] = request.user.username

   return render(request, 'map_app/map.html', context)