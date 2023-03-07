create extension if not exists "moddatetime" with schema "extensions";


create table "public"."Follower" (
    "followerId" text not null,
    "followedId" text not null,
    "createdAt" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "id" text default replace(replace(replace(encode(uuid_send(uuid_generate_v4()), 'base64'::text), '=='::text, ''::text), '+'::text, ''::text), '/'::text, ''::text)
);


create table "public"."Image" (
    "id" text not null default replace(replace(replace(encode(uuid_send(uuid_generate_v4()), 'base64'::text), '=='::text, ''::text), '+'::text, ''::text), '/'::text, ''::text),
    "src" text not null,
    "createdAt" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "postId" text not null
);


create table "public"."Likes" (
    "postId" text not null,
    "userId" text not null,
    "createdAt" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "id" text not null default replace(replace(replace(encode(uuid_send(uuid_generate_v4()), 'base64'::text), '=='::text, ''::text), '+'::text, ''::text), '/'::text, ''::text)
);


create table "public"."Post" (
    "id" text not null default replace(replace(replace(encode(uuid_send(uuid_generate_v4()), 'base64'::text), '=='::text, ''::text), '+'::text, ''::text), '/'::text, ''::text),
    "text" text not null,
    "parentPostId" text,
    "createdAt" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "userId" text not null
);


create table "public"."Profile" (
    "id" text not null default replace(replace(replace(encode(uuid_send(uuid_generate_v4()), 'base64'::text), '=='::text, ''::text), '+'::text, ''::text), '/'::text, ''::text),
    "screenName" text not null default replace(replace(replace(encode(uuid_send(uuid_generate_v4()), 'base64'::text), '=='::text, ''::text), '+'::text, ''::text), '/'::text, ''::text),
    "name" text not null,
    "createdAt" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "userId" text not null,
    "icon" text not null,
    "detail" text not null default ''::text,
    "linkHome" text not null default ''::text,
    "linkGithub" text not null default ''::text,
    "linkPixiv" text not null default ''::text,
    "linkTwitter" text not null default ''::text,
    "headerImage" text not null default ''::text
);


create table "public"."Repost" (
    "id" text not null default replace(replace(replace(encode(uuid_send(uuid_generate_v4()), 'base64'::text), '=='::text, ''::text), '+'::text, ''::text), '/'::text, ''::text),
    "postId" text not null,
    "userId" text,
    "createdAt" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(6) with time zone default CURRENT_TIMESTAMP
);


create table "public"."Setting" (
    "id" text not null default replace(replace(replace(encode(uuid_send(uuid_generate_v4()), 'base64'::text), '=='::text, ''::text), '+'::text, ''::text), '/'::text, ''::text),
    "createdAt" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "userId" text not null,
    "language" text not null default ''::text
);


create table "public"."User" (
    "id" text not null default replace(replace(replace(encode(uuid_send(uuid_generate_v4()), 'base64'::text), '=='::text, ''::text), '+'::text, ''::text), '/'::text, ''::text),
    "authId" uuid not null,
    "createdAt" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "deactivateAt" timestamp(6) with time zone,
    "freezeAt" timestamp(6) with time zone
);


CREATE UNIQUE INDEX "Follower2_pkey" ON public."Follower" USING btree ("followerId", "followedId");

CREATE UNIQUE INDEX "Images_id_key" ON public."Image" USING btree (id);

CREATE UNIQUE INDEX "Images_pkey" ON public."Image" USING btree (id);

CREATE UNIQUE INDEX "Images_src_key" ON public."Image" USING btree (src);

CREATE UNIQUE INDEX "Likes_pkey" ON public."Likes" USING btree (id);

CREATE UNIQUE INDEX "Posts_id_key" ON public."Post" USING btree (id);

CREATE UNIQUE INDEX "Posts_pkey" ON public."Post" USING btree (id);

CREATE UNIQUE INDEX "Profile_id_key" ON public."Profile" USING btree (id);

CREATE UNIQUE INDEX "Profile_pkey" ON public."Profile" USING btree (id);

CREATE UNIQUE INDEX "Profile_screenName_key" ON public."Profile" USING btree ("screenName");

