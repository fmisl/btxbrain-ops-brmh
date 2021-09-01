from django.db import models
import os
import datetime
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()

class TimeStampedModel(models.Model):
    Update = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.Update


class Case(TimeStampedModel):
    # System Info
    # Owner = models.ForeignKey(user., blank=True, null=True, on_delete=models.CASCADE, related_name='slices')
    UserID = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')
    Opened = models.BooleanField(blank=True, default=False)
    Select = models.BooleanField(blank=True, default=False)
    Focus = models.BooleanField(blank=True, default=False)
    Group = models.IntegerField(blank=True, default=0)
    Complete = models.BooleanField(blank=True, default=False)
    # File & Image Info
    fileID = models.CharField(max_length=150, blank=True, null=True)
    OriginalFileName = models.CharField(max_length=500, blank=True, null=True)
    FileName = models.CharField(max_length=150, blank=True, null=True)
    InputAffineParamsX0 = models.FloatField(max_length=100, blank=True, null=True)
    InputAffineParamsY1 = models.FloatField(max_length=100, blank=True, null=True)
    InputAffineParamsZ2 = models.FloatField(max_length=100, blank=True, null=True)
    OutputAffineParamsX0 = models.FloatField(max_length=100, blank=True, null=True)
    OutputAffineParamsY1 = models.FloatField(max_length=100, blank=True, null=True)
    OutputAffineParamsZ2 = models.FloatField(max_length=100, blank=True, null=True)
    # Patient Info
    PatientID = models.CharField(max_length=150, blank=True, null=True)
    PatientName = models.CharField(max_length=150, blank=True, null=True)
    Age = models.CharField(max_length=20, blank=True, null=True)
    Sex = models.CharField(max_length=3, blank=True, null=True)
    AcquisitionDateTime = models.CharField(max_length=100, blank=True, null=True, default=None)
    # Quantification Info
    in_suvr_max = models.FloatField(blank=True, null=True)
    in_suvr_min = models.FloatField(blank=True, null=True)
    out_suvr_max = models.FloatField(blank=True, null=True)
    out_suvr_min = models.FloatField(blank=True, null=True)
    Tracer = models.CharField(max_length=150, blank=True, null=True)

    Global = models.FloatField(blank=True, default=None, null=True)
    Global_C = models.FloatField(blank=True, default=None, null=True)

    Composite = models.FloatField(blank=True, null=True)
    Composite_C = models.FloatField(blank=True, null=True)

    Frontal_L = models.FloatField(blank=True, null=True)
    Frontal_R = models.FloatField(blank=True, null=True)
    Parietal_L = models.FloatField(blank=True, null=True)
    Parietal_R = models.FloatField(blank=True, null=True)
    Temporal_L = models.FloatField(blank=True, null=True)
    Temporal_R = models.FloatField(blank=True, null=True)
    Cingulate_L = models.FloatField(blank=True, null=True)
    Cingulate_R = models.FloatField(blank=True, null=True)
    Striatum_L = models.FloatField(blank=True, null=True)
    Striatum_R = models.FloatField(blank=True, null=True)
    Occipital_L = models.FloatField(blank=True, null=True)
    Occipital_R = models.FloatField(blank=True, null=True)
    Thalamus_L = models.FloatField(blank=True, null=True)
    Thalamus_R = models.FloatField(blank=True, null=True)

    Frontal_L_C = models.FloatField(blank=True, null=True)
    Frontal_R_C = models.FloatField(blank=True, null=True)
    Cingulate_L_C = models.FloatField(blank=True, null=True)
    Cingulate_R_C = models.FloatField(blank=True, null=True)
    Striatum_L_C = models.FloatField(blank=True, null=True)
    Striatum_R_C = models.FloatField(blank=True, null=True)
    Thalamus_L_C = models.FloatField(blank=True, null=True)
    Thalamus_R_C = models.FloatField(blank=True, null=True)
    Occipital_L_C = models.FloatField(blank=True, null=True)
    Occipital_R_C = models.FloatField(blank=True, null=True)
    Parietal_L_C = models.FloatField(blank=True, null=True)
    Parietal_R_C = models.FloatField(blank=True, null=True)
    Temporal_L_C = models.FloatField(blank=True, null=True)
    Temporal_R_C = models.FloatField(blank=True, null=True)

    #
    # ScanDate = models.CharField(max_length=150, blank=True, null=True)
    #
    # Global = models.CharField(max_length=150, blank=True, null=True)
    # Lateral_Temporal = models.CharField(max_length=150, blank=True, null=True)
    # Lateral_Parietal = models.CharField(max_length=150, blank=True, null=True)
    # PC_PRC = models.CharField(max_length=150, blank=True, null=True)
    # Frontal = models.CharField(max_length=150, blank=True, null=True)

    # Format = models.CharField(max_length=150, blank=True, null=True)
    # DebugFlag = models.IntegerField(blank=False, default=0)
    # Step0 = models.BooleanField(blank=False, default=False)
    # Step1 = models.BooleanField(blank=False, default=False)
    # Step2 = models.BooleanField(blank=False, default=False)
    # Step3 = models.BooleanField(blank=False, default=False)
    # Step4 = models.BooleanField(blank=False, default=False)
    # Step5 = models.BooleanField(blank=False, default=False)
    # Step6 = models.BooleanField(blank=False, default=False)
    # Step7 = models.BooleanField(blank=False, default=False)
    # Step8 = models.BooleanField(blank=False, default=False)
    # Step9 = models.BooleanField(blank=False, default=False)
    # Step10 = models.BooleanField(blank=False, default=False)
    # Ready = models.BooleanField(blank=False, default=False)
    # File_nifti = models.FileField(upload_to=self_caseID_path, max_length=150, null=True)
    # File_hdr = models.FileField(upload_to=self_caseID_path, max_length=150, null=True)
    # File_img = models.FileField(upload_to=self_caseID_path, max_length=150, null=True)
    # VolumeX = models.CharField(max_length=5, blank=True, null=True)
    # VolumeY = models.CharField(max_length=5, blank=True, null=True)
    # VolumeZ = models.CharField(max_length=5, blank=True, null=True)
    # UserID = models.ForeignKey(user_model.User, null=True, blank=True,
    #                             on_delete=models.CASCADE, related_name='patients')

    # @property
    # def image_count(self):
    #     return self.slices.all().count()
    #
    # @property
    # def image_list(self):
    #     return self.slices.all()

    @property
    def image_count(self):
        return self.slices.all().count()

    @property
    def image_list(self):
        return self.slices.all()

    class Meta:
        ordering = ['-Update']

    def __str__(self):
        return self.FileName


class Slice(TimeStampedModel):
    Type = models.CharField(max_length=150, blank=True, null=True)
    ImageID = models.IntegerField(blank=True, null=True)
    # Format = models.CharField(max_length=150, blank=True, null=True)
    Direction = models.CharField(max_length=150, blank=True, null=True)
    # File = models.FileField(upload_to=caseID_path, max_length=150, null=True)
    Width = models.IntegerField(blank=True, null=True)
    Height = models.IntegerField(blank=True, null=True)
    Depth = models.IntegerField(blank=True, null=True)
    # SizeZ = models.CharField(max_length=5, blank=True, null=True)
    CaseID = models.ForeignKey(Case, blank=True, null=True, on_delete=models.CASCADE, related_name='slices')
    B64Data = models.TextField(max_length=5000, blank=True, null=True)
    # InvB64Data = models.TextField(max_length=5000, blank=True, null=True)

    class Meta:
        ordering = ['pk']