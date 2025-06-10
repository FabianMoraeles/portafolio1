import React, {
    useRef,
    useMemo,
    useCallback,
    useEffect
} from 'react';
import './ProfileCard.css';

const DEFAULT_BEHIND =
    'radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),' +
    'hsla(266,100%,90%,var(--card-opacity)) 4%,' +
    'hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,' +
    'hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,' +
    'hsla(266,0%,60%,0) 100%)';
const DEFAULT_INNER =
    'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

const ProfileCard = React.memo(
    ({
        avatarUrl = '/avatar.png',
        miniAvatarUrl,
        iconUrl,
        grainUrl,
        behindGradient = DEFAULT_BEHIND,
        innerGradient = DEFAULT_INNER,
        showBehindGradient = true,
        name = 'Jane Developer',
        title = 'Front-end Engineer',
        handle = 'janedoe',
        status = 'Online',
        contactText = 'Contact',
        showUserInfo = true,
        enableTilt = true,
        className = '',
        onContactClick
    }) => {

        /* ---------- refs ---------- */
        const wrapRef = useRef(null);
        const cardRef = useRef(null);

        /* ---------- helpers para tilt ---------- */
        const handlers = useMemo(() => {
            if (!enableTilt) return null;
            let rafId;

            const clamp = (v, a = 0, b = 100) => Math.min(Math.max(v, a), b);
            const round = (v, p = 3) => parseFloat(v.toFixed(p));
            const adjust = (v, f1, f2, t1, t2) =>
                round(t1 + ((t2 - t1) * (v - f1)) / (f2 - f1));

            const update = (x, y, card, wrap) => {
                const w = card.clientWidth;
                const h = card.clientHeight;
                const px = clamp((100 / w) * x);
                const py = clamp((100 / h) * y);
                const cx = px - 50;
                const cy = py - 50;

                const props = {
                    '--pointer-x': `${px}%`,
                    '--pointer-y': `${py}%`,
                    '--background-x': `${adjust(px, 0, 100, 35, 65)}%`,
                    '--background-y': `${adjust(py, 0, 100, 35, 65)}%`,
                    '--pointer-from-center': `${clamp(Math.hypot(py - 50, px - 50) / 50)}`,
                    '--pointer-from-top': `${py / 100}`,
                    '--pointer-from-left': `${px / 100}`,
                    '--rotate-x': `${round(-(cx / 5))}deg`,
                    '--rotate-y': `${round(cy / 4)}deg`
                };
                Object.entries(props).forEach(([k, v]) => wrap.style.setProperty(k, v));
            };

            return {
                onMove: (e, card, wrap) => update(e.offsetX, e.offsetY, card, wrap),
                onLeave: (e, card, wrap) => update(wrap.clientWidth / 2, wrap.clientHeight / 2, card, wrap),
                cancel: () => rafId && cancelAnimationFrame(rafId)
            };
        }, [enableTilt]);

        /* ---------- pointer events ---------- */
        const pointerMove = useCallback(e => {
            if (!handlers) return;
            handlers.onMove(e, cardRef.current, wrapRef.current);
        }, [handlers]);

        const pointerLeave = useCallback(e => {
            if (!handlers) return;
            handlers.onLeave(e, cardRef.current, wrapRef.current);
        }, [handlers]);

        useEffect(() => {
            if (!enableTilt || !handlers) return;
            const card = cardRef.current;
            card.addEventListener('pointermove', pointerMove);
            card.addEventListener('pointerleave', pointerLeave);
            return () => {
                card.removeEventListener('pointermove', pointerMove);
                card.removeEventListener('pointerleave', pointerLeave);
                handlers.cancel();
            };
        }, [enableTilt, handlers, pointerMove, pointerLeave]);

        /* ---------- inline CSS vars ---------- */
        const style = {
            '--icon': iconUrl ? `url(${iconUrl})` : 'none',
            '--grain': grainUrl ? `url(${grainUrl})` : 'none',
            '--behind-gradient': showBehindGradient ? behindGradient : 'none',
            '--inner-gradient': innerGradient
        };

        /* ---------- render ---------- */
        return (
            <div ref={wrapRef} className={`pc-card-wrapper ${className}`.trim()} style={style}>
                <section ref={cardRef} className="pc-card">
                    <div className="pc-inside">
                        <div className="pc-shine" /><div className="pc-glare" />
                        <div className="pc-content pc-avatar-content">
                            <img className="avatar" src={avatarUrl} alt={`${name} avatar`} />
                            {showUserInfo && (
                                <div className="pc-user-info">
                                    <div className="pc-user-details">
                                        <div className="pc-mini-avatar">
                                            <img src={miniAvatarUrl || avatarUrl} alt="mini avatar" />
                                        </div>
                                        <div className="pc-user-text">
                                            <div className="pc-handle">@{handle}</div>
                                            <div className="pc-status">{status}</div>
                                        </div>
                                    </div>
                                    <button className="pc-contact-btn" onClick={onContactClick}>
                                        {contactText}
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="pc-content">
                            <div className="pc-details">
                                <h3>{name}</h3>
                                <p>{title}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
);

export default ProfileCard;