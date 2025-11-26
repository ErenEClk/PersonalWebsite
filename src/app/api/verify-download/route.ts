import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    // Şimdilik basit bir şifre kullanıyoruz. 
    // Daha sonra bunu environment variable'a taşıyabilirsin.
    const CORRECT_PASSWORD = "çağan31"; 

    if (password === CORRECT_PASSWORD) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: 'Incorrect password' },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

