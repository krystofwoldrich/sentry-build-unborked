import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Platform } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  ...rest
}) => {
  const buttonStyles: ViewStyle[] = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style as ViewStyle,
  ];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle as TextStyle,
  ];

  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <AnimatedTouchableOpacity
      style={buttonStyles}
      disabled={disabled || loading}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#fff' : '#FF0000'} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
  primary: {
    backgroundColor: '#FF0000',
  },
  secondary: {
    backgroundColor: '#330000',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  small: {
    height: 32,
    paddingHorizontal: 12,
  },
  medium: {
    height: 44,
    paddingHorizontal: 16,
  },
  large: {
    height: 56,
    paddingHorizontal: 24,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FF0000',
  },
  outlineText: {
    color: '#FF0000',
  },
  ghostText: {
    color: '#FF0000',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabled: {
    backgroundColor: '#333333',
    borderColor: '#333333',
    opacity: 0.7,
  },
  disabledText: {
    color: '#666666',
  },
  text: {
    fontFamily: 'Inter-SemiBold',
  },
});

export default Button;