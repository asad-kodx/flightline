# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Flightline is an Ionic Angular mobile application for industrial control and monitoring systems. It provides real-time monitoring of sensors, alarms, controls, and devices across different sites and organizations. The app uses SignalR for real-time communication and includes features for alarm management, remote control, and data visualization.

## Development Commands

### Core Commands
- `npm start` - Start development server
- `npm run build` - Build for production  
- `npm run watch` - Build with watch mode for development
- `npm test` - Run unit tests with Karma
- `npm run lint` - Run ESLint on TypeScript and HTML files

### Capacitor Commands
- `npx cap build android` - Build Android app
- `npx cap build ios` - Build iOS app
- `npx cap run android` - Run on Android device/emulator
- `npx cap run ios` - Run on iOS device/simulator
- `npx cap sync` - Sync web assets and update native plugins

## Architecture

### Core Structure
- **Core Module** (`src/app/core/`): Contains singleton services, providers, and interceptors
- **Shared Module** (`src/app/shared/`): Reusable components, pipes, and models
- **Pages** (`src/app/pages/`): Feature-specific page components organized by functionality
- **Services**: Located in `src/app/core/services/` for app-wide services
- **Providers**: Located in `src/app/core/providers/` for data access and business logic

### Key Services
- **SignalR Service**: Real-time communication with backend systems
- **Auth Service**: Authentication and authorization management
- **Live Value Service**: Real-time sensor data monitoring
- **Organization Context Service**: Multi-organization context management
- **Site Context Service**: Site-specific context and navigation

### Data Flow
- **Providers**: Handle data fetching and caching (alarm-data, control-data, entities-data, etc.)
- **Services**: Business logic and real-time communication
- **SignalR Client**: Custom implementation for reliable real-time connections with reconnection strategy

### Key Features
- **Alarm Management**: Real-time alarm monitoring with state management and actions
- **Control Details**: Device and sensor monitoring with live values and graphs  
- **Remote Control**: Equipment control capabilities
- **Multi-tenancy**: Organization and site context switching
- **Offline Support**: Alert queuing and offline functionality

### Mobile Platform Integration
- Uses Capacitor for native device integration
- Cordova plugins for device features (Badge, InAppBrowser, Network, OneSignal)
- Native Android and iOS builds with platform-specific configurations

### Styling
- SCSS with Ionic theming system
- Custom icons in `src/theme/custom-icons.scss`
- Dark theme support in `src/theme/dark.scss`
- Device and sensor SVG icons organized by category

### Testing
- Karma + Jasmine for unit testing
- Spec files co-located with components
- CI configuration available for headless testing

## Development Notes

### TypeScript Configuration
- Strict mode enabled with comprehensive type checking
- Angular strict templates and injection parameters
- ES2022 target with ES2020 modules

### Mobile Development
- Capacitor config includes splash screen and Cordova preferences
- Android and iOS native projects included for platform-specific builds
- Network status monitoring and offline capabilities built-in