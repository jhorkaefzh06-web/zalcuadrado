import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      console.warn('Supabase credentials missing. Returning simulated image URL.');
      // Return a simulated URL for offline local development
      return NextResponse.json({
        url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600&auto=format&fit=crop',
        simulated: true
      });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No se subió ningún archivo.' }, { status: 400 });
    }

    // Create admin supabase client
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false
      }
    });

    const bucketName = 'images';

    // 1. Ensure public bucket 'images' exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = (buckets || []).some(b => b.name === bucketName);

    if (!bucketExists) {
      console.log(`Creating public storage bucket: ${bucketName}...`);
      const { error: bucketError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB limit
        allowedMimeTypes: ['image/*']
      });

      if (bucketError) {
        console.error('Failed to create bucket:', bucketError);
        throw bucketError;
      }
    }

    // 2. Generate unique filename
    const fileExt = file.name.split('.').pop() || 'jpg';
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const fileName = `${Date.now()}_${uniqueId}.${fileExt}`;

    // Convert file to array buffer for upload
    const buffer = Buffer.from(await file.arrayBuffer());

    // 3. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    // 4. Retrieve public URL
    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);

    return NextResponse.json({ url: data.publicUrl });
  } catch (err: any) {
    console.error('Upload API route error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
