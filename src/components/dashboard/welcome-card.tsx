interface WelcomeCardProps {
  displayName: string;
}

export function WelcomeCard({ displayName }: WelcomeCardProps) {
  const hour = new Date().getHours();
  let greeting = "Guten Morgen";
  if (hour >= 12 && hour < 18) greeting = "Guten Tag";
  if (hour >= 18) greeting = "Guten Abend";

  return (
    <div className="rounded-2xl bg-gradient-to-r from-brand-green-500 to-brand-green-600 p-6 text-white shadow-lg">
      <h2 className="text-2xl font-bold">
        {greeting}, {displayName.split(" ")[0]}! 👋
      </h2>
      <p className="mt-1 text-white/80 text-sm">
        Bereit für die nächste Lerneinheit? Dein Wissen wächst jeden Tag.
      </p>
    </div>
  );
}
