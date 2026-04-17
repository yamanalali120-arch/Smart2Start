"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { resetPasswordSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";

export function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = resetPasswordSchema.safeParse({ email });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/set-password`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsSent(true);
      toast.success("Link zum Zurücksetzen wurde gesendet!");
    } catch {
      toast.error("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <Card className="shadow-xl border-0">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-7 w-7 text-brand-green-500" />
          </div>
          <h2 className="text-lg font-semibold">E-Mail gesendet!</h2>
          <p className="text-sm text-muted-foreground">
            Wir haben dir einen Link zum Zurücksetzen deines Passworts an{" "}
            <strong>{email}</strong> gesendet. Bitte prüfe auch deinen Spam-Ordner.
          </p>
          <Link href="/login">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zum Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Passwort zurücksetzen</CardTitle>
        <CardDescription>
          Gib deine E-Mail-Adresse ein und wir senden dir einen Link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail-Adresse</Label>
            <Input
              id="email"
              type="email"
              placeholder="vorname.nachname@brillen.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-green-500 hover:bg-brand-green-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Senden...
              </>
            ) : (
              "Link senden"
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-brand-green-500 hover:text-brand-green-600 transition-colors"
            >
              <ArrowLeft className="mr-1 inline h-3 w-3" />
              Zurück zum Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
