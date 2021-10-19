import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Button({
  title,
  variant = 'default',
  disabled,
  loading,
  onPress,
  ...props
}) {
  const titleElement = React.isValidElement(title) ? (
    title
  ) : (
    <Text style={[styles.text, variant === 'primary' && styles.textPrimary]}>
      {title}
    </Text>
  );
  return (
    <View style={disabled && styles.disabled}>
      <TouchableOpacity
        disabled={disabled}
        style={[
          styles.container,
          variant === 'primary' && styles.primaryContainer,
        ]}
        onPress={onPress}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={"white"} size="small" />
        ) : (
          titleElement
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryContainer: {
    backgroundColor: "#0A2540",
    alignItems: 'center',
  },
  text: {
    color: "#0A2540",
    fontWeight: '600',
    fontSize: 16,
  },
  textPrimary: {
    color: "#FFFFFF",
  },
  disabled: {
    opacity: 0.3,
  },
});
