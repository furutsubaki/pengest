drop index if exists "public"."Images_src_key";

alter table "public"."Image" drop column "src";

alter table "public"."Image" add column "originalSrc" text not null;

alter table "public"."Post_Image" alter column "id" set default 'replace(replace(replace(encode(uuid_send(uuid_generate_v4()), ''base64''), ''=='', ''''), ''+'', ''''), ''/'', '''')'::text;

CREATE UNIQUE INDEX "Image_originalSrc_key" ON public."Image" USING btree ("originalSrc");

alter table "public"."Image" add constraint "Image_originalSrc_key" UNIQUE using index "Image_originalSrc_key";


