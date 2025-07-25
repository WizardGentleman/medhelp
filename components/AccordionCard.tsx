import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { theme } from '@/styles/theme';

interface AccordionCardProps {
  title: string;
  children: React.ReactNode;
  borderColor?: string;
  backgroundColor?: string;
  titleColor?: string;
}

export function AccordionCard({
  title,
  children,
  borderColor = theme.colors.border,
  backgroundColor = theme.colors.card,
  titleColor = theme.colors.text,
}: AccordionCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    setExpanded(!expanded);
  };

  const cardStyle = [
    styles.container,
    {
      backgroundColor,
      borderColor,
    },
  ];

  const titleStyle = [
    styles.title,
    {
      color: titleColor,
    },
  ];

  return (
    <View style={cardStyle}>
      <TouchableOpacity
        style={styles.header}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={titleStyle}>{title}</Text>
        {expanded ? (
          <ChevronUp size={24} color={titleColor} />
        ) : (
          <ChevronDown size={24} color={titleColor} />
        )}
      </TouchableOpacity>
      {expanded && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.xs,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  title: {
    flex: 1,
    fontFamily: 'Roboto-Medium',
    fontSize: theme.fontSize.md,
    lineHeight: 24,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
});
