# Feature Plan: User Management CRUD System

**Plan ID**: 0014
**Created**: 2024-12-28
**Status**: Ready for Implementation
**Priority**: High
**Extends**: 0012_REAL_USER_MANAGEMENT_PLAN.md

---

## 1. Executive Summary

Implement a complete User Management CRUD (Create, Read, Update, Delete) system to replace the current mock data in the Admin Settings page. This feature enables administrators to:
- View all users from the database (not mock data)
- Add new users with role assignment
- Edit existing user details and roles
- Activate/deactivate users
- View user session activity

---

## 2. Current State Analysis

### Mock Data Location
The mock users are defined in two places:

1. **`src/services/settings/settingsStore.ts`** (Lines 225-240):
```typescript
userSessions: [
  {
    id: 'mock-admin-002',
    email: 'admin@admin.ro',
    role: 'admin',
    loginTime: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
  {
    id: 'mock-user-001',
    email: 'demo@demo.com',
    role: 'user',
    // ...
  },
]
```

2. **`src/services/auth/mockAuthService.ts`** (Lines 112-161):
   - Builds users from environment variables
   - Uses hardcoded IDs like `mock-admin-002`, `mock-user-001`

### Database Schema (Already Exists)
From `database/migrations/001_create_core_tables.sql`:
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'moderator')),
    display_name VARCHAR(100),
    avatar_url TEXT,
    avatar_emoji VARCHAR(10) DEFAULT '...',
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
```

### Current UI Component
`src/app/components/settings/UserManagementSection.tsx`:
- Read-only view of user sessions
- Displays summary stats (total users, admins, regular users)
- Shows user cards with email, role, login time, last active
- Note: "Full user management features will be available in a future update"

---

## 3. Technical Design

### 3.1 Backend API Endpoints (Admin Only)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/users` | List all users | Admin |
| GET | `/api/admin/users/:id` | Get single user | Admin |
| POST | `/api/admin/users` | Create new user | Admin |
| PUT | `/api/admin/users/:id` | Update user | Admin |
| DELETE | `/api/admin/users/:id` | Deactivate user | Admin |
| POST | `/api/admin/users/:id/reset-password` | Reset password | Admin |

### 3.2 Request/Response Formats

#### List Users
```typescript
// GET /api/admin/users?page=1&limit=20&role=admin&search=john
{
  success: true,
  data: {
    users: [
      {
        id: "uuid",
        email: "user@example.com",
        role: "user" | "admin" | "moderator",
        displayName: "John Doe",
        avatarEmoji: "...",
        isActive: true,
        isVerified: true,
        lastLoginAt: "ISO date",
        createdAt: "ISO date"
      }
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 150,
      totalPages: 8
    }
  }
}
```

#### Create User
```typescript
// POST /api/admin/users
{
  email: "new@user.com",
  password: "SecurePass123!",
  role: "user",
  displayName: "New User"
}

// Response
{
  success: true,
  data: {
    user: { id, email, role, displayName, createdAt }
  }
}
```

#### Update User
```typescript
// PUT /api/admin/users/:id
{
  email?: "updated@email.com",
  role?: "admin",
  displayName?: "Updated Name",
  isActive?: false
}
```

### 3.3 Frontend Components

```
src/app/components/settings/
├── UserManagementSection.tsx  # Main component (update)
├── UserList.tsx               # User table with actions
├── UserModal.tsx              # Add/Edit user modal
├── UserCard.tsx               # Individual user card
└── UserFilters.tsx            # Search and filter controls
```

### 3.4 State Management

Add to settings store or create dedicated user management store:
```typescript
interface UserManagementState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  pagination: Pagination;
  filters: UserFilters;

  // Actions
  fetchUsers: () => Promise<void>;
  createUser: (data: CreateUserDTO) => Promise<void>;
  updateUser: (id: string, data: UpdateUserDTO) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}
```

---

## 4. Implementation Phases

### Phase 1: Backend User Routes (45 min)

**Files to Create:**
- `server/src/routes/users.ts` - User CRUD endpoints
- `server/src/services/user/userService.ts` - User business logic
- `server/src/middleware/adminMiddleware.ts` - Admin role check

**Tasks:**
1. Create user repository with CRUD operations
2. Create admin middleware for role verification
3. Implement GET /api/admin/users endpoint
4. Implement POST /api/admin/users endpoint
5. Implement PUT /api/admin/users/:id endpoint
6. Implement DELETE /api/admin/users/:id endpoint
7. Add routes to main router

### Phase 2: Frontend User List (30 min)

**Files to Create/Modify:**
- `src/app/components/settings/UserList.tsx` - New
- `src/app/components/settings/UserManagementSection.tsx` - Update
- `src/hooks/useUserManagement.ts` - New

