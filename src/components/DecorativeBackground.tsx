export function DecorativeBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-125 h-125 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-300/5 rounded-full blur-3xl"></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-linear(to_right,#80808008_1px,transparent_1px),linear-linear(to_bottom,#80808008_1px,transparent_1px)] bg-size-[64px_64px]"></div>
    </div>
  );
}
