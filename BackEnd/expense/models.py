from django.db import models

# Create your models here.

class UserDetails(models.Model):
    FullName = models.CharField(max_length=100)
    Email = models.EmailField(unique=True,max_length=100)
    Password = models.CharField(max_length=20)
    RegDate = models.DateTimeField(auto_now_add=True)

    
    def __str__(self):
      return self.FullName

    class Meta:
        verbose_name = "User Detail"
        verbose_name_plural = "User Details"


class ExpenseDetails(models.Model):
    UserId = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    ExpenseDate = models.DateField(null=True, blank=True)
    ExpenseItem = models.CharField(max_length=100, null=True, blank=True)
    ExpenseCost = models.FloatField()
    NoteDate = models.DateTimeField(auto_now_add=True)


    def __str__(self):
      return f"{self.ExpenseItem} - {self.ExpenseCost}"

    class Meta:
        verbose_name = "Expense Detail"
        verbose_name_plural = "Expense Details"
    