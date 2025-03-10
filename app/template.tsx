// Создайте файл template.tsx, который будет использоваться для всех страниц
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
} 