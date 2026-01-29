from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .serializers import (
    LoginSerializer,
    TokenSerializer,
    UserSerializer,
    UserCreateSerializer
)
from .permissions import IsAdmin


class LoginView(APIView):
    """
    API endpoint for user login.
    Returns JWT access and refresh tokens upon successful authentication.
    """
    permission_classes = [AllowAny]
    
    @extend_schema(
        request=LoginSerializer,
        responses={
            200: TokenSerializer,
            401: OpenApiResponse(description='Invalid credentials')
        },
        description='Authenticate user and return JWT tokens'
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        user = authenticate(request, username=email, password=password)
        
        if user is None:
            return Response(
                {'detail': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_active:
            return Response(
                {'detail': 'User account is disabled'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)


class RegisterView(APIView):
    """
    API endpoint for user registration (Admin only).
    """
    permission_classes = [IsAdmin]
    
    @extend_schema(
        request=UserCreateSerializer,
        responses={
            201: UserSerializer,
            400: OpenApiResponse(description='Validation error')
        },
        description='Register a new user (Admin only)'
    )
    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED
        )


class CurrentUserView(generics.RetrieveAPIView):
    """
    API endpoint to get current authenticated user details.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    @extend_schema(
        responses={200: UserSerializer},
        description='Get current user details'
    )
    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
