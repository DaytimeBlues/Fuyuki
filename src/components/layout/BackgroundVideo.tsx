export function BackgroundVideo() {
    return (
        <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
            <img
                src="/assets/aramancia-flame.jpg"
                alt="Background"
                className="absolute top-0 left-0 w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />
            {/* Static gothic gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#050505]" />

            {/* Soft spotlight glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_35%,transparent_60%)]" />

            {/* Gentle vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
        </div>
    );
}
