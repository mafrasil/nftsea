export default function Hero({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="container mx-auto px-4 my-6">
      <div className="border flex flex-col justify-center items-center w-full border-white bg-white/10 backdrop-blur-sm p-12 rounded-2xl">
        <h1 className="text-3xl md:text-5xl font-bold tracking-wide font-cinzel text-gradient-hero">
          {children}
        </h1>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}
