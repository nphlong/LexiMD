import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { usePreferences } from '../preferences/Preferences';
import { AppearanceChoice } from '../settings/settings';
import { Palette } from '../theme/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
};

function Choice({
  label,
  selected,
  onPress,
  colors,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  colors: Palette;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.choice, { backgroundColor: selected ? colors.button : colors.chip }]}
    >
      <Text style={[styles.choiceText, { color: selected ? colors.buttonText : colors.chipText }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function SettingsSheet({ visible, onClose }: Props) {
  const { messages, colors, appearance, setAppearance } = usePreferences();
  const appearanceChoices: { id: AppearanceChoice; label: string }[] = [
    { id: 'system', label: messages.system },
    { id: 'light', label: messages.light },
    { id: 'dark', label: messages.dark },
  ];

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.fill}>
        <Pressable accessibilityRole="button" onPress={onClose} style={styles.backdrop} />
        <View style={[styles.card, { backgroundColor: colors.background }]}>
          <View style={styles.bar}>
            <Text style={[styles.title, { color: colors.text }]}>{messages.settings}</Text>
            <Pressable accessibilityRole="button" onPress={onClose}>
              <Text style={[styles.done, { color: colors.text }]}>{messages.done}</Text>
            </Pressable>
          </View>
          <Text style={[styles.label, { color: colors.muted }]}>{messages.appearance}</Text>
          <View style={styles.row}>
            {appearanceChoices.map((choice) => (
              <Choice
                colors={colors}
                key={choice.id}
                label={choice.label}
                onPress={() => setAppearance(choice.id)}
                selected={appearance === choice.id}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  card: {
    alignSelf: 'center',
    borderRadius: 12,
    maxWidth: 480,
    padding: 20,
    width: '100%',
  },
  bar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  done: {
    fontSize: 17,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choice: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  choiceText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
