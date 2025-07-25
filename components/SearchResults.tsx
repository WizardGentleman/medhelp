import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSearch } from '@/contexts/SearchContext';
import { theme } from '@/styles/theme';

export function SearchResults() {
  const { searchResults, searchTerm } = useSearch();

  if (!searchTerm) return null;

  if (searchResults.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noResults}>
          Nenhum resultado encontrado para "{searchTerm}"
        </Text>
      </View>
    );
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'Emergência';
      case 'calculator':
        return 'Calculadora';
      case 'score':
        return 'Escore';
      case 'converter':
        return 'Conversor';
      default:
        return type;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {searchResults.map((result) => (
        <TouchableOpacity
          key={result.id}
          style={styles.resultItem}
          onPress={() => router.push(result.route)}
        >
          <Text style={styles.resultTitle}>{result.title}</Text>
          <Text style={styles.resultType}>
            {getTypeLabel(result.type)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xs,
    maxHeight: 300,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resultItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  resultTitle: {
    ...theme.typography.body1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  resultType: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  noResults: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    padding: theme.spacing.md,
    textAlign: 'center',
  },
});