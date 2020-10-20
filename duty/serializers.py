from rest_framework import serializers
from .models import Duty


class DutySerializer(serializers.ModelSerializer):
    class Meta:
        model = Duty
        fields = '__all__'
