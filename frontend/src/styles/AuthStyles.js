export const colors = {
    primary: '#1A365D',    // Deep navy blue - trust & professionalism
    secondary: '#C53030',  // Rich red - energy & luxury
    accent: '#805AD5',     // Purple - sophistication
    background: '#F7FAFC', // Light cool gray - clean & modern
    neutral: '#4A5568',    // Slate gray - balance
    gold: '#D69E2E',      // Gold accent - luxury
    white: '#FFFFFF',
    error: '#E53E3E',
    gradientStart: '#2D3748',
    gradientEnd: '#4A5568'
};

export const authStyles = {
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(26, 54, 93, 0.9) 0%, rgba(45, 55, 72, 0.8) 100%)', // Softer background
        fontFamily: "'Poppins', sans-serif",
        animation: 'fadeIn 0.5s ease-in',
        position: 'relative',
        overflow: 'hidden',
    },
    floatingShape1: {
        position: 'absolute',
        width: '100px',
        height: '100px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        top: '15%',
        left: '15%',
        animation: 'float1 20s ease-in-out infinite',
        zIndex: 0,
        boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
    },
    floatingShape2: {
        position: 'absolute',
        width: '120px',
        height: '80px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '4px',
        top: '60%',
        right: '20%',
        animation: 'float2 25s ease-in-out infinite',
        zIndex: 0,
        boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.05)',
    },
    floatingShape3: {
        position: 'absolute',
        width: '70px',
        height: '70px',
        background: 'rgba(255, 255, 255, 0.12)',
        borderRadius: '4px',
        bottom: '20%',
        left: '25%',
        animation: 'float3 22s ease-in-out infinite',
        zIndex: 0,
        boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.05)',
    },
    floatingShape4: {
        position: 'absolute',
        width: '100px',
        height: '60px',
        background: 'rgba(255, 255, 255, 0.07)',
        borderRadius: '50%',
        top: '30%',
        right: '35%',
        animation: 'float4 18s ease-in-out infinite',
        zIndex: 0,
        boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
        transform: 'perspective(500px) rotateX(45deg)',
    },
    formBox: {
        width: '512px',
        padding: '40px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
        animation: 'slideUp 0.5s ease-out',
    },
    header: {
        fontSize: '28px',
        fontWeight: '600',
        color: '#1A365D', // Deep navy
        textAlign: 'center',
        marginBottom: '30px',
        animation: 'fadeInDown 0.5s ease-out',
    },
    inputBox: {
        position: 'relative',
        marginBottom: '20px',
        animation: 'fadeInUp 0.5s ease-out',
    },
    input: {
        width: '100%',
        height: '50px',
        background: 'rgba(45, 55, 72, 0.1)', // Subtle navy background
        border: '2px solid transparent',
        borderRadius: '30px',
        padding: '0 45px',
        fontSize: '15px',
        color: '#2D3748',
        textTranform : 'none',
        transition: 'all 0.3s ease',
        '&:focus': {
            background: 'rgba(45, 55, 72, 0.15)',
            borderColor: '#C53030', // Rich red
            outline: 'none',
            boxShadow: '0 0 0 4px rgba(197, 48, 48, 0.1)',
        }
    },
    icon: {
        position: 'absolute',
        left: '17px',
        top: '15px',
        color: '#C53030', // Rich red
        transition: 'all 0.3s ease',
    },
    submitButton: {
        width: '100%',
        height: '45px',
        background: '#C53030', // Rich red
        border: 'none',
        borderRadius: '30px',
        color: '#fff',
        fontSize: '15px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: '#9B2C2C', // Darker red
            transform: 'translateY(-2px)',
            boxShadow: '0 5px 15px rgba(197, 48, 48, 0.3)',
        }
    },
    link: {
        color: '#C53030', // Rich red
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        '&:hover': {
            color: '#9B2C2C', // Darker red
            textDecoration: 'underline',
        }
    },
    errorText: {
        color: '#E53E3E', // Error red
        fontSize: '14px',
        textAlign: 'center',
        marginBottom: '15px',
        animation: 'shake 0.5s ease-in-out',
    },
    select: {
        width: '100%',
        height: '50px',
        background: 'rgba(45, 55, 72, 0.1)',
        border: '2px solid transparent',
        borderRadius: '30px',
        padding: '0 45px',
        fontSize: '15px',
        color: '#2D3748',
        transition: 'all 0.3s ease',
        appearance: 'none',
        cursor: 'pointer',
        '&:focus': {
            background: 'rgba(45, 55, 72, 0.15)',
            borderColor: '#C53030',
            outline: 'none',
            boxShadow: '0 0 0 4px rgba(197, 48, 48, 0.1)',
        }
    }
};

// Add these keyframe animations to your CSS
const keyframes = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from { 
            opacity: 0;
            transform: translateY(20px);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    @keyframes float1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(-50px, 40px) scale(1.1); }
        50% { transform: translate(40px, 60px) scale(0.9); }
        75% { transform: translate(30px, -40px) scale(1.05); }
    }

    @keyframes float2 {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        33% { transform: translate(-60px, -40px) rotate(10deg); }
        66% { transform: translate(40px, 30px) rotate(-5deg); }
    }

    @keyframes float3 {
        0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
        33% { transform: translate(50px, -50px) scale(1.1) rotate(15deg); }
        66% { transform: translate(-40px, 40px) scale(0.95) rotate(-15deg); }
    }

    @keyframes float4 {
        0%, 100% { transform: perspective(500px) rotateX(45deg) translate(0, 0); }
        33% { transform: perspective(500px) rotateX(45deg) translate(-40px, 40px); }
        66% { transform: perspective(500px) rotateX(45deg) translate(50px, -30px); }
    }
`;

// Add this style tag to your document
const style = document.createElement('style');
style.textContent = keyframes;
document.head.appendChild(style);