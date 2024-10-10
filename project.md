# Gold Loss Analysis Project

## Overview
This project is a Next.js application designed for jewelry manufacturers to analyze gold loss during production. It helps identify patterns in gold loss across different dimensions, enabling manufacturers to optimize their processes and reduce material waste.

## Business Logic
The application focuses on several key areas of analysis:

1. Item-wise Loss: Tracks gold loss for each unique jewelry item, helping identify problematic designs or manufacturing processes.
2. Karigar-wise Loss: Analyzes gold loss by artisan (karigar), allowing management to identify training needs or best practices.
3. Process-wise Loss: Breaks down gold loss by manufacturing process, highlighting areas for improvement in the production line.
4. Month-wise Loss: Provides a temporal view of gold loss, useful for identifying seasonal trends or the impact of process changes over time.

The system calculates loss percentages based on the pure gold weight of items and the recorded loss, providing a standardized metric for comparison across different item types and karats.

## Tech Stack
- Next.js 14 (React framework)
- TypeScript
- Prisma (ORM)
- SQLite (Database)
- Recharts (Charting library)
- Tailwind CSS (Styling)
- React Query (Data fetching and caching)
- shadcn/ui (UI components)

## Directory Structure
- `/app`: Next.js app router and API routes
- `/components`: Reusable React components
- `/lib`: Utility functions, database service, and query functions
- `/prisma`: Database schema and migrations
- `/public`: Static assets
- `/types`: TypeScript type definitions

## API Routes
- `/api/analysis/[analysis]`: Handles different types of analysis queries
- `/api/upload-data`: Manages data upload functionality
- `/api/clear-database`: Clears the database
- `/api/items-with-loss`: Fetches items with their loss percentages
- `/api/item-process/[itemNo]`: Fetches process-wise loss for a specific item
- `/api/item-karigar/[itemNo]`: Fetches karigar-wise loss for a specific item
- `/api/item-details/[itemNo]`: Fetches detailed information for a specific item

## Key Components
- `UploadForm`: Handles file uploads and database operations
- `AnalysisCharts`: Displays various charts based on the analysis type
- `ItemList`: Displays a list of items with their loss percentages
- `ItemDetails`: Shows detailed information for a specific item
- `DashboardTabs`: Manages different views of the analysis data

## New Features and Improvements
- Color-coded item list based on loss percentage
- Scrollable item list for better navigation
- Improved error handling and loading states
- Custom tooltips for charts with detailed information
- Sortable item list by item number or loss percentage
- Expandable process-wise and karigar-wise loss details in item view

## Database Schema
- `LossData`: Stores information about gold loss per item
- `WeightData`: Stores weight information for each item

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up the database: `npx prisma migrate dev`
4. Run the development server: `npm run dev`

## Data Upload
The system supports uploading loss and weight data via CSV files. Users can choose to append new data or replace existing data.

## Analysis Features
- Item-wise loss analysis with filterable results
- Karigar-wise loss analysis showing top performers
- Month-wise loss trends
- Process-wise loss breakdown
- Detailed view for individual items showing loss breakdown by process and karigar

## Future Improvements
- Add user authentication and authorization
- Implement data export functionality
- Add more advanced filtering and sorting options for analysis
- Integrate with real-time data sources for live updates

## File Documentation

### API Routes

1. `app/api/analysis/[analysis]/route.ts`
   - Handles different types of analysis queries (item-wise, karigar-wise, month-wise, process-wise)
   - Dynamically routes to the appropriate analysis function based on the query parameter

2. `app/api/upload-data/route.ts`
   - Manages data upload functionality
   - Processes CSV files for loss and weight data
   - Calls DatabaseService to upload the processed data

3. `app/api/clear-database/route.ts`
   - Clears the entire database
   - Used for resetting the application state

4. `app/api/items-with-loss/route.ts`
   - Fetches items with their loss percentages
   - Used for populating the ItemList component

5. `app/api/item-process/[itemNo]/route.ts`
   - Fetches process-wise loss for a specific item
   - Used in the ItemDetails component

6. `app/api/item-karigar/[itemNo]/route.ts`
   - Fetches karigar-wise loss for a specific item
   - Used in the ItemDetails component

7. `app/api/item-details/[itemNo]/route.ts`
   - Fetches detailed information for a specific item
   - Used to populate the ItemDetails component

### Components

1. `components/UploadForm.tsx`
   - Handles file uploads for loss and weight data
   - Allows users to choose between appending or replacing existing data

2. `components/AnalysisCharts.tsx`
   - Displays various charts based on the analysis type
   - Includes Item-wise, Karigar-wise, Month-wise, and Process-wise loss charts
   - Uses Recharts library for visualization

3. `components/ItemList.tsx`
   - Displays a list of items with their loss percentages
   - Allows sorting by item number or loss percentage
   - Color-codes items based on their loss percentage

4. `components/ItemDetails.tsx`
   - Shows detailed information for a specific item
   - Displays weight data, loss summary, and breakdowns by process and karigar

5. `components/Sidebar.tsx`
   - (If exists) Likely contains the sidebar navigation component

### Library Files

1. `lib/databaseService.ts`
   - Contains all database operations
   - Includes functions for data retrieval, insertion, and analysis

2. `lib/analysisQueries.ts`
   - Contains functions for fetching various types of analysis data
   - Includes getItems, getItemWiseLoss, getKarigarWiseLoss, getMonthWiseLoss, getProcessWiseLoss

3. `lib/itemQueries.ts`
   - Contains functions for fetching item-specific data
   - Includes getItemDetails function

4. `lib/utils.ts`
   - Contains utility functions for data processing
   - Includes functions for processing CSV data

### Pages

1. `pages/index.tsx`
   - The main page of the application
   - Renders the dashboard with UploadForm, AnalysisCharts, ItemList, and ItemDetails components

### Other Files

1. `prisma/schema.prisma`
   - Defines the database schema for the application
   - Includes models for LossData and WeightData

2. `package.json`
   - Lists all project dependencies and scripts

3. `tsconfig.json`
   - TypeScript configuration file

4. `next.config.js`
   - Next.js configuration file

5. `tailwind.config.js`
   - Tailwind CSS configuration file

This documentation provides an overview of the main files in the project and their purposes. Each file plays a crucial role in the functionality of the Gold Loss Analysis application, from data management and analysis to user interface components.