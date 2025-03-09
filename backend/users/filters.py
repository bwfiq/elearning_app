# backend/users/filters.py
import django_filters
from .models import User
from fuzzywuzzy import fuzz

class UserFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='fuzzy_search')

    class Meta:
        model = User
        fields = []

    def fuzzy_search(self, queryset, name, value):
        search_ratio = 60
        filtered_users = []
        for user in queryset:
            match_ratio = fuzz.partial_token_sort_ratio(value, user.username)
            if match_ratio >= search_ratio:
                filtered_users.append(user.id)
        return queryset.filter(id__in=filtered_users)
