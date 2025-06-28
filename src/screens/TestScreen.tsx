import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Button, Card, Input, Badge } from '../components/ui';
import { theme } from '../theme';

const TestScreen = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background.primary }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing[4],
          gap: theme.spacing[4],
        }}
      >
        <Text
          style={{
            fontSize: theme.typography.h2.fontSize,
            fontWeight: theme.typography.h2.fontWeight,
            color: theme.colors.text.primary,
            textAlign: 'center',
            marginBottom: theme.spacing[4],
          }}
        >
          UI Components Test
        </Text>

        {/* Button Tests */}
        <Card>
          <Text
            style={{
              fontSize: theme.typography.h5.fontSize,
              fontWeight: theme.typography.h5.fontWeight,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing[3],
            }}
          >
            Buttons
          </Text>
          <View style={{ gap: theme.spacing[3] }}>
            <Button>Default Button</Button>
            <Button variant="gradient">Gradient Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button size="sm">Small Button</Button>
            <Button size="lg">Large Button</Button>
            <Button loading>Loading Button</Button>
          </View>
        </Card>

        {/* Input Tests */}
        <Card>
          <Text
            style={{
              fontSize: theme.typography.h5.fontSize,
              fontWeight: theme.typography.h5.fontWeight,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing[3],
            }}
          >
            Inputs
          </Text>
          <View style={{ gap: theme.spacing[3] }}>
            <Input label="Default Input" placeholder="Enter some text..." />
            <Input
              label="Glass Input"
              variant="glass"
              placeholder="Glass variant..."
            />
            <Input
              label="Input with Error"
              placeholder="Error state..."
              error="This field is required"
            />
          </View>
        </Card>

        {/* Badge Tests */}
        <Card>
          <Text
            style={{
              fontSize: theme.typography.h5.fontSize,
              fontWeight: theme.typography.h5.fontWeight,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing[3],
            }}
          >
            Badges
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: theme.spacing[2],
            }}
          >
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge size="sm">Small</Badge>
          </View>
        </Card>

        {/* Card Tests */}
        <Card variant="glass">
          <Text
            style={{
              fontSize: theme.typography.h5.fontSize,
              fontWeight: theme.typography.h5.fontWeight,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing[2],
            }}
          >
            Glass Card
          </Text>
          <Text
            style={{
              fontSize: theme.typography.body.fontSize,
              color: theme.colors.text.secondary,
            }}
          >
            This is a glass variant card with backdrop blur effect.
          </Text>
        </Card>

        <Card variant="gradient">
          <Text
            style={{
              fontSize: theme.typography.h5.fontSize,
              fontWeight: theme.typography.h5.fontWeight,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing[2],
            }}
          >
            Gradient Card
          </Text>
          <Text
            style={{
              fontSize: theme.typography.body.fontSize,
              color: theme.colors.text.secondary,
            }}
          >
            This is a gradient card with linear gradient background.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TestScreen;
