export const theme = {
    colors: {
        brand: {
            primary: 'hsl(var(--brand-primary))',     // Purple-500
            secondary: 'hsl(var(--brand-secondary))', // Pink-500
            accent: 'hsl(var(--brand-accent))',       // Violet-400
            warning: 'hsl(var(--brand-warning))',     // Yellow-400
        },
        glass: {
            bg: 'var(--glass-bg)',
            border: 'var(--glass-border)',
            hover: 'var(--glass-hover)',
        },
        text: {
            primary: 'hsl(var(--text-primary))',
            secondary: 'hsl(var(--text-secondary))',
            muted: 'hsl(var(--text-muted))',
        }
    },
    gradients: {
        primary: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
        text: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        background: {
            main: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
            login: 'linear-gradient(135deg, #581c87 0%, #1e40af 50%, #312e81 100%)',
            register: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #be185d 100%)',
        }
    },
    animations: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    }
} as const

export const getGradientBackground = (type: 'main' | 'login' | 'register' = 'main') => {
    return theme.gradients.background[type]
}
