import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  try {
    let authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        authToken = authHeader.substring(7);
      }
    }
    
    console.log('Auth token from cookies or headers:', authToken ? 'Token present' : 'No token');
    
    if (!authToken) {
      console.log('No auth token found in cookies or headers');
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }
    
    console.log('Sending auth/me request to:', `${API_URL}/api/v1/auth/me`);
    console.log('Auth token being sent:', authToken ? 'Token present' : 'No token');
    console.log('Full auth token value:', authToken);
    
    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    console.log('Request headers:', headers);
    
    const response = await fetch(`${API_URL}/api/v1/users/me`, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
    });
    
    console.log('Auth/me response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = 'Falha ao obter usuário';
      
      try {
        const errorData = await response.json();
        console.log('Error response data:', errorData);
        errorMessage = errorData.status?.message || errorMessage;
      } catch (e) {
        const errorText = await response.text();
        console.error('Failed to parse error response as JSON:', errorText);
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('Auth/me success data:', data);
    
    if (data && data.data && data.data.user) {
      return NextResponse.json(data.data.user);
    } else if (data && data.user) {
      return NextResponse.json(data.user);
    } else {
      console.error('Unexpected data structure:', data);
      return NextResponse.json(
        { error: 'Formato de resposta inesperado' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
