# AGENTS.md — Alan Watts Archive Guidelines

This document provides persistent rules and project conventions for the Alan Watts Archive codebase.

## Project Overview
- **Name**: Alan Watts Archive
- **Description**: An authentic editorial archive preserving master lectures, published books, verbatim transcripts, study circles, and philosophical writings of Alan Watts (1915–1973).
- **Architecture**: Single-page application (SPA) with React, Vite, TypeScript, and Tailwind CSS v4.

## Core Principles & Conventions
1. **Strict Editorial Integrity**: Ensure all lecture transcriptions, quotations, and philosophical summaries maintain historical and scholarly accuracy.
2. **Navigation & Resource Structure**: Maintain the comprehensive navigation layer (Explore, Library, Media, Community, Tools, About) and the root resource hub (`/resources/`) with 19 foundational categories.
3. **Dual Visual Themes**: Support both the **Editorial** theme (Newsreader serif typography, warm neutrals, elegant spacing) and the **Neo-Brutalist** theme (high contrast, bold borders, hard shadow offset cards, vibrant accents) via custom CSS variables and toggle state.
4. **Code Quality**: Keep code modular, strictly typed with TypeScript, and free of mock data stubs where real integrations or robust client state apply.
