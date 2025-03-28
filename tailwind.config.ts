import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				coral: {
					50: '#fff1f1',
					100: '#ffe1e1',
					200: '#ffc7c7',
					300: '#ffa0a0',
					400: '#ff7a7a',
					500: '#ff5757',
					600: '#ff3a3a',
					700: '#e71d1d',
					800: '#be1919',
					900: '#9c1a1a',
					950: '#520808',
				},
				mint: {
					50: '#eefff7',
					100: '#d7ffee',
					200: '#b2fee0',
					300: '#68facd',
					400: '#37f0bd',
					500: '#12e5ad',
					600: '#04bd8d',
					700: '#079576',
					800: '#0a7662',
					900: '#0b6051',
					950: '#003b30',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' }
				},
				'slide-up': {
					from: { transform: 'translateY(10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					from: { transform: 'translateY(-10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'scale-in': {
					from: { transform: 'scale(0.95)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' }
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.85' }
				},
				'subtle-pattern': {
					'0%': { backgroundPosition: '0% 0%' },
					'100%': { backgroundPosition: '100% 100%' }
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 0 0 rgba(255, 121, 121, 0.4)' 
					},
					'50%': { 
						boxShadow: '0 0 20px 5px rgba(255, 121, 121, 0.2)' 
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.2s ease-out',
				'slide-up': 'slide-up 0.3s ease-out',
				'slide-down': 'slide-down 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
				'subtle-pattern': 'subtle-pattern 20s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s infinite',
				'float': 'float 3s ease-in-out infinite'
			},
			backgroundImage: {
				'subtle-dots': 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
				'subtle-lines': 'linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.05) 75%, transparent 75%, transparent)',
				'coral-gradient': 'linear-gradient(to right, rgba(255, 126, 126, 0.7), rgba(255, 90, 90, 0.7))',
				'purple-pink-gradient': 'linear-gradient(to right, rgba(168, 85, 247, 0.7), rgba(236, 72, 153, 0.7))'
			},
			backgroundSize: {
				'dot-pattern': '20px 20px',
				'line-pattern': '20px 20px'
			},
			fontFamily: {
				sans: ['Inter var', 'Inter', 'sans-serif'],
				display: ['SF Pro Display', 'Inter', 'sans-serif']
			},
			boxShadow: {
				'soft': '0 4px 20px rgba(0, 0, 0, 0.04)',
				'glass': '0 8px 32px rgba(0, 0, 0, 0.06)',
				'hover': '0 10px 40px rgba(0, 0, 0, 0.08)',
				'coral': '0 5px 15px rgba(255, 87, 87, 0.3)',
				'coral-intense': '0 6px 18px rgba(255, 87, 87, 0.5)'
			},
			backdropBlur: {
				'glass': '10px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
