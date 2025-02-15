
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."update_b_roll_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_b_roll_updated_at"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_research_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_research_updated_at"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_scripts_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_scripts_updated_at"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."b_roll" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_link" "text" NOT NULL,
    "description" "text",
    "video_link" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."b_roll" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."influencers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "tiktok_profile_link" "text",
    "influencer_research" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."influencers" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."research" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_link" "text" NOT NULL,
    "customer_profile" "jsonb",
    "customer_intent" "jsonb",
    "product_research" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."research" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."scripts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "influencer_id" "uuid" NOT NULL,
    "product_link" "text" NOT NULL,
    "script_reasoning" "text",
    "full_script" "text",
    "structured_script" "jsonb"[],
    "raw_video_link" "text",
    "b_roll_used" "uuid"[],
    "cartesia_voice_id" "text",
    "processed_video_link" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."scripts" OWNER TO "postgres";

ALTER TABLE ONLY "public"."b_roll"
    ADD CONSTRAINT "b_roll_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."influencers"
    ADD CONSTRAINT "influencers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."research"
    ADD CONSTRAINT "research_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."scripts"
    ADD CONSTRAINT "scripts_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE TRIGGER "trigger_update_b_roll_updated_at" BEFORE UPDATE ON "public"."b_roll" FOR EACH ROW EXECUTE FUNCTION "public"."update_b_roll_updated_at"();

CREATE OR REPLACE TRIGGER "trigger_update_research_updated_at" BEFORE UPDATE ON "public"."research" FOR EACH ROW EXECUTE FUNCTION "public"."update_research_updated_at"();

CREATE OR REPLACE TRIGGER "trigger_update_scripts_updated_at" BEFORE UPDATE ON "public"."scripts" FOR EACH ROW EXECUTE FUNCTION "public"."update_scripts_updated_at"();

CREATE OR REPLACE TRIGGER "trigger_update_updated_at" BEFORE UPDATE ON "public"."influencers" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

ALTER TABLE ONLY "public"."scripts"
    ADD CONSTRAINT "scripts_influencer_id_fkey" FOREIGN KEY ("influencer_id") REFERENCES "public"."influencers"("id") ON DELETE CASCADE;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."update_b_roll_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_b_roll_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_b_roll_updated_at"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_research_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_research_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_research_updated_at"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_scripts_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_scripts_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_scripts_updated_at"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";

GRANT ALL ON TABLE "public"."b_roll" TO "anon";
GRANT ALL ON TABLE "public"."b_roll" TO "authenticated";
GRANT ALL ON TABLE "public"."b_roll" TO "service_role";

GRANT ALL ON TABLE "public"."influencers" TO "anon";
GRANT ALL ON TABLE "public"."influencers" TO "authenticated";
GRANT ALL ON TABLE "public"."influencers" TO "service_role";

GRANT ALL ON TABLE "public"."research" TO "anon";
GRANT ALL ON TABLE "public"."research" TO "authenticated";
GRANT ALL ON TABLE "public"."research" TO "service_role";

GRANT ALL ON TABLE "public"."scripts" TO "anon";
GRANT ALL ON TABLE "public"."scripts" TO "authenticated";
GRANT ALL ON TABLE "public"."scripts" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
