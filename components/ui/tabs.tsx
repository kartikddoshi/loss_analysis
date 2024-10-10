"use client"

import React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import clsx from 'clsx';

interface TabsProps {
  children: React.ReactNode;
  defaultValue: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ children, defaultValue, className }) => {
  return (
    <RadixTabs.Root defaultValue={defaultValue} className={clsx("flex flex-col", className)}>
      {children}
    </RadixTabs.Root>
  );
};

interface TabsListProps {
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ children }) => {
  return (
    <RadixTabs.List className="flex space-x-4 mb-4">
      {children}
    </RadixTabs.List>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children }) => {
  return (
    <RadixTabs.Trigger
      value={value}
      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {children}
    </RadixTabs.Trigger>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => {
  return (
    <RadixTabs.Content value={value} className="mt-2">
      {children}
    </RadixTabs.Content>
  );
};