from django.contrib import admin

# Register your models here.

from .models import Case



class CaseAdmin(admin.ModelAdmin):
    list_display = (
                    "Opened", "Select", "Focus", "Group",
                    "fileID","FileName","PatientID","PatientName","Age","Sex",
                    "Tracer","Global","Composite",
                    )

admin.site.register(Case, CaseAdmin)