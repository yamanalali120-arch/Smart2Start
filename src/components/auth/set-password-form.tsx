"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { setPasswordSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";

export function SetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = setPasswordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Passwort erfolgreich gesetzt! 🎉");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (): { label: string; color: string; width: string } => {
    if (password.length === 0) return { label: "", color: "", width: "0%" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Schwach", color: "bg-red-500", width: "25%" };
    if (score === 2) return { label: "Mittel", color: "bg-orange-500", width: "50%" };
    if (score === 3) return { label: "Gut", color: "bg-yellow-500", width: "75%" };
    return { label: "Stark", color: "bg-green-500", width: "100%" };
  };

  const strength = getPasswordStrength();

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Neues Passwort setzen</CardTitle>
        <CardDescription>
          Wähle ein sicheres Passwort für deinen Account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Neues Passwort</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mindestens 8 Zeichen"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={errors.password ? "border-destructive pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Strength indicator */}
            {password.length > 0 && (
              <div className="space-y-1">
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                    style={{ width: strength.width }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{strength.label}</p>
              </div>
            )}
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Passwort wiederholen"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
              />
              {confirmPassword && confirmPassword === password && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Requirements */}
          <div className="rounded-lg bg-muted/50 p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Anforderungen:</p>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              <li className={password.length >= 8 ? "text-green-600" : ""}>
                {password.length >= 8 ? "✓" : "○"} Mindestens 8 Zeichen
              </li>
              <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
                {/[A-Z]/.test(password) ? "✓" : "○"} Mindestens ein Großbuchstabe
              </li>
              <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>
                {/[0-9]/.test(password) ? "✓" : "○"} Mindestens eine Zahl
              </li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-green-500 hover:bg-brand-green-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Speichern...
              </>
            ) : (
              "Passwort setzen"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
