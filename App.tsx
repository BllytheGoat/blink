import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: '600',
    marginBottom: 16,
    color: '#171717',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#4d4d4d',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 28,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: '#171717',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ebebeb',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#171717',
  },
});

export default function App() {
  const [screen, setScreen] = useState('home');

  return (
    <SafeAreaView style={styles.container}>
      {screen === 'home' && (
        <View style={styles.content}>
          <Text style={styles.title}>Blink</Text>
          <Text style={styles.subtitle}>Secure P2P file transfer.{'\n'}No accounts. No limits.</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={() => setScreen('send')}>
              <Text style={[styles.buttonText, styles.primaryText]}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => setScreen('recv')}>
              <Text style={[styles.buttonText, styles.secondaryText]}>Receive</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {screen === 'send' && (
        <View style={styles.content}>
          <Text style={styles.title}>Send Files</Text>
          <Text style={styles.subtitle}>Select files to transfer securely</Text>
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={() => setScreen('home')}>
            <Text style={[styles.buttonText, styles.primaryText]}>← Back</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {screen === 'recv' && (
        <View style={styles.content}>
          <Text style={styles.title}>Receive Files</Text>
          <Text style={styles.subtitle}>Enter transfer code to receive</Text>
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={() => setScreen('home')}>
            <Text style={[styles.buttonText, styles.primaryText]}>← Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
