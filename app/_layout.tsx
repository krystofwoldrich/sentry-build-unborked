import { useEffect } from 'react';
import { Stack, useNavigationContainerRef, usePathname, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { View, StyleSheet } from 'react-native';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { SplashScreen } from 'expo-router';
import * as Sentry from '@sentry/react-native';

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

Sentry.init({
  dsn: 'https://e61034fa9afbf74cb3e809b62a3582a7@o447951.ingest.us.sentry.io/4509311309381632',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
    navigationIntegration,
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,

  tracesSampleRate: 1.0,
  enableNativeFramesTracking: true,
  enableAppStartTracking: true,
  enableStallTracking: true,
});

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function RootLayout() {
  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    // Hide the native splash screen immediately
    SplashScreen.hideAsync();
  }, []);

  // Don't show a loading indicator, just render the app
  // This allows our custom splash screen to be the only one visible

  return (
    <AuthProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/login" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </CartProvider>
    </AuthProvider>
  );
});;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});