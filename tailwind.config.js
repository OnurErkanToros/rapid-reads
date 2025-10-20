import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Marka Renkleri (Birincil Eylemler)
        brand: {
          DEFAULT: colors.blue[600], // Varsayılan marka rengi (örn: btn-primary bg)
          hover: colors.blue[700], // Üzerine gelme rengi
          dark: colors.blue[700], // Koyu moddaki marka rengi
          darkHover: colors.blue[600] // Koyu mod üzerine gelme
        },
        // Yüzey Renkleri (Arka Planlar, Kartlar)
        surface: {
          DEFAULT: colors.white, // Açık mod varsayılan arka plan
          alt: colors.gray[50], // Açık mod alternatif (body bg)
          dark: colors.gray[800], // Koyu mod kart/panel arka planı
          darkAlt: colors.gray[900], // Koyu mod ana arka plan (body bg)
        },
        // Metin Renkleri
        content: {
          DEFAULT: colors.gray[900], // Açık mod ana metin
          secondary: colors.gray[500], // Açık mod ikincil metin (örn: yazar adı)
          dark: colors.gray[100], // Koyu mod ana metin
          darkSecondary: colors.gray[400] // Koyu mod ikincil metin
        },
        // Diğer Durumlar
        danger: {
          DEFAULT: colors.red[600], // Hata/Silme rengi
          hover: colors.red[700], // Üzerine gelme
          softBg: colors.red[100], // Hafif arka plan (örn: hata toast)
          softColor: colors.red[700] // Hafif metin rengi
        },
        success: {
          DEFAULT: colors.green[600], // Başarı rengi
          hover: colors.green[700],
          softBg: colors.green[100],
          softColor: colors.green[700]
        }
      },
      boxShadow: {
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}