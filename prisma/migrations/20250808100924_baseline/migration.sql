-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "auth0_id" TEXT,
    "picture" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "age" INTEGER,
    "job" TEXT,
    "hobby" TEXT,
    "residence" TEXT,
    "work_place" TEXT,
    "blood_type" TEXT,
    "education" TEXT,
    "work_type" TEXT,
    "holiday" TEXT,
    "marriage_history" TEXT,
    "has_children" TEXT,
    "smoking" TEXT,
    "drinking" TEXT,
    "living_with" TEXT,
    "marriage_intention" TEXT,
    "self_introduction" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "targets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "age" INTEGER,
    "job" TEXT,
    "hobby" TEXT,
    "residence" TEXT,
    "work_place" TEXT,
    "blood_type" TEXT,
    "education" TEXT,
    "work_type" TEXT,
    "holiday" TEXT,
    "marriage_history" TEXT,
    "has_children" TEXT,
    "smoking" TEXT,
    "drinking" TEXT,
    "living_with" TEXT,
    "marriage_intention" TEXT,
    "self_introduction" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "target_id" INTEGER NOT NULL,
    "female_message" TEXT NOT NULL,
    "male_reply" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_auth0_id_key" ON "users"("auth0_id");

-- AddForeignKey
ALTER TABLE "targets" ADD CONSTRAINT "targets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "targets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

