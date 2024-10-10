"use client"

import React from 'react'
import clsx from 'clsx'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label: React.FC<LabelProps> = ({ className, children, ...props }) => (
  <label
    className={clsx("block text-sm font-medium text-gray-700 dark:text-gray-300", className)}
    {...props}
  >
    {children}
  </label>
)

export { Label }