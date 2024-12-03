export const playLoginSound = () => {
    const audio = new Audio('/sounds/success-login.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
};

export const logoutSound = () => {
    const audio = new Audio('/sounds/logout.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
};
