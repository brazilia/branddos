
import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, loadImage } from 'canvas';
import sharp from 'sharp';

export const POST = async (req: NextRequest) => {
  try {
    const { headline, subtext, imageUrl } = await req.json();

    const baseImage = await loadImage(imageUrl);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext('2d');

    // Draw the generated background
    ctx.drawImage(baseImage, 0, 0);

    // Headline
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(headline, canvas.width / 2, canvas.height * 0.2);

    // Subtext
    ctx.font = '28px Arial';
    ctx.fillText(subtext, canvas.width / 2, canvas.height * 0.3);

    const imageBuffer = canvas.toBuffer('image/png');
    const finalImage = await sharp(imageBuffer).png().toBuffer();

    return new NextResponse(finalImage, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (err: any) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to generate image', details: err.message }),
      { status: 500 }
    );
  }
};
