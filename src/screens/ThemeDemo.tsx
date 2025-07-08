import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import {
  ThemedText,
  ThemedCard,
  ThemedButton,
  Heading1,
  Heading2,
  Heading3,
  BodyText,
  Caption,
} from '../components/themed';

const ThemeDemo = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    content: {
      padding: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      marginBottom: theme.spacing.md,
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    card: {
      marginBottom: theme.spacing.md,
    },
    colorDemo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    colorBox: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Typography Section */}
        <View style={styles.section}>
          <ThemedText variant="h2" style={styles.sectionTitle}>
            Typography
          </ThemedText>
          <ThemedCard variant="default" style={styles.card}>
            <Heading1>Heading 1</Heading1>
            <Heading2>Heading 2</Heading2>
            <Heading3>Heading 3</Heading3>
            <BodyText>This is body text with good readability.</BodyText>
            <Caption>This is caption text for smaller details.</Caption>
          </ThemedCard>
        </View>

        {/* Text Colors Section */}
        <View style={styles.section}>
          <ThemedText variant="h2" style={styles.sectionTitle}>
            Text Colors
          </ThemedText>
          <ThemedCard variant="default" style={styles.card}>
            <ThemedText variant="body" color="primary">
              Primary text color
            </ThemedText>
            <ThemedText variant="body" color="secondary">
              Secondary text color
            </ThemedText>
            <ThemedText variant="body" color="tertiary">
              Tertiary text color
            </ThemedText>
            <ThemedText variant="body" color="accent">
              Accent text color
            </ThemedText>
            <ThemedText variant="body" color="disabled">
              Disabled text color
            </ThemedText>
          </ThemedCard>
        </View>

        {/* Buttons Section */}
        <View style={styles.section}>
          <ThemedText variant="h2" style={styles.sectionTitle}>
            Buttons
          </ThemedText>
          <ThemedCard variant="default" style={styles.card}>
            <View style={styles.row}>
              <ThemedButton variant="primary" size="sm" style={{ flex: 1 }}>
                Primary Small
              </ThemedButton>
              <ThemedButton variant="secondary" size="sm" style={{ flex: 1 }}>
                Secondary Small
              </ThemedButton>
            </View>
            <View style={styles.row}>
              <ThemedButton variant="outline" size="md" style={{ flex: 1 }}>
                Outline Medium
              </ThemedButton>
              <ThemedButton variant="ghost" size="md" style={{ flex: 1 }}>
                Ghost Medium
              </ThemedButton>
            </View>
            <ThemedButton variant="primary" size="lg" fullWidth>
              Large Full Width Button
            </ThemedButton>
            <ThemedButton
              variant="primary"
              loading
              style={{ marginTop: theme.spacing.sm }}
            >
              Loading Button
            </ThemedButton>
          </ThemedCard>
        </View>

        {/* Cards Section */}
        <View style={styles.section}>
          <ThemedText variant="h2" style={styles.sectionTitle}>
            Cards
          </ThemedText>

          <ThemedCard variant="default" padding="md" style={styles.card}>
            <ThemedText variant="h3">Default Card</ThemedText>
            <ThemedText variant="body" color="secondary">
              This is a default card with medium padding and standard shadow.
            </ThemedText>
          </ThemedCard>

          <ThemedCard variant="elevated" padding="lg" style={styles.card}>
            <ThemedText variant="h3">Elevated Card</ThemedText>
            <ThemedText variant="body" color="secondary">
              This is an elevated card with large padding and stronger shadow.
            </ThemedText>
          </ThemedCard>

          <ThemedCard variant="outline" padding="sm" style={styles.card}>
            <ThemedText variant="h3">Outline Card</ThemedText>
            <ThemedText variant="body" color="secondary">
              This is an outline card with small padding and border.
            </ThemedText>
          </ThemedCard>
        </View>

        {/* Color Palette Section */}
        <View style={styles.section}>
          <ThemedText variant="h2" style={styles.sectionTitle}>
            Color Palette
          </ThemedText>
          <ThemedCard variant="default" style={styles.card}>
            <ThemedText variant="h4" style={{ marginBottom: theme.spacing.sm }}>
              Primary Colors
            </ThemedText>
            <View style={styles.colorDemo}>
              <View
                style={[
                  styles.colorBox,
                  { backgroundColor: theme.colors.primary.main },
                ]}
              />
              <View
                style={[
                  styles.colorBox,
                  { backgroundColor: theme.colors.primary.light },
                ]}
              />
              <View
                style={[
                  styles.colorBox,
                  { backgroundColor: theme.colors.primary.dark },
                ]}
              />
            </View>

            <ThemedText
              variant="h4"
              style={{
                marginBottom: theme.spacing.sm,
                marginTop: theme.spacing.md,
              }}
            >
              Accent Colors
            </ThemedText>
            <View style={styles.colorDemo}>
              <View
                style={[
                  styles.colorBox,
                  { backgroundColor: theme.colors.accent.green },
                ]}
              />
              <View
                style={[
                  styles.colorBox,
                  { backgroundColor: theme.colors.accent.purple },
                ]}
              />
              <View
                style={[
                  styles.colorBox,
                  { backgroundColor: theme.colors.accent.orange },
                ]}
              />
              <View
                style={[
                  styles.colorBox,
                  { backgroundColor: theme.colors.accent.red },
                ]}
              />
            </View>
          </ThemedCard>
        </View>

        {/* Spacing Section */}
        <View style={styles.section}>
          <ThemedText variant="h2" style={styles.sectionTitle}>
            Spacing Scale
          </ThemedText>
          <ThemedCard variant="default" style={styles.card}>
            <ThemedText variant="body">XS: {theme.spacing.xs}px</ThemedText>
            <ThemedText variant="body">SM: {theme.spacing.sm}px</ThemedText>
            <ThemedText variant="body">MD: {theme.spacing.md}px</ThemedText>
            <ThemedText variant="body">LG: {theme.spacing.lg}px</ThemedText>
            <ThemedText variant="body">XL: {theme.spacing.xl}px</ThemedText>
            <ThemedText variant="body">XXL: {theme.spacing.xxl}px</ThemedText>
          </ThemedCard>
        </View>
      </View>
    </ScrollView>
  );
};

export default ThemeDemo;
