import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Animated, { FadeIn } from 'react-native-reanimated';
import SplashScreen from '@/components/SplashScreen';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Simulate delay for splash screen
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }, 2500); // Display splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, router]);

  // Just show the custom SplashScreen
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(500)}
    >
      <SplashScreen />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});