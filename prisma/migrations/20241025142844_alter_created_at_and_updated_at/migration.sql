-- Rename the existing columns instead of dropping them
ALTER TABLE "Product" RENAME COLUMN "createdAt" TO "created_at_old";
ALTER TABLE "Product" RENAME COLUMN "updatedAt" TO "updated_at_old";

-- Add the new columns with default values
ALTER TABLE "Product" 
    ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Migrate data from the old columns to the new columns
UPDATE "Product" 
    SET "created_at" = "created_at_old",
        "updated_at" = "updated_at_old";

-- Drop the old columns after migrating the data
ALTER TABLE "Product" 
    DROP COLUMN "created_at_old",
    DROP COLUMN "updated_at_old";
