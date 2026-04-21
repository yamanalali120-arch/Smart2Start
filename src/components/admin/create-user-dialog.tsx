"use client";

import { useState } from "react";
import { createUser } from "@/actions/auth";
import { createUserSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    displayName: "",
    email: "",
    role: "learner" as "admin" | "learner",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = createUserSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await createUser(form);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.message);
        setOpen(false);
        setForm({ username: "", displayName: "", email: "", role: "learner" });
      }
    } catch {
      toast.error("Ein Fehler ist aufgetreten.");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate username from display name
  const handleNameChange = (name: string) => {
    setForm((prev) => ({ ...prev, displayName: name }));
    const parts = name
      .toLowerCase()
      .replace(/[^a-zäöüß\s]/g, "")
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .trim()
      .split(/\s+/);
    if (parts.length >= 2) {
      setForm((prev) => ({
        ...prev,
        displayName: name,
        username: `${parts[0]}.${parts[parts.length - 1]}.brillee`,
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-green-500 hover:bg-brand-green-600 text-white">
          <UserPlus size={16} className="mr-2" />
          Benutzer anlegen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neuen Benutzer anlegen</DialogTitle>
          <DialogDescription>
            Der Benutzer erhält eine E-Mail zum Setzen seines Passworts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Vollständiger Name</Label>
            <Input
              id="displayName"
              placeholder="Max Mustermann"
              value={form.displayName}
              onChange={(e) => handleNameChange(e.target.value)}
              disabled={isLoading}
              className={errors.displayName ? "border-destructive" : ""}
            />
            {errors.displayName && (
              <p className="text-xs text-destructive">{errors.displayName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="max.mustermann.brillee"
              value={form.username}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, username: e.target.value }))
              }
              disabled={isLoading}
              className={errors.username ? "border-destructive" : ""}
            />
            {errors.username && (
              <p className="text-xs text-destructive">{errors.username}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Format: vorname.nachname.brillee
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-Mail-Adresse</Label>
            <Input
              id="email"
              type="email"
              placeholder="max.mustermann@Brillen-Optiker-Academy.de"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              disabled={isLoading}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Rolle</Label>
            <Select
              value={form.role}
              onValueChange={(value: "admin" | "learner") =>
                setForm((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="learner">Lernender</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button
              type="submit"
              className="bg-brand-green-500 hover:bg-brand-green-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Erstellen...
                </>
              ) : (
                "Benutzer erstellen"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
