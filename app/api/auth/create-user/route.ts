import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust the path as necessary

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        console.log(reqBody);

       
        const { googleId, name, email} = reqBody;

        
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

        const newUser = await prisma.user.create({
            data: {
                googleId,
                name,
                email,
            },
        });

        return NextResponse.json({ message: "User created successfully", data: newUser }, { status: 201 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ message: "Error processing request" }, { status: 500 });
    }
}
