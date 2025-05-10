import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body.user || body;
    
    console.log('Sending sign_in request to:', `${API_URL}/api/v1/login`);
    console.log('Request body:', JSON.stringify({ 
      user: {
        email,
        password
      }
    }, null, 2));
    
    const response = await fetch(`${API_URL}/api/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        user: {
          email,
          password
        }
      }),
    });
    
    console.log('Sign in response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = 'Falha na autenticação';
      
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
    console.log('Sign in success data:', data);
    
    let authToken = response.headers.get('Authorization') || data.data?.token || data.token;
    
    if (authToken && authToken.startsWith('Bearer ')) {
      authToken = authToken.substring(7);
    }
    
    console.log('Auth token extracted:', authToken ? 'Token found' : 'No token found');
    
    const userData = data.data?.user || data.user;
    
    if (!userData) {
      console.error('No user data found in response:', data);
      return NextResponse.json(
        { error: 'Dados de usuário não encontrados na resposta' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        user: userData,
        token: authToken
      },
      { 
        status: 200,
        headers: {
          'Set-Cookie': `auth_token=${authToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}` // 7 days
        }
      }
    );
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
