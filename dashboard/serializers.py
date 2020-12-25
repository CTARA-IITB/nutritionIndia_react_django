from rest_framework import serializers
from .models import UtData, AreaEn, Indicator, IndicatorUnitSubgroup, Subgroup, Timeperiod, NiStDtbPoly, Unit
from rest_framework_gis.serializers import (GeoFeatureModelSerializer, GeometryField)

class AreaEnSerializer(serializers.ModelSerializer):
    area_level= serializers.IntegerField()
    class Meta:
        model = AreaEn
        fields = ('area_id', 'area_code', 'area_name', 'area_level')

class AreaEnDropSerializer(serializers.ModelSerializer):
    area_parent_id= serializers.IntegerField()	
    area_level= serializers.IntegerField()

    class Meta:	
        model = AreaEn	
        fields = ('area_id','area_name','area_parent_id','area_level','area_code')	

    

class IndicatorSerializer(serializers.ModelSerializer):
    value =  serializers.CharField(source='indicator_id')	#renaming and changing int to charfield
    title = serializers.CharField(source='indicator_name')	#renaming

    class Meta:
        model = Indicator
        fields = ('value','title')	

class SubgroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subgroup
        fields = ('subgroup_id','subgroup_name') 

class IndicatorAllSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        fields = ('indicator_id','indicator_name')  

class TimeperiodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timeperiod
        fields = ('timeperiod_id','timeperiod')

class UnitNameSerializer(serializers.ModelSerializer):
        class Meta:
            model = Unit
            fields = "__all__"

class IndicatorUnitSubgroupSerializer(serializers.ModelSerializer):
    value = serializers.CharField(source='subgroup.subgroup_id')
    title = serializers.CharField(source='subgroup.subgroup_name')

    class Meta:
        model = IndicatorUnitSubgroup
        fields = ('value','title')	

class UtDatatimeSerializer(serializers.ModelSerializer):
    value = serializers.CharField(source='timeperiod.timeperiod_id')
    title = serializers.CharField(source='timeperiod.timeperiod')
    class Meta:
        model = UtData
        fields = ('value','title')	

class UtDataSerializer(serializers.ModelSerializer):
    area = AreaEnSerializer()
    data_value = serializers.DecimalField(max_digits=255, decimal_places=2)
  
    class Meta:
        model = UtData
        fields = ('area' , 'data_value')

class UtDataAllSerializer(serializers.ModelSerializer):
    indicator = IndicatorAllSerializer()
    timeperiod = TimeperiodSerializer()
    unit = UnitNameSerializer()
    data_value = serializers.DecimalField(max_digits=255, decimal_places=2)
  
    class Meta:
        model = UtData
        fields =  ('indicator' , 'timeperiod', 'unit' ,'data_value')

class NiStDtbPolySerializer(GeoFeatureModelSerializer):
    wkb_geometry = GeometryField()
    class Meta:
        model = NiStDtbPoly
        geo_field = "wkb_geometry"
        fields = ('id_field', 'st_name', 'dt_name', 'wkb_geometry')

# class NiStDtbPolySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = NiStDtbPoly
#         geo_field = "wkb_geometry"
#         fields = ('id_field', 'st_name', 'dt_name')

# class UtDataSerializer(serializers.ModelSerializer):
#     data_value= serializers.DecimalField(max_digits=255, decimal_places=3)
#     class Meta:
#         model = UtData
#         fields = ('data_id','data_value')



class UnitSerializer(serializers.ModelSerializer):

        class Meta:
            model = IndicatorUnitSubgroup
            fields = ('unit','indicator')
# class NiStDtbPolySerializer(serializers.Model