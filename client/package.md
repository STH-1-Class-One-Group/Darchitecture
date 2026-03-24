# Client package notes

This project is now web-first.

## Key runtime dependencies

- `expo`
- `react`
- `react-native`
- `@react-navigation/native`
- `@react-navigation/stack`
- `axios`
- `firebase`
- `leaflet`
- `react-leaflet`

## Removed native-only dependencies

- Async storage persistence
- Native GPS tracking module
- Native map renderer

## Web build

- Build command: `npm run build:web`
- Static export output: `dist`
- Recommended environment variable: `EXPO_PUBLIC_API_BASE_URL`
   