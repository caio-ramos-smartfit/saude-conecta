import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    let queryString = '';
    if (date) queryString += `date=${date}&`;
    
    const response = await fetch(`${API_URL}/api/v1/providers/${params.id}/availability?${queryString}`, {
      method: 'GET',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.status?.message || 'Falha ao obter disponibilidade' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data.data.availabilities);
  } catch (error) {
    console.error('Get provider availability error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
