# Alan Watts Wisdom Archive & Scholarly Repository

An authentic, comprehensive web application and digital archive dedicated to preserving the master lectures, published books, verbatim transcripts, study circles, and philosophical writings of Alan Watts (1915–1973).

## Features & Architecture

- **Root Resource Hub (`/resources/`)**: Exhaustive directory categorized into 19 foundational areas including Organizations, Archives, Foundations, Books, Lectures, Podcasts, YouTube Channels, Websites, Newsletters, Communities, Scholars, Creators, Courses, Events, Tools, GPTs, Transcripts, Libraries, and Research Papers.
- **Master Audio Archive**: Explore and listen to pristine 1/4-inch analog master reel recordings (KPFA 1960–1973), organized by seminar series with interactive audio playback, waveform visualization, and transcript synchronization.
- **Library & Books**: Definitive catalog of published works (*The Way of Zen*, *The Book on the Taboo Against Knowing Who You Are*, *Psychotherapy East and West*, etc.) with reading notes and purchasing resources.
- **Interactive Tools**: 
  - **Ask the Archive (AI RAG)**: Semantic search across 428 cataloged lectures with strict citation enforcement.
  - **Quote Verifier**: Cross-reference social media quotations against master transcripts to ensure attribution accuracy.
  - **Advanced Lecture Finder**: Multi-criteria filter by year, verification status, and seminar themes.
- **Business & Footer Layer**: Dedicated sections for Speaking inquiries, Archival Services, Institutional Partners, Wisdom Accelerator, Sponsorship, Licensing Information, and Editorial Contact.
- **Dual Visual Themes**: Toggle seamlessly between the **Editorial** aesthetic (warm neutrals, Newsreader serif typography, elegant editorial spacing) and the **Neo-Brutalist** theme (high-contrast typography, bold borders, hard shadow offset cards, and vibrant accent colors).

## Tech Stack

- **Framework**: React 18+ with Vite and TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Motion

## Recommended Integrations

Based on the Alan Watts Wisdom Archive platform requirements, the following integrations are recommended:
1. **Google Keep / Google Docs**: Ideal for syncing personal philosophical reading notes, study annotations, and research essays.
2. **Google Drive / Google Picker**: Useful for accessing and managing personal archival audio reel backups and research PDFs.
3. **Firebase Firestore & Auth**: Recommended if enabling multi-user community discussions, user-saved lecture favorites, and synchronized listening club history across devices.
