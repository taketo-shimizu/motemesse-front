-- AlterTable
ALTER TABLE "users" ADD COLUMN     "recent_target_id" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_recent_target_id_fkey" FOREIGN KEY ("recent_target_id") REFERENCES "targets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
