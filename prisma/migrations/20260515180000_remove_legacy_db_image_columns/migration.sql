-- Remove armazenamento legado de imagens na BD (avatar/capa); usar apenas URLs (ex.: Vercel Blob).

ALTER TABLE "Profile" DROP COLUMN IF EXISTS "avatarImage";
ALTER TABLE "Profile" DROP COLUMN IF EXISTS "avatarMime";
ALTER TABLE "Profile" DROP COLUMN IF EXISTS "hasStoredAvatar";

ALTER TABLE "Project" DROP COLUMN IF EXISTS "coverImage";
ALTER TABLE "Project" DROP COLUMN IF EXISTS "coverMime";
ALTER TABLE "Project" DROP COLUMN IF EXISTS "hasStoredCover";
