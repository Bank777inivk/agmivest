import { NextResponse } from 'next/server';

export async function GET() {
    const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!key) return NextResponse.json({ error: 'No key found' });

    try {
        const parsed = JSON.parse(key.trim());
        const privateKey: string = parsed.private_key || '';

        return NextResponse.json({
            keyFound: true,
            rawFirstChars: JSON.stringify(privateKey.substring(0, 60)),
            rawLastChars: JSON.stringify(privateKey.substring(privateKey.length - 60)),
            length: privateKey.length,
            hasLiteralNewlineEscape: privateKey.includes('\\n'),
            hasActualNewline: privateKey.includes('\n'),
            charCodes: [...privateKey.substring(0, 5)].map((c: string) => c.charCodeAt(0)),
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
