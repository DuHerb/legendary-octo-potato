import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { clsx } from 'clsx'

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'

/**
 * Button size types
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Props for the Button component
 */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  /**
   * Visual style variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant
  
  /**
   * Size of the button
   * @default 'md'
   */
  size?: ButtonSize
  
  /**
   * Whether the button is in a loading state
   * @default false
   */
  loading?: boolean
  
  /**
   * Content to display inside the button
   */
  children: ReactNode
  
  /**
   * Additional CSS classes to apply
   */
  className?: string
  
  /**
   * Whether the button should take full width of its container
   * @default false
   */
  fullWidth?: boolean
  
  /**
   * Icon to display before the button text
   */
  startIcon?: ReactNode
  
  /**
   * Icon to display after the button text
   */
  endIcon?: ReactNode
}

/**
 * Loading spinner component
 */
const LoadingSpinner = ({ size }: { size: ButtonSize }) => {
  const spinnerSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
  }

  return (
    <svg
      className={clsx('animate-spin', spinnerSizes[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

/**
 * Get button styles based on variant, size, and state
 */
const getButtonStyles = (
  variant: ButtonVariant,
  size: ButtonSize,
  loading: boolean,
  disabled: boolean,
  fullWidth: boolean
): string => {
  // Base styles
  const baseStyles = clsx(
    'inline-flex items-center justify-center font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    fullWidth && 'w-full'
  )

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
    md: 'px-4 py-2 text-sm rounded-md gap-2',
    lg: 'px-6 py-2.5 text-base rounded-md gap-2',
    xl: 'px-8 py-3 text-base rounded-lg gap-2.5',
  }

  // Variant styles
  const variantStyles = {
    primary: clsx(
      'bg-primary-600 text-white shadow-sm',
      'hover:bg-primary-700 focus-visible:ring-primary-600',
      disabled && 'bg-primary-300'
    ),
    secondary: clsx(
      'bg-secondary-100 text-secondary-900 shadow-sm',
      'hover:bg-secondary-200 focus-visible:ring-secondary-500',
      disabled && 'bg-secondary-50 text-secondary-400'
    ),
    outline: clsx(
      'border border-secondary-300 bg-white text-secondary-700 shadow-sm',
      'hover:bg-secondary-50 focus-visible:ring-secondary-500',
      disabled && 'border-secondary-200 text-secondary-400'
    ),
    ghost: clsx(
      'text-secondary-700',
      'hover:bg-secondary-100 focus-visible:ring-secondary-500',
      disabled && 'text-secondary-400'
    ),
    destructive: clsx(
      'bg-red-600 text-white shadow-sm',
      'hover:bg-red-700 focus-visible:ring-red-600',
      disabled && 'bg-red-300'
    ),
  }

  return clsx(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    loading && 'cursor-wait'
  )
}

/**
 * A versatile button component with multiple variants, sizes, and states.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 * ```
 * 
 * @example
 * ```tsx
 * <Button variant="outline" loading>
 *   Loading...
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      children,
      className,
      fullWidth = false,
      startIcon,
      endIcon,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={clsx(
          getButtonStyles(variant, size, loading, isDisabled, fullWidth),
          className
        )}
        aria-label={loading ? 'Loading...' : props['aria-label']}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner size={size} />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {startIcon && <span className="flex-shrink-0">{startIcon}</span>}
            {children}
            {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'