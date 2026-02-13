# Plan: Improve Interactions and UI

This plan aims to improve the Echoo platform's interactions, specifically focusing on settings persistence, header interactions, error handling, and a notification UI redesign.

## 1. Backend Updates (NestJS)

### 1.1 Update User Entity
- **File**: `apps/server/src/modules/core/users/entities/user.entity.ts`
- **Action**: Add a `settings` column of type `jsonb` to store user preferences (theme, notifications, language, etc.).
- **Default**: `{ theme: 'system', notifications: true, emailAlerts: true, language: 'en' }`.

### 1.2 Update Users Controller & Service
- **File**: `apps/server/src/modules/core/users/users.controller.ts`
- **File**: `apps/server/src/modules/core/users/users.service.ts`
- **Action**:
    - Ensure `PATCH /users/me` exists for updating basic info (name, avatar).
    - Add logic to update `settings` via `PATCH /users/me/settings` or include it in `PATCH /users/me`.

## 2. Frontend Infrastructure (Client)

### 2.1 API Service Enhancements
- **File**: `apps/client/src/shared/services/api.ts`
- **Action**:
    - Add methods: `updateProfile(data)`, `updateSettings(data)`.
    - Implement a **Global Error Interceptor** to catch API errors (4xx, 5xx) and trigger a friendly `toast.error` notification.

### 2.2 Store Updates
- **File**: `apps/client/src/shared/stores/authStore.ts`
- **Action**: Ensure `user` state includes `settings`.
- **File**: `apps/client/src/shared/stores/themeStore.ts`
- **Action**: Sync theme changes with user settings (if logged in).

## 3. Frontend Feature: Settings Page

- **File**: `apps/client/src/apps/echoo/pages/SettingsPage.tsx`
- **Action**:
    - **Load Data**: Initialize state from `authStore.user.settings`.
    - **Persistence**:
        - "Save Settings" button: Call `api.updateSettings`.
        - "Save User Info": Call `api.updateProfile`.
    - **Feedback**: Show success/error toasts.

## 4. Frontend Feature: Notifications UI Refactor

- **Current**: `BannerNotifications` (Toast style).
- **New Goal**: A "Message List" dropdown from the Header bell icon (Github-style).
- **Files**:
    - Create `apps/client/src/shared/components/NotificationList/index.tsx`.
    - Create `apps/client/src/shared/components/NotificationList/styles.scss`.
- **Design**:
    - Popover/Dropdown container.
    - List of notifications (read/unread states).
    - "Mark all as read" button.
    - Empty state.
    - Use `var(--...)` variables from the new Design System.

## 5. Frontend Feature: Header Interactions

- **File**: `apps/client/src/shared/components/Header/index.tsx`
- **Action**:
    - **Bell Icon**: Toggle the new `NotificationList` dropdown instead of just toggling a boolean store value.
    - **Theme Icon**: Ensure it reflects the current state and syncs to backend.
