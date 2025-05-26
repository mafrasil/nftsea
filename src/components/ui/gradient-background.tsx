export function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
      {/* Purple gradient - top left */}
      <div className="absolute -top-40 -left-40 size-[40rem] bg-radial from-purple-600/30 to-transparent rounded-full blur-xl" />

      {/* Blue gradient - top right */}
      <div className="absolute -top-32 -right-32 size-[40rem] bg-radial from-blue-500/25 to-transparent rounded-full blur-xl" />

      {/* Green gradient - middle left */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 size-[40rem] bg-radial from-green-300/15 to-transparent rounded-full blur-xl" />

      {/* 
      <div className="absolute top-1/2 -right-40 size-[40rem] bg-radial from-yellow-400/15 to-transparent rounded-full blur-xl" />
      Yellow gradient - middle right */}

      {/* Pink gradient - bottom left */}
      <div className="absolute -bottom-32 -left-24 size-[40rem] bg-radial from-pink-500/20 to-transparent rounded-full blur-xl" />

      {/* Purple-blue gradient - bottom right */}
      <div className="absolute -bottom-40 -right-40 size-[40rem] bg-radial from-indigo-600/25 to-transparent rounded-full blur-xl" />
    </div>
  );
}
