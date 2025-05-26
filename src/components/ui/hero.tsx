export default function Hero({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="container mx-auto px-4">
      <div className="border flex flex-col justify-center items-center w-full border-gray-600 rounded-2xl p-8 bg-black/20 backdrop-blur-sm">
        <h1 className="text-4xl md:text-6xl font-bold tracking-wide font-cinzel text-gradient-hero">
          {children}
        </h1>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}
