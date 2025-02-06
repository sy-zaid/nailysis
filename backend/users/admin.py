from django.contrib import admin
from users.models import CustomUser

# Register your models here.
class CustomUserAdmin(admin.ModelAdmin):
    model = CustomUser
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_staff', 'is_active','profile_picture')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone', 'role','profile_picture')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
    
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'role', 'password1', 'password2', 'is_staff', 'is_active','profile_picture')}
         ),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

    def save_model(self, request, obj, form, change):
        if not obj.pk or 'password' in form.changed_data:  # If this is a new user
            obj.set_password(obj.password)  # Hash the password
        super().save_model(request, obj, form, change)


admin.site.register(CustomUser, CustomUserAdmin)
