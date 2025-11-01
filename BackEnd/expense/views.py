from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import UserDetails
from .models import ExpenseDetails
from django.db.models import Sum

#Signup API
@csrf_exempt
def signup(request):
    if request.method == "POST":
        data = json.loads(request.body)
        fullname = data.get('FullName')
        email = data.get('Email')
        password = data.get('Password')

        if UserDetails.objects.filter(Email=email).exists():
            return JsonResponse({'message': 'Email already exists'}, status=400)
        UserDetails.objects.create(FullName=fullname, Email=email, Password=password)
        return JsonResponse({'message': 'User registered successfully'}, status=201)

#Login Api    
@csrf_exempt
def login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get('Email')
        password = data.get('Password')

        try:
            user = UserDetails.objects.get(Email=email, Password=password)
            return JsonResponse({'message': 'Login successful', 'userId': user.id, 'userName': user.FullName}, status=200)
        except:
            return JsonResponse({'message': 'Invalid credentials'}, status=400)

#Add Expense API
@csrf_exempt
def add_expense(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = int(data.get('UserId'))
        expense_date = data.get('ExpenseDate')
        expense_item = data.get('ExpenseItem')
        expense_cost = float(data.get('ExpenseCost'))

        
        user = UserDetails.objects.get(id=user_id)
        try:
            ExpenseDetails.objects.create(
                UserId=user,
                ExpenseDate=expense_date,
                ExpenseItem=expense_item,
                ExpenseCost=expense_cost
            )
            return JsonResponse({'message': 'Expense added successfully'}, status=201)
        except Exception as e:
            return JsonResponse({'message': 'Something went wrong','error': str(e)}, status=400)

#Manage Expense API
@csrf_exempt
def manage_expense(request,user_id):
    if request.method == "GET":

        expenses = ExpenseDetails.objects.filter(UserId=user_id)
        expense_list = list(expenses.values())

        return JsonResponse(expense_list, safe=False, status=200)
    
#Update (Edit) Expense API
@csrf_exempt
def update_expense(request, expense_id):
    if request.method == "PUT":
        data = json.loads(request.body)
        try:
            expense = ExpenseDetails.objects.get(id=expense_id)
            expense.ExpenseDate = data.get('ExpenseDate', expense.ExpenseDate)
            expense.ExpenseItem = data.get('ExpenseItem', expense.ExpenseItem)
            expense.ExpenseCost = data.get('ExpenseCost', expense.ExpenseCost)
            expense.save()
            return JsonResponse({'message' : 'Expense updated successfully!'})
        except :
            return JsonResponse({'message' : 'Expense not found!'}, status=404)
        
#Delete Expense API
@csrf_exempt
def delete_expense(request, expense_id):
    if request.method == "DELETE":
        try:
            expense = ExpenseDetails.objects.get(id=expense_id)
            expense.delete()
            return JsonResponse({'message' : 'Expense deleted successfully!'})
        except :
            return JsonResponse({'message' : 'Expense not found!'}, status=404)

#Search Expense API
@csrf_exempt
def search_expense(request, user_id):
    if request.method == 'GET':
        from_date = request.GET.get('from')
        to_date = request.GET.get('to')
        expenses = ExpenseDetails.objects.filter(UserId=user_id, ExpenseDate__range=[from_date, to_date])
        expense_list = list(expenses.values())
        agg = expenses.aggregate(Sum('ExpenseCost'))
        total = agg['ExpenseCost__sum'] or 0
        return JsonResponse({'expenses': expense_list, 'total': total})

#Change Password API
@csrf_exempt
def change_password(request, user_id):
    if request.method == "POST":
        data = json.loads(request.body)
        old_password = data.get('oldpassword')
        new_password = data.get('newpassword')

        try:
            user = UserDetails.objects.get(id=user_id)
            if user.Password != old_password:
                return JsonResponse({'message': 'Old password is incorrect'}, status=400)
            user.Password = new_password
            user.save()
            return JsonResponse({'message': 'Password changed successfully'}, status=200)
        except UserDetails.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)