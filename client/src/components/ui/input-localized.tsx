import * as React from "react"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/hooks/use-translations"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { currentLanguage } = useTranslations()
    const isUrdu = currentLanguage === 'ur'
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          isUrdu && "urdu-font", // Only apply Urdu font, no direction change
          className
        )}
        lang={currentLanguage}
        style={isUrdu ? {
          fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Pak Nastaleeq', 'Urdu Typesetting', 'Arabic Typesetting', 'Tahoma', 'Microsoft Uighur', 'Traditional Arabic', serif",
          fontWeight: '400',
          lineHeight: '1.5'
        } : undefined}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
