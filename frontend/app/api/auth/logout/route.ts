import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function DELETE(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { message: 'Logout realizado com sucesso' },
        { status: 200 }
      );
    }
    
    console.log('Sending logout request to:', `${API_URL}/api/v1/logout`);
    
    const response = await fetch(`${API_URL}/api/v1/logout`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
      },
      credentials: 'include',
    });
    
    console.log('Logout response status:', response.status);
    
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
      { message: 'Logout realizado com sucesso' },
      { 
        status: 200,
        headers: {
          'Set-Cookie': 'auth_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
        }
      }
    );
  }
}
