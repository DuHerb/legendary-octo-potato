import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Button } from './Button'

// Example icons for demonstration
const PlusIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12l-7.5 7.5M3 12h16.5" />
  </svg>
)

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A versatile button component that supports multiple variants, sizes, loading states, and accessibility features.

## Features

- **Multiple Variants**: Primary, secondary, outline, ghost, and destructive styles
- **Flexible Sizing**: Small (sm), medium (md), large (lg), and extra-large (xl) sizes
- **Loading State**: Built-in loading spinner with proper accessibility
- **Icon Support**: Start and end icon slots for enhanced visual design
- **Accessibility**: Proper ARIA attributes, focus management, and keyboard navigation
- **Full Width Option**: Can expand to fill container width
- **TypeScript**: Fully typed with comprehensive prop interfaces

## Usage

\`\`\`tsx
import { Button } from '@envelope-budget/ui'

function MyComponent() {
  return (
    <Button variant="primary" size="md" onClick={handleClick}>
      Click me
    </Button>
  )
}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the button',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in a loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take full width',
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when button is clicked',
    },
  },
  args: {
    onClick: fn(),
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  args: {
    children: 'Button',
  },
}

// Variant stories
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Item',
  },
}

// Size stories
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
}

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: 'Extra Large Button',
  },
}

// State stories
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading Button',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
}

// Icon stories
export const WithStartIcon: Story = {
  args: {
    startIcon: <PlusIcon />,
    children: 'Add Item',
  },
}

export const WithEndIcon: Story = {
  args: {
    endIcon: <ArrowRightIcon />,
    children: 'Continue',
  },
}

export const WithBothIcons: Story = {
  args: {
    startIcon: <PlusIcon />,
    endIcon: <ArrowRightIcon />,
    children: 'Add and Continue',
  },
}

// Layout stories
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
}

// Comprehensive variant showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-x-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
      <div className="space-x-4">
        <Button variant="primary" disabled>Disabled Primary</Button>
        <Button variant="secondary" loading>Loading Secondary</Button>
        <Button variant="outline" startIcon={<PlusIcon />}>With Icon</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A showcase of all button variants and common states.',
      },
    },
  },
}

// Size comparison
export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available button sizes.',
      },
    },
  },
}

// Interactive playground
export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Playground Button',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test different button configurations. Use the controls panel to modify props.',
      },
    },
  },
}

// Accessibility demonstration
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-x-4">
        <Button aria-label="Add new item to cart">
          <PlusIcon />
        </Button>
        <Button disabled aria-label="This action is currently unavailable">
          Unavailable Action
        </Button>
        <Button loading aria-label="Processing your request">
          Processing
        </Button>
      </div>
      <p className="text-sm text-gray-600 max-w-md">
        All buttons include proper ARIA labels, focus management, and keyboard navigation support.
        Try tabbing through the buttons and using Enter/Space to activate them.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of accessibility features including ARIA labels and keyboard navigation.',
      },
    },
  },
}