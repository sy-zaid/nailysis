from rest_framework.throttling import SimpleRateThrottle

class RoleBasedRateThrottle(SimpleRateThrottle):
    # Class-level rate mapping
    RATE_MAP = {
        'patient': '1000/hour',
        'doctor': '1000/hour',
        'lab_technician': '1500/hour',
        'default': '5000/hour'  # Fallback rate
    }
    
    # Set a dummy scope that exists in DEFAULT_THROTTLE_RATES
    scope = 'user'  # This must match a scope in your settings
    
    def allow_request(self, request, view):
        # Get the user's role and determine the appropriate rate
        if not request.user or not request.user.is_authenticated:
            return True  # No throttling for anonymous users
            
        role = getattr(request.user, 'role', None)
        rate = self.RATE_MAP.get(role, self.RATE_MAP['default'])
        
        # Temporarily override the rate
        self.rate = rate
        self.num_requests, self.duration = self.parse_rate(self.rate)
        
        return super().allow_request(request, view)
    
    def get_cache_key(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return None
            
        role = getattr(request.user, 'role', 'default')
        return f"{self.scope}_{role}_{request.user.pk}"