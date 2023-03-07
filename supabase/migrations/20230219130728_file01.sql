alter table "public"."Image" drop constraint "Image_postId_fkey";

create table "public"."Post_Image" (
    "id" text not null default 'replace(replace(replace(encode(uuid_send(uuid_generate_v4()), ''base64''::text), ''==''::text, ''''::text), ''+''::text, ''''::text), ''/''::text, ''''::text)'::text,
    "postId" text not null,
    "imageId" text not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."Post_Image" enable row level security;

alter table "public"."Image" drop column "postId";

alter table "public"."Image" add column "userId" text;

CREATE UNIQUE INDEX "Post_Image_pkey" ON public."Post_Image" USING btree ("postId", "imageId");

CREATE UNIQUE INDEX "User_authId_key" ON public."User" USING btree ("authId");

alter table "public"."Post_Image" add constraint "Post_Image_pkey" PRIMARY KEY using index "Post_Image_pkey";

alter table "public"."Image" add constraint "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) not valid;

alter table "public"."Image" validate constraint "Image_userId_fkey";

alter table "public"."Post_Image" add constraint "Post_Image_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"(id) not valid;

alter table "public"."Post_Image" validate constraint "Post_Image_imageId_fkey";

alter table "public"."Post_Image" add constraint "Post_Image_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"(id) not valid;

alter table "public"."Post_Image" validate constraint "Post_Image_postId_fkey";

alter table "public"."User" add constraint "User_authId_key" UNIQUE using index "User_authId_key";


create policy "all 1ufimg_0"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'users'::text));


create policy "all 1ufimg_1"
on "storage"."objects"
as permissive
for update
to authenticated
using ((bucket_id = 'users'::text));


create policy "all 1ufimg_2"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'users'::text));


create policy "all 1ufimg_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using ((bucket_id = 'users'::text));
