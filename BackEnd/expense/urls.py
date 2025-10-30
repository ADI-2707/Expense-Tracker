from django.urls import path
from .views import manage_expense, signup , login, add_expense

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('add_expense/', add_expense, name='add_expense'),
    path('manage_expense/<int:user_id>/', manage_expense, name='manage_expense'),
]
