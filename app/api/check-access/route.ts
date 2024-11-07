import { NextResponse } from 'next/server';

const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(',') || [];

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return new NextResponse('Email is required', { status: 400 });
        }

        const isAllowed = ALLOWED_EMAILS.includes(email.toLowerCase());

        if (!isAllowed) {
            return new NextResponse('Access denied', { status: 403 });
        }

        return new NextResponse('Access granted', { status: 200 });

    } catch (error) {
        console.error('Error in check-access:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
} 