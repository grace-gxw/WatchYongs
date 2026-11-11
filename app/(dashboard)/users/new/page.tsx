"use client";

import { useRouter } from "next/navigation";
import { UserCog } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateUserForm } from "@/components/users/CreateUserForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default function NewUserPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader
        back={{ href: "/users", label: "Staff" }}
        title="Staff Baru"
        description="Buat akun login baru untuk staff yang bekerja di toko."
      />
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted">
              <UserCog className="size-5" />
            </span>
            <div>
              <CardTitle>Akun Staff</CardTitle>
              <CardDescription>Password minimal 8 karakter.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CreateUserForm
            onSuccess={() => {
              router.push("/users");
              router.refresh();
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
