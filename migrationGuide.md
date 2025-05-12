# Squarespace to GitHub Pages Migration Guide

This guide outlines the steps needed to complete the migration from Squarespace to GitHub Pages for the Devotion Gallery website.

## Directory Structure Setup

Create the following directory structure in your GitHub repository:

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml
├── css/
│   ├── common.css
│   └── gallery-slideshow.css
├── images/
│   └── slideshow/
│       ├── next-button.png
│       ├── previous-button.png
│       ├── selected.png
│       └── unselected.png
├── js/
│   ├── site.js
│   └── vendor/
│       ├── animation-min.js
│       ├── base64.js
│