import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userType, ...userData } = body;
    
    let requestBody: any = {
      user: {
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.passwordConfirmation,
        user_type: userType
      }
    };
    
    if (userType === 'patient') {
      requestBody.patient = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        address: userData.address
      };
    } else if (userType === 'provider') {
      requestBody.provider = {
        organization_name: userData.organizationName,
        contact_name: userData.contactName,
        specialty: userData.specialty,
        address: userData.address,
        phone: userData.phone
      };
    }
    
    const response = await fetch(`${API_URL}/api/v1/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        console.error('Failed to parse error response as JSON:', errorText);
        return NextResponse.json(
          { error: 'Falha no registro - resposta inválida do servidor' },
          { status: response.status }
        );
      }
      
      return NextResponse.json(
        { error: errorData.status?.message || 'Falha no registro', errors: errorData.errors },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    const authToken = response.headers.get('Authorization') || data.data.token;
    
    return NextResponse.json(
      { 
        user: data.data.user,
        token: authToken
      },
      { 
        status: 201,
        headers: {
          'Set-Cookie': `auth_token=${authToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}` // 7 days
        }
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
