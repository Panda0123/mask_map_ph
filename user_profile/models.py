from django.db import models

# Create your models here.

from django.contrib.auth.models import User
from django_countries.fields import CountryField
from django.utils import timezone 

# Create your models here.
class Profile(models.Model):
   user = models.OneToOneField(User, on_delete=models.CASCADE) # 1 - 1 rel with User
   image = models.ImageField(default='default.jpg', upload_to='profile_pics')

   #name of the sore
   store_name = models.CharField(default='', blank=False, max_length=100)
   quantity = models.IntegerField(default=0, blank=False)

   #price
   min_price = models.IntegerField(default=0,blank=False)
   max_price = models.IntegerField(default=0)

   #contact
   contact_num = models.CharField(default='',blank=False, max_length=12)

   #address
   country = CountryField(default='',blank=False, blank_label='(select country)')
   address = models.CharField(default='',blank=False,max_length=100)

   #time
   time_open = models.TimeField(default=timezone.now)
   time_close = models.TimeField(default=timezone.now)


   #coordinate
   coor_long = models.DecimalField(default=124.620937,max_digits=11, decimal_places=8)
   coor_lat = models.DecimalField(default=8.442380, max_digits=10, decimal_places=8)

   def __str__(self):
      return f'{self.user.username} Profile'

   