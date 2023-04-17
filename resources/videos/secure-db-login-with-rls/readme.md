# secure-db-login-with-rls

Video link [https://youtu.be/8qPTZQvJ9fA](https://youtu.be/8qPTZQvJ9fA)

## SQL commands

Enable RLS

```sql
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
```

Create an access policy

```sql
DROP POLICY IF EXISTS "Enable all actions for user based on ID" ON todos;

CREATE POLICY "Enable all actions for user based on ID" ON todos
    USING (todos.user = current_setting('app.app_user'));
```

Create an RLS app user

```sql
CREATE USER appsmith WITH PASSWORD 'appsmith';

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO appsmith;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO appsmith;
```

Set user session

```sql
SET app.app_user TO 'confidence@appsmith.com';
```

Get user session

```
SELECT current_setting('app.app_user');
```
