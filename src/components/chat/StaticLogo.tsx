interface StaticLogoProps {
    size?: number;
    className?: string;
}

export function StaticLogo({ size = 32, className = '' }: StaticLogoProps) {
    return (
        <div
            className={`relative flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            {/* SVG filters for organic blending */}
            <svg className="absolute w-0 h-0">
                <defs>
                    <filter id="goo-static">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                            result="goo"
                        />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>

            {/* Container with goo filter for organic merging */}
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ filter: 'url(#goo-static)' }}
            >
                {/* Organic blob layers - static snapshot */}
                <div
                    className="absolute rounded-full"
                    style={{
                        width: '80%',
                        height: '80%',
                        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6, #a855f7, #ec4899)',
                        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                    }}
                />
                <div
                    className="absolute rounded-full"
                    style={{
                        width: '70%',
                        height: '70%',
                        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6, #a855f7, #ec4899)',
                        borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
                    }}
                />
                <div
                    className="absolute rounded-full"
                    style={{
                        width: '90%',
                        height: '90%',
                        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6, #a855f7, #ec4899)',
                        borderRadius: '50% 60% 30% 60% / 30% 60% 70% 40%',
                    }}
                />
            </div>

            {/* Iridescent overlay */}
            <div
                className="absolute inset-0 rounded-full overflow-hidden opacity-60"
                style={{
                    background: 'linear-gradient(45deg, rgba(255, 0, 255, 0.8), rgba(0, 255, 255, 0.8), rgba(255, 255, 0, 0.8))',
                    mixBlendMode: 'overlay',
                }}
            />

            {/* Light reflection effect */}
            <div
                className="absolute inset-0 rounded-full overflow-hidden opacity-70"
                style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.7) 45%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0.7) 55%, transparent 100%)',
                    mixBlendMode: 'overlay',
                }}
            />
        </div>
    );
}
