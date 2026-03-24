import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  cleanupExpiredTemplateDrafts,
  deleteSiteAssetsFromPayload,
  getTemplateDraftExpiryIso,
} from "@/lib/template-drafts";

type Role = "admin" | "sub_admin" | "client";

interface AdminUser {
  id: string;
  role: Role;
}

type DbErrorLike = {
  code?: string;
  message?: string;
};

function hasDbCode(error: unknown, code: string): boolean {
  const value = error as DbErrorLike | null;
  return value?.code === code;
}

function isMissingExpiresColumnError(error: unknown): boolean {
  const value = error as DbErrorLike | null;
  const msg = (value?.message ?? "").toLowerCase();
  return (
    hasDbCode(error, "42703") ||
    hasDbCode(error, "PGRST204") ||
    (msg.includes("expires_at") && (msg.includes("column") || msg.includes("schema cache")))
  );
}

function isTemplateDraftsTableMissingError(error: unknown): boolean {
  const value = error as DbErrorLike | null;
  const msg = (value?.message ?? "").toLowerCase();
  return (
    hasDbCode(error, "42P01") ||
    hasDbCode(error, "PGRST205") ||
    (msg.includes("template_drafts") &&
      (
        msg.includes("does not exist") ||
        msg.includes("relation") ||
        msg.includes("schema cache") ||
        msg.includes("not find")
      ))
  );
}

function isIgnorableCleanupWarning(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("expires_at") ||
    (lower.includes("template_drafts") &&
      (lower.includes("schema cache") || lower.includes("does not exist") || lower.includes("not find")))
  );
}

async function requireAdmin(): Promise<AdminUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "sub_admin"].includes(profile.role)) return null;
  return { id: user.id, role: profile.role as Role };
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const service = createServiceClient();
  const query = await service
    .from("template_drafts")
    .select("id,label,payload,created_at,updated_at,expires_at")
    .gt("expires_at", new Date().toISOString())
    .order("updated_at", { ascending: false })
    .limit(100);

  if (!query.error) {
    const cleanup = await cleanupExpiredTemplateDrafts(service);
    if (cleanup.errors.length > 0 && !cleanup.errors.every(isIgnorableCleanupWarning)) {
      console.error("template draft cleanup warnings:", cleanup.errors);
    }
    return NextResponse.json(query.data ?? []);
  }

  if (isTemplateDraftsTableMissingError(query.error)) {
    return NextResponse.json([]);
  }

  if (isMissingExpiresColumnError(query.error)) {
    const fallback = await service
      .from("template_drafts")
      .select("id,label,payload,created_at,updated_at")
      .order("updated_at", { ascending: false })
      .limit(100);

    if (fallback.error) {
      if (isTemplateDraftsTableMissingError(fallback.error)) {
        return NextResponse.json([]);
      }
      return NextResponse.json({ error: fallback.error.message }, { status: 400 });
    }

    const now = Date.now();
    const rows = (fallback.data ?? [])
      .map((row: any) => {
        const base =
          row?.updated_at && !Number.isNaN(Date.parse(row.updated_at))
            ? new Date(row.updated_at)
            : row?.created_at && !Number.isNaN(Date.parse(row.created_at))
              ? new Date(row.created_at)
              : new Date();
        return {
          ...row,
          expires_at: getTemplateDraftExpiryIso(base),
        };
      })
      .filter((row: any) => Date.parse(row.expires_at) > now);

    return NextResponse.json(rows);
  }

  console.error("template_drafts GET fallback-to-empty:", query.error);
  return NextResponse.json([]);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const rawLabel = typeof body?.label === "string" ? body.label.trim() : "";
  const label = rawLabel || "Untitled Working Draft";
  const payload = body?.payload;

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const service = createServiceClient();
  const withExpiry = await service
    .from("template_drafts")
    .insert({
      label,
      payload,
      created_by: admin.id,
      expires_at: getTemplateDraftExpiryIso(),
    })
    .select("id,label,payload,created_at,updated_at,expires_at")
    .single();

  if (!withExpiry.error) return NextResponse.json(withExpiry.data);

  if (isTemplateDraftsTableMissingError(withExpiry.error)) {
    return NextResponse.json(
      { error: "template_drafts table is missing. Run migrations 013 and 014." },
      { status: 400 }
    );
  }

  if (!isMissingExpiresColumnError(withExpiry.error)) {
    return NextResponse.json({ error: withExpiry.error.message }, { status: 400 });
  }

  const fallback = await service
    .from("template_drafts")
    .insert({
      label,
      payload,
      created_by: admin.id,
    })
    .select("id,label,payload,created_at,updated_at")
    .single();

  if (fallback.error) return NextResponse.json({ error: fallback.error.message }, { status: 400 });

  const base =
    fallback.data?.updated_at && !Number.isNaN(Date.parse(fallback.data.updated_at))
      ? new Date(fallback.data.updated_at)
      : fallback.data?.created_at && !Number.isNaN(Date.parse(fallback.data.created_at))
        ? new Date(fallback.data.created_at)
        : new Date();

  return NextResponse.json({
    ...fallback.data,
    expires_at: getTemplateDraftExpiryIso(base),
  });
}

export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (typeof body?.label === "string") {
    const trimmed = body.label.trim();
    if (!trimmed) return NextResponse.json({ error: "Label cannot be empty" }, { status: 400 });
    update.label = trimmed;
  }

  if (body?.payload !== undefined) {
    if (!body.payload || typeof body.payload !== "object" || Array.isArray(body.payload)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    update.payload = body.payload;
  }

  const service = createServiceClient();
  const withExpiry = await service
    .from("template_drafts")
    .update(update)
    .eq("id", id)
    .select("id,label,payload,created_at,updated_at,expires_at")
    .single();

  if (!withExpiry.error) return NextResponse.json(withExpiry.data);

  if (isMissingExpiresColumnError(withExpiry.error)) {
    const fallback = await service
      .from("template_drafts")
      .update(update)
      .eq("id", id)
      .select("id,label,payload,created_at,updated_at")
      .single();

    if (fallback.error) return NextResponse.json({ error: fallback.error.message }, { status: 400 });

    const base =
      fallback.data?.updated_at && !Number.isNaN(Date.parse(fallback.data.updated_at))
        ? new Date(fallback.data.updated_at)
        : fallback.data?.created_at && !Number.isNaN(Date.parse(fallback.data.created_at))
          ? new Date(fallback.data.created_at)
          : new Date();

    return NextResponse.json({
      ...fallback.data,
      expires_at: getTemplateDraftExpiryIso(base),
    });
  }

  if (isTemplateDraftsTableMissingError(withExpiry.error)) {
    return NextResponse.json(
      { error: "template_drafts table is missing. Run migrations 013 and 014." },
      { status: 400 }
    );
  }

  return NextResponse.json({ error: withExpiry.error.message }, { status: 400 });
}

export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const service = createServiceClient();
  const { data: draft, error: fetchErr } = await service
    .from("template_drafts")
    .select("id,payload")
    .eq("id", id)
    .single();

  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 400 });

  await deleteSiteAssetsFromPayload(service, draft?.payload, draft?.id);

  const { error } = await service.from("template_drafts").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
