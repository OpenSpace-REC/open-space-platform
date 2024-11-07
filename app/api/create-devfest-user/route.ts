import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, googleId } = body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        // Create new user with minimal required fields
        const user = await prisma.user.create({
            data: {
                name,
                email,
                googleId,
                githubUsername: `temp_${googleId}`, // Temporary username to satisfy the unique constraint
                role: "INDIVIDUAL",
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        );
    }
} 