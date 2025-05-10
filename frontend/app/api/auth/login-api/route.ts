import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Sending login request to:', `${API_URL}/api/v1/users/sign_in`);
    console.log('Login request body:', JSON.stringify({ user: body }, null, 2));
    
    const response = await fetch(`${API_URL}/api/v1/users/sign_in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ user: body }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.status?.message || 'Falha na autenticação' },
        { status: response.status }
      );
    }
    
    const authToken = response.headers.get('Authorization');
    
    return NextResponse.json(
      { 
        user: data.data.user,
        token: authToken || data.data.token
      },
      { 
        status: 200,
        headers: {
          'Set-Cookie': `auth_token=${authToken || data.data.token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}` // 7 days
        }
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }
    
    const response = await fetch(`${API_URL}/api/v1/logout`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    
    return NextResponse.json(
      { message: 'Logout realizado com sucesso' },
      { 
        status: 200,
        headers: {
          'Set-Cookie': 'auth_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
        }
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('No auth token found in cookies');
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }
    
    console.log('Sending auth/me request to:', `${API_URL}/api/v1/auth/me`);
    
    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
      },
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
    
    return NextResponse.json(data.data.user);
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
