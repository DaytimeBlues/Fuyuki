export function BackgroundVideo() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
            >
                <source src="/flame-bg.mp4" type="video/mp4" />
            </video>
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/50" />
        </div>
    );
}
