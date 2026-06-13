# Insta Unfollowers

Find Instagram users who don't follow you back with a beautiful, modern interface.

![GitHub stars](https://img.shields.io/github/stars/bikimandal/insta-unfollowers?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/bikimandal/insta-unfollowers?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

## 🎯 Overview

**Insta Unfollowers** is a free, open-source tool that helps you analyze your Instagram followers and following lists. Instantly discover users who don't follow you back, track mutual followers, and get beautiful analytics about your Instagram relationships.

Upload your Instagram data export and get instant insights with a stunning, modern UI.

## ✨ Features

- 📊 **Analytics Dashboard** - View your follower statistics at a glance
- 👥 **Find Non-Reciprocal Follows** - See users you follow who don't follow you back
- 🔍 **Search & Filter** - Easily search through your followers
- 📋 **Multiple Views** - Switch between list and grid views
- 💾 **Export Data** - Download your lists as CSV
- 🎨 **Beautiful UI** - Modern, dark-mode design with smooth animations
- ⚡ **Fast & Responsive** - Instant processing, works on all devices
- 🔐 **Privacy First** - All data is processed locally, nothing is stored on servers

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/bikimandal/insta-unfollowers.git
   cd insta-unfollowers
```

2. **Install dependencies**
```bash
   npm install
```

3. **Run the development server**
```bash
   npm run dev
```

4. **Open in browser**

http://localhost:3000

## 📖 How to Use

### Step 1: Get Your Instagram Export Data

1. Go to Instagram Settings → Security → Download Data
2. Instagram will send you a file (it may take a few days)
3. You'll receive a ZIP file with JSON files

### Step 2: Extract Your Data

1. Extract the downloaded ZIP file
2. Look for these JSON files:
   - `followers.json`
   - `following.json`

### Step 3: Upload to Insta Unfollowers

1. Open the application
2. Drag & drop your JSON files or click to browse
3. Wait for processing (instant!)
4. View your analytics

### Step 4: Analyze

- **Dashboard** - See overall statistics
- **Not Following Back** - Users you follow but who don't follow you
- **Followers** - All your followers
- **Following** - All users you follow
- **Mutual** - Users who follow you and you follow back

## 🎨 Features Explained

### Analytics Dashboard
- **Total Followers** - Number of people following you
- **Total Following** - Number of people you follow
- **Mutual Followers** - Users who follow you AND you follow them
- **Not Following Back** - Users you follow but they don't follow you

### Find Non-Reciprocal Follows
The main feature - see exactly who's not following you back:
- Red-highlighted for easy identification
- Copy all usernames with one click
- Export as CSV for further analysis
- Sort by follow date

### Search & Filter
- Real-time search by username
- Filter by status (follower, following, mutual)
- Sort by name, date, or status
- Toggle between list and grid views

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS 3+
- **Language**: JavaScript/React
- **File Processing**: HTML5 File API
- **State Management**: React Hooks
- **Deployment**: Vercel (recommended)

## 📁 Project Structure
