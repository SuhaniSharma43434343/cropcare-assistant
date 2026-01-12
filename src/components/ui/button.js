import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg",
        destructive: "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:from-green-700 hover:to-blue-700",
        glass: "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20",
        success: "bg-green-600 text-white shadow-md hover:bg-green-700",
        warning: "bg-yellow-500 text-yellow-900 shadow-md hover:bg-yellow-600",
        info: "bg-blue-600 text-white shadow-md hover:bg-blue-700",
      },
      size: {
        default: "h-11 px-6 py-2 min-w-[44px]",
        sm: "h-9 px-4 text-xs min-w-[36px]",
        lg: "h-14 px-8 text-base font-semibold min-w-[56px]",
        xl: "h-16 px-10 text-lg font-semibold min-w-[64px]",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-14 w-14",
        "icon-xl": "h-16 w-16",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, fullWidth, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // Add loading state handling
    const isLoading = props.disabled && children && typeof children === 'object' && children.props?.children?.includes?.('Loading');
    
    return (
      <Comp 
        className={cn(buttonVariants({ variant, size, fullWidth, className }))} 
        ref={ref} 
        {...props}
        // Ensure minimum touch target size for accessibility
        style={{
          minHeight: '44px',
          minWidth: '44px',
          ...props.style
        }}
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        )}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

// Enhanced Button with built-in loading state
const LoadingButton = React.forwardRef(
  ({ loading, children, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {loading ? 'Loading...' : children}
      </Button>
    );
  }
);
LoadingButton.displayName = "LoadingButton";

// Icon Button with proper accessibility
const IconButton = React.forwardRef(
  ({ icon: Icon, label, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="icon"
        aria-label={label}
        title={label}
        {...props}
      >
        <Icon className="w-5 h-5" />
        <span className="sr-only">{label}</span>
      </Button>
    );
  }
);
IconButton.displayName = "IconButton";

// Floating Action Button
const FloatingActionButton = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="icon-lg"
        variant="gradient"
        className={cn(
          "fixed bottom-20 right-4 z-40 rounded-full shadow-2xl hover:shadow-3xl",
          "focus:ring-4 focus:ring-primary/20",
          className
        )}
        {...props}
      />
    );
  }
);
FloatingActionButton.displayName = "FloatingActionButton";

export { 
  Button, 
  LoadingButton, 
  IconButton, 
  FloatingActionButton, 
  buttonVariants 
};