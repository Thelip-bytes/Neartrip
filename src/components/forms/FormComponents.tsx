"use client"

import React from 'react'
import { useForm, UseFormReturn, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

// Common validation schemas
export const authSchemas = {
  login: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
  
  register: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),
}

export const profileSchemas = {
  updateProfile: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    username: z.string().min(3, 'Username must be at least 3 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores').optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    location: z.string().max(100, 'Location must be less than 100 characters').optional(),
    website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
  }),
}

export const postSchemas = {
  createPost: z.object({
    caption: z.string().min(1, 'Caption is required').max(2200, 'Caption must be less than 2200 characters'),
    location: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
  
  createPlace: z.object({
    name: z.string().min(1, 'Place name is required').max(100, 'Name must be less than 100 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
    category: z.enum(['RESTAURANT', 'CAFE', 'HOTEL', 'ATTRACTION', 'NATURE', 'CITY_SPOT', 'SHOPPING', 'ENTERTAINMENT', 'OTHER']),
    location: z.string().min(1, 'Location is required'),
    website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    phone: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
}

// Form field component
interface FormFieldProps {
  control: UseFormReturn<any>['control']
  name: string
  label: string
  placeholder?: string
  type?: string
  required?: boolean
  description?: string
  className?: string
}

export function FormField({ 
  control, 
  name, 
  label, 
  placeholder, 
  type = "text", 
  required = false,
  description,
  className 
}: FormFieldProps) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className={cn(error && "text-red-500")}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        value={field.value || ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        className={cn(error && "border-red-500 focus:border-red-500")}
      />
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error.message}
        </p>
      )}
    </div>
  )
}

// Textarea field component
interface FormTextareaProps {
  control: UseFormReturn<any>['control']
  name: string
  label: string
  placeholder?: string
  required?: boolean
  description?: string
  rows?: number
  maxLength?: number
  className?: string
}

export function FormTextarea({ 
  control, 
  name, 
  label, 
  placeholder, 
  required = false,
  description,
  rows = 3,
  maxLength,
  className 
}: FormTextareaProps) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className={cn(error && "text-red-500")}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea
        id={name}
        placeholder={placeholder}
        value={field.value || ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        rows={rows}
        maxLength={maxLength}
        className={cn(error && "border-red-500 focus:border-red-500")}
      />
      {maxLength && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-right">
          {field.value?.length || 0}/{maxLength}
        </p>
      )}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error.message}
        </p>
      )}
    </div>
  )
}

// Select field component
interface FormSelectProps {
  control: UseFormReturn<any>['control']
  name: string
  label: string
  placeholder?: string
  options: { value: string; label: string }[]
  required?: boolean
  description?: string
  className?: string
}

export function FormSelect({ 
  control, 
  name, 
  label, 
  placeholder, 
  options,
  required = false,
  description,
  className 
}: FormSelectProps) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className={cn(error && "text-red-500")}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select 
        value={field.value || ''} 
        onValueChange={field.onChange}
        onOpenChange={(open) => !open && field.onBlur()}
      >
        <SelectTrigger className={cn(error && "border-red-500 focus:border-red-500")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error.message}
        </p>
      )}
    </div>
  )
}

// Switch field component
interface FormSwitchProps {
  control: UseFormReturn<any>['control']
  name: string
  label: string
  description?: string
  className?: string
}

export function FormSwitch({ 
  control, 
  name, 
  label, 
  description,
  className 
}: FormSwitchProps) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor={name} className={cn(error && "text-red-500")}>
            {label}
          </Label>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
        <Switch
          id={name}
          checked={field.value || false}
          onCheckedChange={field.onChange}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error.message}
        </p>
      )}
    </div>
  )
}

// Checkbox field component
interface FormCheckboxProps {
  control: UseFormReturn<any>['control']
  name: string
  label: string
  description?: string
  required?: boolean
  className?: string
}

export function FormCheckbox({ 
  control, 
  name, 
  label, 
  description,
  required = false,
  className 
}: FormCheckboxProps) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-start space-x-3">
        <Checkbox
          id={name}
          checked={field.value || false}
          onCheckedChange={field.onChange}
          className={cn(error && "border-red-500 focus:border-red-500")}
        />
        <div className="space-y-1 leading-none">
          <Label 
            htmlFor={name} 
            className={cn(error && "text-red-500", "text-sm font-normal")}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error.message}
        </p>
      )}
    </div>
  )
}

// Form wrapper component
interface FormWrapperProps {
  onSubmit: (data: any) => Promise<void> | void
  schema: z.ZodSchema<any>
  defaultValues?: Record<string, any>
  children: (methods: UseFormReturn<any>) => React.ReactNode
  className?: string
  isLoading?: boolean
  submitText?: string
  resetOnSubmit?: boolean
}

export function FormWrapper({
  onSubmit,
  schema,
  defaultValues = {},
  children,
  className,
  isLoading = false,
  submitText = "Submit",
  resetOnSubmit = false,
}: FormWrapperProps) {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data)
      if (resetOnSubmit) {
        methods.reset()
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <form onSubmit={methods.handleSubmit(handleSubmit)} className={cn("space-y-6", className)}>
      {children(methods)}
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitText}
      </Button>
    </form>
  )
}

// Hook for form validation
export function useValidatedForm<T extends z.ZodSchema<any>>(
  schema: T,
  defaultValues?: z.infer<T>
) {
  const methods = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const {
    formState: { errors, isValid, isSubmitting },
    ...rest
  } = methods

  return {
    methods,
    errors,
    isValid,
    isSubmitting,
    ...rest,
  }
}

// Error display component
export function FormErrors({ errors }: { errors: Record<string, any> }) {
  if (!Object.keys(errors).length) return null

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
        Please fix the following errors:
      </h4>
      <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
        {Object.entries(errors).map(([key, error]) => (
          <li key={key} className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error.message as string}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Success display component
export function FormSuccess({ message }: { message: string }) {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <p className="text-sm text-green-800 dark:text-green-200">{message}</p>
      </div>
    </div>
  )
}