export function BackgroundVideo() {
    return (
        <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
            {/* Static background image - battery efficient alternative to video */}
            <div
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/assets/aramancia-flame.jpg)' }}
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />
        </div>
    );
}
