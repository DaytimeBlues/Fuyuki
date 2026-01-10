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
        </div>
    );
}
