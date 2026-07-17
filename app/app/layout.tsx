import { ToastProvider } from "@/components/ui";
import { Shell } from "@/components/Shell";
import { AuthGate } from "@/components/AuthGate";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthGate>
        <Shell>{children}</Shell>
      </AuthGate>
    </ToastProvider>
  );
}
