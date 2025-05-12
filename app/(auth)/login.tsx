import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, User, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isManualLogin, setIsManualLogin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { login, loginWithSSO, isLoading } = useAuth();
  const router = useRouter();

  const handleToggleLoginMethod = () => {
    setIsManualLogin(!isManualLogin);
    setLoginError('');
  };

  const handleLogin = async () => {
    try {
      if (isManualLogin) {
        if (!username.trim()) {
          setLoginError('Username is required');
          return;
        }
        await login(username, password);
      } else {
        // WORKING VERSION (uncomment to fix):
        // const demoUsername = 'demo';
        // const demoPassword = 'demo123';
        // await loginWithSSO(demoUsername, demoPassword);
        
        // BROKEN: Missing password parameter for SSO login
        // This will cause the auth to fail because the password is required but not sent
        const demoUsername = 'demo';
        await loginWithSSO(demoUsername);
      }
      router.replace('/(tabs)');
    } catch (error: any) {
      setLoginError('Login failed. Please try again.');
      console.error('Login error:', error);
      throw new Error(`Login failed: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={['#FF1A1A', '#990000']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View 
            style={styles.logoContainer}
            entering={FadeIn.duration(800)}
          >
            <View style={styles.logo}>
              <Text style={styles.logoText}>UB</Text>
            </View>
            <Animated.Text 
              style={styles.title}
              entering={FadeInDown.delay(200).duration(800)}
            >
              unborked
            </Animated.Text>
            <Animated.Text 
              style={styles.subtitle}
              entering={FadeInDown.delay(400).duration(800)}
            >
              Fix your code, not your patience
            </Animated.Text>
          </Animated.View>
        </LinearGradient>
      
        <Animated.View 
          style={styles.formContainer}
          entering={FadeInDown.delay(600).duration(800)}
        >
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.welcomeSubtext}>Sign in to continue</Text>
          
          {loginError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{loginError}</Text>
            </View>
          ) : null}
          
          {isManualLogin ? (
            <>
              <View style={styles.inputContainer}>
                <User size={20} color="#666666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#666666"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Lock size={20} color="#666666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#666666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </>
          ) : null}
          
          <Button
            title={isManualLogin ? "Sign In" : "Sign-in with SSO"}
            loading={isLoading}
            onPress={handleLogin}
            style={styles.loginButton}
            icon={!isManualLogin ? <ChevronRight size={20} color="#FFFFFF" style={{ marginLeft: 4 }} /> : undefined}
            iconPosition="right"
          />
          
          <TouchableOpacity 
            onPress={handleToggleLoginMethod}
            style={styles.toggleContainer}
          >
            <Text style={styles.toggleText}>
              {isManualLogin 
                ? "Use Demo Login Instead" 
                : "Sign In with Credentials"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#FF0000',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#330000',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    fontFamily: 'Inter-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#111111',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  loginButton: {
    marginTop: 8,
    height: 56,
    backgroundColor: '#FF0000',
  },
  toggleContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF0000',
  },
});