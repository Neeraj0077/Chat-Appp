// Generates notification sounds using Web Audio API — no sound files needed

const playSound = (type) => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();

        if (type === "message") {
            // WhatsApp-style soft pop — two quick tones
            const times = [0, 0.12];
            const freqs = [880, 1100];

            times.forEach((time, i) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.type = "sine";
                oscillator.frequency.setValueAtTime(freqs[i], ctx.currentTime + time);

                gainNode.gain.setValueAtTime(0, ctx.currentTime + time);
                gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + time + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + 0.15);

                oscillator.start(ctx.currentTime + time);
                oscillator.stop(ctx.currentTime + time + 0.15);
            });
        }

        if (type === "friendRequest") {
            // Three ascending tones — like a notification chime
            const notes = [523, 659, 784]; // C, E, G
            notes.forEach((freq, i) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.type = "sine";
                oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);

                gainNode.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
                gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.15 + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.2);

                oscillator.start(ctx.currentTime + i * 0.15);
                oscillator.stop(ctx.currentTime + i * 0.15 + 0.2);
            });
        }

        // Auto close context after sounds finish
        setTimeout(() => ctx.close(), 1500);

    } catch (err) {
        // Silently fail if browser blocks audio
        console.warn("Audio play failed:", err.message);
    }
};

export const useSound = () => {
    const playMessageSound = () => playSound("message");
    const playFriendRequestSound = () => playSound("friendRequest");

    return { playMessageSound, playFriendRequestSound };
};