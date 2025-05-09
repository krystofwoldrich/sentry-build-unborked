import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';
import { CreditCard, MapPin, Settings, LogOut, ChevronRight, ShoppingBag, Bell, CircleHelp as HelpCircle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeInDown.duration(800)}
      >
        <Text style={styles.title}>Profile</Text>
      </Animated.View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.userSection}>
          <Image 
            source={{ uri: user.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
            style={styles.avatar} 
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>
        
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <ShoppingBag size={20} color="#3074F6" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemText}>My Orders</Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <CreditCard size={20} color="#3074F6" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemText}>Payment Methods</Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <MapPin size={20} color="#3074F6" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemText}>Addresses</Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
          
          <Text style={[styles.sectionTitle, styles.sectionTitleSpacing]}>Preferences</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Bell size={20} color="#3074F6" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Settings size={20} color="#3074F6" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <HelpCircle size={20} color="#3074F6" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        <Button
          title="Sign Out"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon={<LogOut size={20} color="#3074F6" style={{ marginRight: 8 }} />}
          iconPosition="left"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 50 : 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  sectionTitleSpacing: {
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(48, 116, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1A1A1A',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
});