# Plan: Permanent API Tokens

This plan introduces a feature to generate and manage permanent API tokens. These tokens allow external systems (like CI/CD pipelines) to trigger messages on behalf of a user.

## 1. Backend (NestJS)

### 1.1 New Module: `ApiTokensModule`
*   **Path**: `apps/server/src/modules/core/api-tokens/`
*   **Entity**: `ApiToken`
    *   `id` (UUID, Primary Key)
    *   `name` (String, User-provided label)
    *   `tokenHash` (String, Hashed token for security)
    *   `prefix` (String, e.g., "echoo_sk_..." first few chars for display)
    *   `user` (ManyToOne relation to `User`)
    *   `usageCount` (Integer, default 0)
    *   `lastUsedAt` (Date, nullable)
    *   `createdAt` (Date)
*   **Service**: `ApiTokensService`
    *   `create(userId, name)`: Generates `echoo_sk_<random>`, hashes it, stores hash, returns raw token.
    *   `findAll(userId)`: Returns list of tokens (without raw token).
    *   `remove(userId, id)`: Deletes a token.
    *   `validateToken(rawToken)`: Hashes input, finds matching record, updates usage stats, returns User.
*   **Controller**: `ApiTokensController`
    *   `POST /api-tokens`: Create token.
    *   `GET /api-tokens`: List tokens.
    *   `DELETE /api-tokens/:id`: Delete token.

### 1.2 Auth Strategy Update
*   **New Strategy**: `ApiTokenStrategy`
    *   Intercepts `Authorization: Bearer ...`.
    *   If token format matches API token, validates via `ApiTokensService`.
    *   Returns the associated User.
*   **Update `MessagesController`**:
    *   Update `@UseGuards` to accept both `JwtAuthGuard` and `ApiTokenAuthGuard`.

## 2. Shared Types (IDL)

*   **File**: `packages/types/src/index.ts`
*   **Add Interfaces**:
    *   `ApiToken`: `{ id, name, prefix, usageCount, lastUsedAt, createdAt }`
    *   `CreateApiTokenResponse`: `ApiToken & { token: string }`

## 3. Frontend (SolidJS)

### 3.1 API Service
*   **File**: `apps/client/src/shared/services/api.ts`
*   **Add Methods**:
    *   `getApiTokens()`
    *   `createApiToken(name)`
    *   `deleteApiToken(id)`

### 3.2 New Page: `ApiTokensPage`
*   **Path**: `apps/client/src/apps/echoo/pages/ApiTokensPage.tsx`
*   **UI Components**:
    *   **Header**: Title and "Generate New Token" button.
    *   **Token List**: Table showing Name, Prefix, Usage, Created At, Last Used.
    *   **Delete Action**: Button with `ConfirmDialog` protection.
    *   **Creation Modal**: Simple form for "Token Name".
    *   **Success Modal**: Shows the full token **once** with a Copy button. Warning that it won't be shown again.
*   **Styles**: `apps/client/src/apps/echoo/pages/api-tokens.scss`

### 3.3 Navigation
*   **Router**: Add `/echoo/tokens` route in `router.tsx`.
*   **Sidebar**: Add "API Tokens" link (Icon: Key/Terminal) in `Sidebar/index.tsx`.

## 4. Execution Steps

1.  **Shared Types**: Update `packages/types` first.
2.  **Backend**: Implement Entity, Service, Controller, and Auth Strategy.
3.  **Frontend**: Implement API methods, Page, and Navigation.
4.  **Verification**: Test token generation and message triggering via curl.
