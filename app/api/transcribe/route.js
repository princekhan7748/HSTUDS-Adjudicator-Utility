
import { createClient } from '@deepgram/sdk';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }

  try {
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
    const buffer = Buffer.from(await file.arrayBuffer());

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      buffer,
      {
        model: 'nova-2',
        smart_format: true,
      }
    );

    if (error) {
      throw error;
    }

    const transcript = result.results.channels[0].alternatives[0].transcript;
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return NextResponse.json({ error: 'Error transcribing audio.' }, { status: 500 });
  }
}
