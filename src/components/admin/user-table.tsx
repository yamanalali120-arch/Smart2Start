"use client";

import type { Profile } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { getLevelInfo } from "@/lib/xp";
import { Zap, Trophy } from "lucide-react";

interface UserTableProps {
  users: Profile[];
}

export function UserTable({ users }: UserTableProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground p-4">Name</th>
                <th className="text-left text-xs font-semibold text-muted-foreground p-4">Username</th>
                <th className="text-left text-xs font-semibold text-muted-foreground p-4">Rolle</th>
                <th className="text-left text-xs font-semibold text-muted-foreground p-4">Level</th>
                <th className="text-left text-xs font-semibold text-muted-foreground p-4">XP</th>
                <th className="text-left text-xs font-semibold text-muted-foreground p-4">Erstellt</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const levelInfo = getLevelInfo(user.total_xp);
                return (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green-100 text-brand-green-700 text-sm font-bold">
                          {user.display_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">{user.display_name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{user.username}</td>
                    <td className="p-4">
                      <Badge variant={user.role === "admin" ? "default" : "outline"} className="text-xs">
                        {user.role === "admin" ? "Admin" : "Lernender"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Trophy size={14} className="text-brand-green-500" />
                        {levelInfo.level}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Zap size={14} className="text-yellow-500" />
                        {user.total_xp}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatDate(user.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y">
          {users.map((user) => {
            const levelInfo = getLevelInfo(user.total_xp);
            return (
              <div key={user.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green-100 text-brand-green-700 text-sm font-bold">
                      {user.display_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.display_name}</p>
                      <p className="text-xs text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                  <Badge variant={user.role === "admin" ? "default" : "outline"} className="text-xs">
                    {user.role === "admin" ? "Admin" : "Lernender"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Trophy size={12} className="text-brand-green-500" />
                    Level {levelInfo.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap size={12} className="text-yellow-500" />
                    {user.total_xp} XP
                  </span>
                  <span>{formatDate(user.created_at)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {users.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Noch keine Benutzer vorhanden.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
