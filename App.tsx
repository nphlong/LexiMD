import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export const CORE_FUNCTION =
  'Turn a rough note into clean markdown and see it rendered, diagrams included.';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>LexiMD</Text>
      <Text style={styles.sentence}>{CORE_FUNCTION}</Text>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  name: {
    color: '#111',
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 16,
  },
  sentence: {
    color: '#111',
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
});
