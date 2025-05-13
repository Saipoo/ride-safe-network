
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
					DEFAULT: '#3366FF',
					foreground: '#FFFFFF',
					light: '#E6EDFF',
					dark: '#1A3AA8',
				},
				secondary: {
					DEFAULT: '#FF6633',
					foreground: '#FFFFFF',
					light: '#FFECE6',
					dark: '#CC4D26',
				},
				success: {
					DEFAULT: '#4CAF50',
					foreground: '#FFFFFF',
				},
				warning: {
					DEFAULT: '#F44336',
					foreground: '#FFFFFF',
				},
				muted: {
					DEFAULT: '#F5F7FA',
					foreground: '#64748B',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
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
				'pulse-ring': {
					'0%': { transform: 'scale(0.7)', opacity: '0.8' },
					'80%, 100%': { transform: 'scale(1.5)', opacity: '0' }
				},
				'car-move': {
					'0%': { transform: 'translateX(0) rotate(0deg)' },
					'25%': { transform: 'translateX(25%) rotate(5deg)' },
					'50%': { transform: 'translateX(50%) rotate(-5deg)' },
					'75%': { transform: 'translateX(75%) rotate(5deg)' },
					'100%': { transform: 'translateX(90%) rotate(0deg)' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-ring': 'pulse-ring 1.25s cubic-bezier(0.24, 0, 0.38, 1) infinite',
				'car-move': 'car-move 5s linear infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
