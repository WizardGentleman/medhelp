import { Tabs } from 'expo-router';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import { Search } from 'lucide-react-native';
import { theme } from '@/styles/theme';
import { useSearch } from '@/contexts/SearchContext';
import { SearchResults } from '@/components/SearchResults';

function SearchHeader() {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <View style={styles.searchContainer}>
      <Text style={styles.appTitle}>MedHelp</Text>
      <View style={styles.searchInputContainer}>
        <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          placeholder="Pesquisar protocolos e calculadoras..."
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>
      <SearchResults />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        tabBarStyle: { display: 'none' }, // Hide the tab bar
      }}>
      <Tabs.Screen
        name="index"
        options={{
          header: () => <SearchHeader />,
          title: '', // Remove the title
        }}
      />
      <Tabs.Screen
        name="conversores"
        options={{
          header: () => <SearchHeader />,
          title: '', // Remove the title
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.primary,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitle: {
    color: 'white',
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
  },
  searchContainer: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xl,
  },
  appTitle: {
    ...theme.typography.h2,
    color: 'white',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  searchInputContainer: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: 'Roboto-Regular',
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
});