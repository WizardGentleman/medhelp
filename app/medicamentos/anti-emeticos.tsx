import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/styles/theme';
import { NavigationButton } from '@/components/NavigationButton';


export default function AntiEmeticosScreen() {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.container}>
      <ScreenHeader title="Anti-eméticos" />
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.cardMetoclopramida}
          activeOpacity={0.9}
          onPress={() => setExpanded((prev) => !prev)}
        >
          <NavigationButton
            route="/medicamentos/metoclopramida"
            title="Metoclopramida (Plasil)"
            icon={<></>}
            style={{ backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 0, paddingVertical: 0, elevation: 0, width: '100%' }}
          />
          {expanded && (
            <Text style={styles.cardDescription}>
              Antiemético e procinético. Indicado para náuseas, vômitos e distúrbios de motilidade gastrointestinal.
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    width: '100%',
    alignSelf: 'stretch',
    minWidth: 0,
    gap: theme.spacing.md,
  },
  cardMetoclopramida: {
    backgroundColor: '#E6F9ED',
    borderRadius: 16,
    borderColor: '#4CAF50',
    borderWidth: 1,
    padding: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'stretch',
  },
  cardDescription: {
    fontSize: theme.fontSize.md,
    color: '#1B5E20',
    marginTop: 8,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
});