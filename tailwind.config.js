/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b0b0a',
        bg2: '#121210',
        card: '#161614',
        ink: '#f2efe6',
        muted: '#8f8c82',
        acc: '#d6ff3d',
        accink: '#10130a',
        line: 'rgba(242,239,230,.12)',
      },
      fontFamily: {
        disp: ['"Big Shoulders Display"', 'Impact', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        pulse: {
          '70%': { boxShadow: '0 0 0 10px rgba(214,255,61,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(214,255,61,0)' },
        },
        rise: { to: { transform: 'none' } },
        float: { '50%': { transform: 'translateY(-12px)' } },
        spin: { to: { transform: 'rotate(360deg)' } },
        slide: { to: { transform: 'translateX(-50%)' } },
        plate: { from: { opacity: 0, transform: 'translateX(70px) scaleY(.6)' } },
      },
      animation: {
        pulse: 'pulse 2s infinite',
        rec: 'pulse 1.4s infinite',
        rise: 'rise .9s cubic-bezier(.2,.8,.2,1) forwards',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 40s linear infinite',
        slide: 'slide 38s linear infinite',
        plate: 'plate .55s cubic-bezier(.2,.9,.3,1.2) both',
      },
    },
  },
  plugins: [],
}
