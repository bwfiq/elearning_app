# backend/courses/filters.py
import django_filters
from .models import Course
from fuzzywuzzy import fuzz

class CourseFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='fuzzy_search')

    class Meta:
        model = Course
        fields = []

    def fuzzy_search(self, queryset, name, value):
        search_ratio = 60
        filtered_courses = []
        for course in queryset:
            fields_to_search = [course.name, course.description]
            for field in fields_to_search:
                if field:
                    match_ratio = fuzz.partial_token_sort_ratio(value, field)
                    if match_ratio >= search_ratio:
                        filtered_courses.append(course.id)
                        break  # Avoid adding the same course multiple times
        return queryset.filter(id__in=filtered_courses)
