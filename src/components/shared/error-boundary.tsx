"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertTriangle size={40} className="text-destructive mb-4" />
            <h3 className="text-lg font-semibold">Etwas ist schiefgelaufen</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Bitte versuche es erneut oder lade die Seite neu.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => this.setState({ hasError: false })}
            >
              Erneut versuchen
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