**Tasks:**
1. Create useUserManagement hook with API calls
2. Create UserList component with table view
3. Add loading and error states
4. Connect to backend API

### Phase 3: Add User Modal (30 min)

**Files to Create:**
- `src/app/components/settings/AddUserModal.tsx`

**Tasks:**
1. Create modal with form fields (email, password, role, name)
2. Add form validation
3. Implement submit handler with API call
4. Add success/error feedback

### Phase 4: Edit User Modal (30 min)

**Files to Create:**
- `src/app/components/settings/EditUserModal.tsx`

**Tasks:**
1. Create edit modal with pre-filled form
2. Handle partial updates (only changed fields)
3. Add role change confirmation
4. Implement activate/deactivate toggle

### Phase 5: Integration & Cleanup (20 min)

**Files to Modify:**
- `src/services/settings/settingsStore.ts` - Remove mock userSessions
- `src/app/components/settings/index.ts` - Export new components

**Tasks:**
1. Replace mock data with API calls
2. Remove mock userSessions from settings store
3. Update AdminSettings page
4. Test complete flow

---

## 5. Detailed Component Specifications

### 5.1 UserManagementSection.tsx (Updated)

```typescript
interface UserManagementSectionProps {
  currentUserEmail?: string;
}

export function UserManagementSection({ currentUserEmail }: UserManagementSectionProps) {
  const { users, isLoading, error, fetchUsers, pagination } = useUserManagement();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <SettingsSection
      title="User Management"
      description="Manage user accounts and permissions"
      icon={Users}
    >
      {/* Stats Summary */}
      <UserStats users={users} />

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-4">
        <UserFilters />
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus /> Add User
        </Button>
      </div>

      {/* User List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <UserList
          users={users}
          onEdit={setEditingUser}
          currentUserEmail={currentUserEmail}
        />
      )}

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EditUserModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
      />
    </SettingsSection>
  );
}
```

### 5.2 UserList.tsx

