from django.db import models


# Create your models here.


class Duty(models.Model):
    title = models.CharField(max_length=100)
    completed = models.BooleanField(default=False, blank=True, null=False)

    def __str__(self):
        return self.title
