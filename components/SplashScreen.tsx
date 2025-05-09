import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen: React.FC = () => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const titleOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo animation
    opacity.value = withSequence(
      withDelay(300, withTiming(1, { duration: 800 })),
      withDelay(1500, withTiming(1, { duration: 200 }))
    );
    
    scale.value = withSequence(
      withDelay(300, withTiming(1, { duration: 800, easing: Easing.out(Easing.back(2)) })),
      withDelay(1500, withTiming(1, { duration: 200 }))
    );

    // Title animation
    titleOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    
    // Tagline animation
    taglineOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
    };
  });

  const taglineStyle = useAnimatedStyle(() => {
    return {
      opacity: taglineOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1A0000']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <Animated.View style={[styles.logoContainer, logoStyle]}>
            {/* For a real app, you would import a proper logo image */}
            <View style={styles.logo}>
              <Text style={styles.logoText}>UB</Text>
            </View>
          </Animated.View>
          
          <Animated.Text style={[styles.title, titleStyle]}>
            unborked
          </Animated.Text>
          
          <Animated.Text style={[styles.tagline, taglineStyle]}>
            Fix your code, not your patience
          </Animated.Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#FF0000',
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
});

export default SplashScreen;