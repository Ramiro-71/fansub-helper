# Fansub Note Plugin for Obsidian

## Description
The **Fansub Note Plugin** is a custom plugin for Obsidian that allows users to quickly create notes for tracking fansub translations. It features an intuitive modal that prompts the user to input details such as title, author, and total pages. The plugin also includes the ability to select a folder from the Obsidian vault where the note will be saved. Once created, the note will automatically open in the editor.

## Features
- **Create new notes** for fansub translations.
- **Custom modal** to enter the title, author, and total pages.
- **Folder selection** to choose where to save the note in your Obsidian vault.
- **Automatic note opening** after creation.
- Notes are formatted with YAML front matter for tags and author information.
  
## Installation
1. Clone or download this repository.
2. Move the downloaded folder to your Obsidian `.obsidian/plugins/` directory.
3. Open Obsidian, go to Settings > Community Plugins, and enable the Fansub Note Plugin.

## Usage
1. Once the plugin is enabled, you will see a new button in the ribbon on the left side of the Obsidian interface.
2. Click the button labeled **Fansub Plugin** (it will show a "+" icon).
3. A modal window will appear asking for the following details:
   - **Title**: The title of your new note.
   - **Author**: The name of the person who translated or created the fansub.
   - **Total Pages**: Number of pages to include in the note.
   - **Choose Folder**: A dropdown to select which folder in your vault to save the note.
4. Click **Create** to generate the note, and it will open automatically.

### Example YAML Front Matter in Created Note:
```yaml
---
tags:
  - translation
title: Example Title
translatedTitle: Empty
author: Example Author
---
