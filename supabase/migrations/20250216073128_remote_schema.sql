create table "public"."avatars" (
    "avatar_id" text not null,
    "name" text,
    "gender" text,
    "created_at" timestamp with time zone not null default now(),
    "description" text,
    "image_url" text
);


alter table "public"."avatars" enable row level security;

alter table "public"."influencers" add column "avatar_id" text;

alter table "public"."influencers" add column "image_url" text;

alter table "public"."influencers" add column "voice_id" text;

alter table "public"."research" add column "product_image_url" text;

alter table "public"."research" add column "product_info" jsonb;

alter table "public"."research" add column "selected_influencer" uuid;

alter table "public"."scripts" alter column "b_roll_used" set data type text[] using "b_roll_used"::text[];

CREATE UNIQUE INDEX avatars_pkey ON public.avatars USING btree (avatar_id);

alter table "public"."avatars" add constraint "avatars_pkey" PRIMARY KEY using index "avatars_pkey";

alter table "public"."research" add constraint "research_selected_influencer_fkey" FOREIGN KEY (selected_influencer) REFERENCES influencers(id) not valid;

alter table "public"."research" validate constraint "research_selected_influencer_fkey";

grant delete on table "public"."avatars" to "anon";

grant insert on table "public"."avatars" to "anon";

grant references on table "public"."avatars" to "anon";

grant select on table "public"."avatars" to "anon";

grant trigger on table "public"."avatars" to "anon";

grant truncate on table "public"."avatars" to "anon";

grant update on table "public"."avatars" to "anon";

grant delete on table "public"."avatars" to "authenticated";

grant insert on table "public"."avatars" to "authenticated";

grant references on table "public"."avatars" to "authenticated";

grant select on table "public"."avatars" to "authenticated";

grant trigger on table "public"."avatars" to "authenticated";

grant truncate on table "public"."avatars" to "authenticated";

grant update on table "public"."avatars" to "authenticated";

grant delete on table "public"."avatars" to "service_role";

grant insert on table "public"."avatars" to "service_role";

grant references on table "public"."avatars" to "service_role";

grant select on table "public"."avatars" to "service_role";

grant trigger on table "public"."avatars" to "service_role";

grant truncate on table "public"."avatars" to "service_role";

grant update on table "public"."avatars" to "service_role";


