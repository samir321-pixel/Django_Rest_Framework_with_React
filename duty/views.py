from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import DutySerializer
from .models import Duty


# Create your views here.
# def index(request):
#     return render(request, 'home.html')


@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'List': '/duty-list/',
        'Detail View': 'duty-detail/<str:pk>',
        'Create': '/duty-create/',
        'Update': '/duty-update/<str:pk>/',
        'Delete': '/duty-delete/<str:pk>/',
    }
    return Response(api_urls)



@api_view(['GET'])
def dutyList(request):
    duties = Duty.objects.all()
    serializer = DutySerializer(duties, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def dutyDetail(request, pk):
    duties = Duty.objects.get(id=pk)
    serializer = DutySerializer(duties, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def dutyCreate(request):
    serializer = DutySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['POST'])
def dutyUpdate(request, pk):
    duty = Duty.objects.get(id=pk)
    serializer = DutySerializer(instance=duty, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['DELETE'])
def dutyDelete(request, pk):
    duty = Duty.objects.get(id=pk)
    duty.delete()
    return Response("Duty Successfully Deleted")
