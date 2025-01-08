-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('INDIVIDUAL', 'ADMIN', 'CURATOR');

-- CreateEnum
CREATE TYPE "ProjectTagStatus" AS ENUM ('PUBLISHED', 'IN_REVIEW', 'DRAFT', 'COMPLETED', 'ONGOING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "email" TEXT NOT NULL,
    "githubUsername" TEXT,
    "githubProfileUrl" TEXT,
    "githubAvatarUrl" TEXT,
    "githubAccessToken" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'INDIVIDUAL',
    "rank" INTEGER NOT NULL DEFAULT 0,
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "problemStatement" TEXT,
    "githubUrl" TEXT,
    "demoUrl" TEXT,
    "techStack" TEXT[],
    "imageUrl" TEXT,
    "status" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "keyFeatures" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "status" "ProjectTagStatus",
    "conference" TEXT,
    "date" TIMESTAMP(3),
    "competition" TEXT,
    "projectId" TEXT NOT NULL,
    "curatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "ProjectUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingProjectUser" (
    "id" TEXT NOT NULL,
    "githubUsername" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "PendingProjectUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectImage" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectResource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotingStatus" (
    "id" TEXT NOT NULL DEFAULT 'voting_status',
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VotingStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_githubUsername_key" ON "User"("githubUsername");

-- CreateIndex
CREATE UNIQUE INDEX "Project_githubUrl_key" ON "Project"("githubUrl");

-- CreateIndex
CREATE INDEX "ProjectTag_curatorId_idx" ON "ProjectTag"("curatorId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTag_projectId_name_key" ON "ProjectTag"("projectId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectUser_userId_projectId_key" ON "ProjectUser"("userId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "PendingProjectUser_githubUsername_projectId_key" ON "PendingProjectUser"("githubUsername", "projectId");

-- CreateIndex
CREATE INDEX "ProjectImage_projectId_idx" ON "ProjectImage"("projectId");

-- CreateIndex
CREATE INDEX "ProjectResource_projectId_idx" ON "ProjectResource"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_projectId_userEmail_key" ON "Vote"("projectId", "userEmail");

-- AddForeignKey
ALTER TABLE "ProjectTag" ADD CONSTRAINT "ProjectTag_curatorId_fkey" FOREIGN KEY ("curatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTag" ADD CONSTRAINT "ProjectTag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUser" ADD CONSTRAINT "ProjectUser_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUser" ADD CONSTRAINT "ProjectUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingProjectUser" ADD CONSTRAINT "PendingProjectUser_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResource" ADD CONSTRAINT "ProjectResource_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

