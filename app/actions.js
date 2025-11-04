'use server';

import { createClient } from '@deepgram/sdk';

export async function transcribeAudio(formData) {
  const file = formData.get('file');

  if (!file) {
    throw new Error('No file provided.');
  }

  // IMPORTANT: Replace with your Deepgram API key
  // You can get a free key at https://console.deepgram.com/signup
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

  return result.results.channels[0].alternatives[0].transcript;
}
