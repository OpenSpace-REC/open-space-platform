import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        console.log(reqBody);

        const { googleId, name, email } = reqBody;

        // Check platform access restrictions
        const settings = await prisma.settings.findUnique({
            where: { id: 'app_settings' }
        });

        if (settings?.adminOnlyAccess) {
            const allowedEmails = process.env.ALLOWED_USERS?.split(',') || [];
            const existingUser = await prisma.user.findUnique({
                where: { email },
                select: { role: true }
            });

            // Allow access if user is either admin or in allowlist
            if (!allowedEmails.includes(email) && existingUser?.role !== 'ADMIN') {
                return NextResponse.json(
                    { message: "Platform access restricted" }, 
                    { status: 403 }
                );
            }
        }

        // Check if user exists with full profile
        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { 
                role: true,
                githubUsername: true,
                githubProfileUrl: true,
                githubAvatarUrl: true
            }
        });

        if (existingUser) {
            
            if (!existingUser.githubUsername || !existingUser.githubProfileUrl || !existingUser.githubAvatarUrl) {
                
                return NextResponse.json(
                    { message: "GitHub data missing, redirecting to GitHub link" }, 
                    { status: 302, }
                );
            }

           
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
