import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { UserTable } from "@/components/admin/user-table";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";

export const metadata = { title: "Benutzer – Admin – Brillen Optiker Academy" };

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Benutzerverwaltung"
        description="Verwalte die Nutzer der Lernplattform."
        action={<CreateUserDialog />}
      />
      <UserTable users={users || []} />
    </div>
  );
}