```typescript
interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  currentUserEmail?: string;
}

export function UserList({ users, onEdit, currentUserEmail }: UserListProps) {
  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div
          key={user.id}
          className={`p-4 rounded-lg border ${
            user.email === currentUserEmail
              ? 'bg-blue-500/10 border-blue-400/30'
              : 'bg-gray-700/30 border-white/5'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar user={user} />
              <div>
                <p className="text-white font-medium">{user.email}</p>
                <p className="text-xs text-gray-400">{user.displayName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant={user.role}>{user.role}</Badge>
              <StatusBadge isActive={user.isActive} />
              <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 5.3 AddUserModal.tsx

```typescript
interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'admin' | 'user' | 'moderator',
    displayName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Min 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await createUser(formData);
      onSuccess?.();
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@example.com"
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
          </div>

          <div>
            <Label>Display Name</Label>
            <Input
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
          </div>

          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
            {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
          </div>

          <div>
            <Label>Role</Label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full p-2 bg-gray-700 border border-white/10 rounded"
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-500/20 border border-red-400/30 rounded">
              <p className="text-red-300 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 6. Backend Implementation Details

### 6.1 User Routes (`server/src/routes/users.ts`)

```typescript
import { Hono } from 'hono';
import { query, queryOne } from '../config/database';
import { hashPassword } from '../services/auth/passwordService';
import { adminMiddleware } from '../middleware/adminMiddleware';

const users = new Hono();

// All routes require admin
users.use('*', adminMiddleware);

// List users
users.get('/', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '20');
  const role = c.req.query('role');
  const search = c.req.query('search');

  let whereClause = 'WHERE 1=1';
  const params: any[] = [];
  let paramIndex = 1;

  if (role) {
    whereClause += ` AND role = $${paramIndex++}`;
    params.push(role);
  }

  if (search) {
    whereClause += ` AND (email ILIKE $${paramIndex++} OR display_name ILIKE $${paramIndex++})`;
    params.push(`%${search}%`, `%${search}%`);
  }

  // Get total count
  const countResult = await queryOne<{ count: string }>(
    `SELECT COUNT(*) FROM users ${whereClause}`,
    params
  );
  const total = parseInt(countResult?.count || '0');

  // Get users
  const offset = (page - 1) * limit;
  const usersList = await query(
    `SELECT id, email, role, display_name, avatar_emoji,
            is_active, is_verified, last_login_at, created_at
     FROM users ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
    [...params, limit, offset]
  );

  return c.json({
    success: true,
    data: {
      users: usersList.map(mapUserToResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

// Create user
users.post('/', async (c) => {
  const { email, password, role = 'user', displayName } = await c.req.json();

  // Validate
  if (!email || !password) {
    return c.json({ success: false, error: 'Email and password required' }, 400);
  }

  // Check if email exists
  const existing = await queryOne(
    'SELECT id FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (existing) {
    return c.json({ success: false, error: 'Email already exists' }, 409);
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await queryOne(
    `INSERT INTO users (email, password_hash, role, display_name)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, role, display_name, created_at`,
    [email.toLowerCase(), passwordHash, role, displayName]
  );

  return c.json({
    success: true,
    data: { user: mapUserToResponse(user) }
  }, 201);
});

// Update user
users.put('/:id', async (c) => {
  const id = c.req.param('id');
  const updates = await c.req.json();

  // Build update query
  const allowedFields = ['email', 'role', 'display_name', 'is_active', 'avatar_emoji'];
  const setClauses: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(updates)) {
    const dbKey = key.replace(/[A-Z]/g, m => '_' + m.toLowerCase());
    if (allowedFields.includes(dbKey)) {
      setClauses.push(`${dbKey} = $${paramIndex++}`);
      params.push(value);
    }
  }

  if (setClauses.length === 0) {
    return c.json({ success: false, error: 'No valid fields to update' }, 400);
  }

  params.push(id);
  const user = await queryOne(
    `UPDATE users SET ${setClauses.join(', ')}, updated_at = NOW()
     WHERE id = $${paramIndex}
     RETURNING id, email, role, display_name, is_active, updated_at`,
    params
  );

  if (!user) {
    return c.json({ success: false, error: 'User not found' }, 404);
  }

  return c.json({
    success: true,
    data: { user: mapUserToResponse(user) }
  });
});

// Delete (deactivate) user
users.delete('/:id', async (c) => {
  const id = c.req.param('id');

  const user = await queryOne(
    `UPDATE users SET is_active = false, updated_at = NOW()
     WHERE id = $1
     RETURNING id`,
    [id]
  );

  if (!user) {
    return c.json({ success: false, error: 'User not found' }, 404);
  }

  return c.json({
    success: true,
    message: 'User deactivated'
  });
});

function mapUserToResponse(user: any) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    displayName: user.display_name,
    avatarEmoji: user.avatar_emoji,
    isActive: user.is_active,
    isVerified: user.is_verified,
    lastLoginAt: user.last_login_at,
    createdAt: user.created_at
  };
}

export default users;
```

### 6.2 Admin Middleware

```typescript
// server/src/middleware/adminMiddleware.ts
import { Context, Next } from 'hono';
import { verifyToken } from '../services/auth/jwtService';

export async function adminMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);

  if (!payload) {
    return c.json({ success: false, error: 'Invalid token' }, 401);
  }

  if (payload.role !== 'admin') {
    return c.json({ success: false, error: 'Admin access required' }, 403);
  }

  c.set('user', payload);
  await next();
}
```

---

## 7. Database Migration

Add password_hash column if not exists:

```sql
-- Migration: Add password_hash to users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email_active ON users(email) WHERE is_active = true;
```

---

## 8. Security Considerations

1. **Authentication**: All user management endpoints require admin JWT token
2. **Authorization**: Admin middleware verifies role before allowing access
3. **Password Handling**:
   - Passwords hashed with bcrypt (cost 12)
   - Never return password_hash in responses
   - Validate password strength on creation
4. **Input Validation**:
   - Email format validation
   - Role must be in allowed list
   - Sanitize display names
5. **Audit Logging**: Log all user management actions
6. **Rate Limiting**: Apply to prevent brute force

---

## 9. Testing Checklist

- [ ] Can list all users (admin only)
- [ ] Can filter users by role
- [ ] Can search users by email/name
- [ ] Can create new user with valid data
- [ ] Cannot create user with duplicate email
- [ ] Cannot create user with weak password
- [ ] Can update user email
- [ ] Can update user role
- [ ] Can activate/deactivate user
- [ ] Cannot delete current logged-in admin
- [ ] Non-admins cannot access user management
- [ ] UI shows loading states
- [ ] UI shows error states
- [ ] Form validation works
- [ ] Success messages display

---

## 10. Success Criteria

1. Admin can view list of all users from database (not mock)
2. Admin can add new users with email, password, role
3. Admin can edit existing user details
4. Admin can change user roles
5. Admin can deactivate users
6. No mock user IDs (mock-admin-002, mock-user-001) visible
7. All changes persist to database
8. UI follows existing shadcn/ui patterns

---

## 11. Files Summary

### Create:
- `server/src/routes/users.ts`
- `server/src/middleware/adminMiddleware.ts`
- `src/hooks/useUserManagement.ts`
- `src/app/components/settings/UserList.tsx`
- `src/app/components/settings/AddUserModal.tsx`
- `src/app/components/settings/EditUserModal.tsx`

### Modify:
- `server/src/routes/index.ts` (add users route)
- `src/app/components/settings/UserManagementSection.tsx`
- `src/services/settings/settingsStore.ts` (remove mock data)

---

**Next Step**: Begin Phase 1 - Backend User Routes Implementation
