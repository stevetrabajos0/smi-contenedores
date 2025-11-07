import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formType, ...formData } = body;

    // Validate form type
    if (!formType) {
      return NextResponse.json(
        {
          error: 'Tipo de formulario no especificado',
        },
        { status: 400 }
      );
    }

    // Route to specific handler based on form type
    let response;
    switch (formType) {
      case 'storage':
        response = await fetch(new URL('/api/forms/storage', request.url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        break;

      case 'standard':
        response = await fetch(new URL('/api/forms/standard', request.url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        break;

      case 'custom':
        response = await fetch(new URL('/api/forms/custom', request.url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        break;

      default:
        return NextResponse.json(
          {
            error: 'Tipo de formulario no válido',
            validTypes: ['storage', 'standard', 'custom'],
          },
          { status: 400 }
        );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error('Error processing form:', error);
    return NextResponse.json(
      {
        error: 'Error al procesar el formulario',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'API de formularios de SMI Contenedores',
      endpoints: {
        storage: '/api/forms/storage',
        standard: '/api/forms/standard',
        custom: '/api/forms/custom',
      },
      usage: 'POST /api/forms con { formType: "storage" | "standard" | "custom", ...formData }',
    },
    { status: 200 }
  );
}