CREATE UNIQUE INDEX "Profile_userId_key" ON public."Profile" USING btree ("userId");

CREATE UNIQUE INDEX "Repost_pkey" ON public."Repost" USING btree (id);

CREATE UNIQUE INDEX "Setting_id_key" ON public."Setting" USING btree (id);

CREATE UNIQUE INDEX "Setting_pkey" ON public."Setting" USING btree (id);

CREATE UNIQUE INDEX "Setting_userId_key" ON public."Setting" USING btree ("userId");

CREATE UNIQUE INDEX "User_pkey" ON public."User" USING btree (id);

CREATE UNIQUE INDEX "Users_id_key" ON public."User" USING btree (id);

alter table "public"."Follower" add constraint "Follower2_pkey" PRIMARY KEY using index "Follower2_pkey";

alter table "public"."Image" add constraint "Images_pkey" PRIMARY KEY using index "Images_pkey";

alter table "public"."Likes" add constraint "Likes_pkey" PRIMARY KEY using index "Likes_pkey";

alter table "public"."Post" add constraint "Posts_pkey" PRIMARY KEY using index "Posts_pkey";

alter table "public"."Profile" add constraint "Profile_pkey" PRIMARY KEY using index "Profile_pkey";

alter table "public"."Repost" add constraint "Repost_pkey" PRIMARY KEY using index "Repost_pkey";

alter table "public"."Setting" add constraint "Setting_pkey" PRIMARY KEY using index "Setting_pkey";

alter table "public"."User" add constraint "User_pkey" PRIMARY KEY using index "User_pkey";

alter table "public"."Follower" add constraint "Follower_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "User"(id) not valid;

alter table "public"."Follower" validate constraint "Follower_followedId_fkey";

alter table "public"."Follower" add constraint "Follower_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"(id) not valid;

alter table "public"."Follower" validate constraint "Follower_followerId_fkey";

alter table "public"."Image" add constraint "Image_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"(id) not valid;

alter table "public"."Image" validate constraint "Image_postId_fkey";

alter table "public"."Likes" add constraint "Likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"(id) not valid;

alter table "public"."Likes" validate constraint "Likes_postId_fkey";

alter table "public"."Likes" add constraint "Likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) not valid;

alter table "public"."Likes" validate constraint "Likes_userId_fkey";

alter table "public"."Post" add constraint "Post_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "Post"(id) not valid;

alter table "public"."Post" validate constraint "Post_parentPostId_fkey";

alter table "public"."Post" add constraint "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) not valid;

alter table "public"."Post" validate constraint "Post_userId_fkey";

alter table "public"."Profile" add constraint "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) not valid;

alter table "public"."Profile" validate constraint "Profile_userId_fkey";

alter table "public"."Repost" add constraint "Repost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"(id) not valid;

alter table "public"."Repost" validate constraint "Repost_postId_fkey";

alter table "public"."Repost" add constraint "Repost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) not valid;

alter table "public"."Repost" validate constraint "Repost_userId_fkey";

alter table "public"."Setting" add constraint "Setting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) not valid;

alter table "public"."Setting" validate constraint "Setting_userId_fkey";

alter table "public"."User" add constraint "User_authId_fkey" FOREIGN KEY ("authId") REFERENCES auth.users(id) not valid;

alter table "public"."User" validate constraint "User_authId_fkey";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public."Follower" FOR EACH ROW EXECUTE FUNCTION moddatetime('updatedAt');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public."Image" FOR EACH ROW EXECUTE FUNCTION moddatetime('updatedAt');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public."Likes" FOR EACH ROW EXECUTE FUNCTION moddatetime('updatedAt');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public."Post" FOR EACH ROW EXECUTE FUNCTION moddatetime('updatedAt');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public."Profile" FOR EACH ROW EXECUTE FUNCTION moddatetime('updatedAt');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public."Repost" FOR EACH ROW EXECUTE FUNCTION moddatetime('updatedAt');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public."Setting" FOR EACH ROW EXECUTE FUNCTION moddatetime('updatedAt');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public."User" FOR EACH ROW EXECUTE FUNCTION moddatetime('updatedAt');
