# MES UI Component Library (Vibe Reference)

This document provides usage examples and prop definitions for the premium components available to the Vibe AI Agent.

## 📊 1. StatCard
A high-fidelity card for displaying key metrics with trend indicators.
- **Props**:
    - `title` (string): Metric label.
    - `value` (string/number): The primary data point.
    - `trend` (number): Percentage change (positive or negative).
    - `icon` (string): Lucide icon name.
- **Data Binding**: Supported via `dataSource`.

## 📈 2. ActivityChart
A line/area chart using the MES brand gradient.
- **Props**:
    - `title` (string): Chart name.
    - `type` (string): 'line', 'bar', or 'area'.
    - `height` (number): Default is 350.
- **DataSource**: Expects an array of `{ label: string, value: number }`.

## 📋 3. SimpleTable
A streamlined data table for lists.
- **Props**:
    - `columns` (array): List of `{ header: string, accessor: string }`.
- **DataSource**: Expects an array of objects matching the accessors.

## 🟥 4. StatusBadge
A colored badge for identifying entity states.
- **Types**: `success`, `warning`, `danger`, `info`.

## 📦 5. Layout Primitives
- **Gridv1**: A wrapper that supports `columns` property (1 to 12).
- **Sectionv1**: A vertical container with padding and a title.
