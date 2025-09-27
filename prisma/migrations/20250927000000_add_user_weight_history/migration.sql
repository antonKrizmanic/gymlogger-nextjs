-- CreateTable
CREATE TABLE "UserWeight" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "weight" DECIMAL(18,6) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_UserWeights" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserWeight" ADD CONSTRAINT "FK_UserWeights_Users_UserId" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- CreateIndex
CREATE INDEX "IX_UserWeights_UserId_CreatedAt" ON "UserWeight"("userId", "createdAt");


