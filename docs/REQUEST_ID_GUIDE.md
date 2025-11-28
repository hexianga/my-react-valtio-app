# 🆔 RequestId 详细说明指南

## 📋 概述

`requestId` 是一个**唯一的请求标识符**，为每个 HTTP 请求自动生成。它的主要作用是**追踪和关联**前后端的请求日志，便于问题排查和性能分析。

## 🎯 RequestId 的核心作用

### 1. 📍 请求链路追踪

**作用**: 在分布式系统中追踪一个请求从客户端到服务器的完整链路

```
客户端发起请求
    ↓
[requestId: 1700000000000-abc123def]
    ↓
服务器接收请求
    ↓
服务器处理业务逻辑
    ↓
服务器返回响应
    ↓
客户端接收响应
```

**示例**:
```
前端日志: [API] GET /api/users (requestId: 1700000000000-abc123def)
后端日志: [API] GET /api/users (requestId: 1700000000000-abc123def)
```

### 2. 🔗 前后端日志关联

**作用**: 通过相同的 `requestId` 将前端和后端的日志关联起来

```typescript
// 前端日志
✅ [API] GET /api/users
├─ 请求ID: 1700000000000-abc123def
├─ 状态码: 200
├─ 端到端耗时: 298ms
└─ 时间: 14:30:45

// 后端日志（同一个 requestId）
2024-11-21 14:30:45 [INFO] Request started
  requestId: 1700000000000-abc123def
  method: GET
  url: /api/users

2024-11-21 14:30:45 [INFO] Database query
  requestId: 1700000000000-abc123def
  query: SELECT * FROM users
  duration: 150ms

2024-11-21 14:30:45 [INFO] Response sent
  requestId: 1700000000000-abc123def
  status: 200
  duration: 298ms
```

### 3. 🐛 问题排查和调试

**作用**: 快速定位问题发生的位置

**场景 1: 请求超时**
```
前端日志:
❌ [API] POST /api/login
├─ 请求ID: 1700000000001-xyz789abc
├─ 状态码: 0
├─ 端到端耗时: 10000ms (超时)
└─ 时间: 14:30:46

后端日志:
2024-11-21 14:30:46 [WARN] Slow query detected
  requestId: 1700000000001-xyz789abc
  query: SELECT * FROM users WHERE email = ?
  duration: 9500ms

原因: 数据库查询太慢，缺少索引
```

**场景 2: 数据不一致**
```
前端日志:
✅ [API] POST /api/users
├─ 请求ID: 1700000000002-def456ghi
├─ 状态码: 200
├─ 端到端耗时: 150ms

后端日志:
2024-11-21 14:30:47 [ERROR] Database error
  requestId: 1700000000002-def456ghi
  error: Duplicate entry for email

原因: 前端没有验证邮箱唯一性
```

### 4. 📊 性能分析

**作用**: 分析单个请求的性能瓶颈

```
requestId: 1700000000003-ghi789jkl

前端耗时分解:
├─ 网络延迟: 50ms
├─ 服务器处理: 200ms
│  ├─ 认证: 20ms
│  ├─ 业务逻辑: 150ms
│  └─ 数据库: 30ms
└─ 响应传输: 10ms
总耗时: 260ms
```

### 5. 🔐 安全审计

**作用**: 记录用户操作，便于安全审计

```
requestId: 1700000000004-jkl012mno
用户: user@example.com
操作: 修改用户信息
时间: 2024-11-21 14:30:48
状态: 成功
IP: 192.168.1.100
```

## 🔧 RequestId 的生成和传递

### 生成方式

```typescript
// 格式: timestamp-randomString
// 例如: 1700000000000-abc123def

const generateRequestId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
```

**特点**:
- ✅ 时间戳确保唯一性
- ✅ 随机字符串增加随机性
- ✅ 易于排序和查询
- ✅ 人类可读

### 传递方式

#### 1. 请求头传递

```typescript
// 自动添加到所有请求的 header
headers: {
  'X-Request-ID': '1700000000000-abc123def'
}
```

#### 2. 响应头返回

```typescript
// 后端应该在响应头中返回相同的 requestId
response.headers['X-Request-ID'] = '1700000000000-abc123def'
```

#### 3. 日志记录

```typescript
// 在所有日志中记录 requestId
console.log(`[${requestId}] API request started`);
```

## 📊 RequestId 的应用场景

### 场景 1: 单个请求的完整追踪

```
用户点击"获取用户列表"按钮
    ↓
前端: [API] 发起请求 GET /api/users (requestId: 1700000000000-abc123def)
    ↓
后端: [INFO] Request received (requestId: 1700000000000-abc123def)
    ↓
后端: [INFO] Querying database (requestId: 1700000000000-abc123def)
    ↓
后端: [INFO] Response sent (requestId: 1700000000000-abc123def)
    ↓
前端: ✅ [API] GET /api/users (requestId: 1700000000000-abc123def, 耗时: 298ms)
```

### 场景 2: 多个相关请求的追踪

```
用户登录
    ↓
请求 1: POST /api/login (requestId: 1700000000000-abc123def)
    ↓
请求 2: GET /api/user/profile (requestId: 1700000000001-xyz789abc)
    ↓
请求 3: GET /api/user/permissions (requestId: 1700000000002-def456ghi)
    ↓
所有请求都可以通过各自的 requestId 追踪
```

### 场景 3: 错误追踪

```
用户报告: "我的数据丢失了"

通过 requestId 查找:
1. 前端日志: ✅ [API] POST /api/data (requestId: 1700000000003-ghi789jkl)
2. 后端日志: [ERROR] Database connection lost (requestId: 1700000000003-ghi789jkl)
3. 数据库日志: [ERROR] Transaction rolled back (requestId: 1700000000003-ghi789jkl)

结论: 数据库连接问题导致事务回滚
```

## 💻 后端集成示例

### Node.js/Express

```typescript
import express from 'express';

const app = express();

// 中间件：提取 requestId
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || generateRequestId();

  // 将 requestId 存储在 request 对象中
  req.requestId = requestId;

  // 在响应头中返回 requestId
  res.setHeader('X-Request-ID', requestId);

  // 记录请求开始
  console.log(`[${requestId}] ${req.method} ${req.url} started`);

  next();
});

// 路由处理
app.get('/api/users', (req, res) => {
  const { requestId } = req;

  console.log(`[${requestId}] Querying database...`);

  // 业务逻辑
  const users = [];

  console.log(`[${requestId}] Sending response...`);

  res.json({
    code: 200,
    message: 'Success',
    data: users,
  });
});
```

### Python/Flask

```python
from flask import Flask, request, g
import uuid

app = Flask(__name__)

@app.before_request
def before_request():
    # 获取或生成 requestId
    request_id = request.headers.get('X-Request-ID', str(uuid.uuid4()))
    g.request_id = request_id

    # 记录请求开始
    print(f"[{request_id}] {request.method} {request.path} started")

@app.after_request
def after_request(response):
    # 在响应头中返回 requestId
    response.headers['X-Request-ID'] = g.request_id
    return response

@app.route('/api/users', methods=['GET'])
def get_users():
    request_id = g.request_id

    print(f"[{request_id}] Querying database...")

    # 业务逻辑
    users = []

    print(f"[{request_id}] Sending response...")

    return {
        'code': 200,
        'message': 'Success',
        'data': users,
    }
```

### Java/Spring Boot

```java
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class UserController {

    @GetMapping("/users")
    public ResponseEntity<?> getUsers(
        @RequestHeader(value = "X-Request-ID", required = false) String requestId) {

        // 生成或使用提供的 requestId
        if (requestId == null) {
            requestId = UUID.randomUUID().toString();
        }

        // 记录请求开始
        System.out.println("[" + requestId + "] GET /api/users started");

        // 业务逻辑
        List<User> users = new ArrayList<>();

        // 记录响应
        System.out.println("[" + requestId + "] Sending response...");

        // 在响应头中返回 requestId
        return ResponseEntity.ok()
            .header("X-Request-ID", requestId)
            .body(new ApiResponse(200, "Success", users));
    }
}
```

## 📈 RequestId 的最佳实践

### 1. 始终生成 RequestId

```typescript
// ✅ 好的做法
const requestId = generateRequestId();
config.headers['X-Request-ID'] = requestId;

// ❌ 不好的做法
// 没有生成 requestId
```

### 2. 在所有日志中使用 RequestId

```typescript
// ✅ 好的做法
console.log(`[${requestId}] Processing request...`);
console.log(`[${requestId}] Database query completed`);
console.log(`[${requestId}] Response sent`);

// ❌ 不好的做法
console.log('Processing request...');
console.log('Database query completed');
console.log('Response sent');
```

### 3. 在响应头中返回 RequestId

```typescript
// ✅ 好的做法
response.headers['X-Request-ID'] = requestId;

// ❌ 不好的做法
// 没有在响应头中返回 requestId
```

### 4. 在错误处理中使用 RequestId

```typescript
// ✅ 好的做法
catch (error) {
  console.error(`[${requestId}] Error occurred: ${error.message}`);
  res.status(500).json({
    code: 500,
    message: 'Internal Server Error',
    requestId: requestId,
  });
}

// ❌ 不好的做法
catch (error) {
  console.error('Error occurred:', error.message);
  res.status(500).json({
    code: 500,
    message: 'Internal Server Error',
  });
}
```

## 🔍 RequestId 的查询和分析

### 查看前端日志

```
打开浏览器开发者工具 (F12)
→ 切换到 Console 标签
→ 查看所有 API 请求的 requestId
```

### 查看后端日志

```bash
# 查找特定 requestId 的所有日志
grep "1700000000000-abc123def" /var/log/app.log

# 输出:
# 2024-11-21 14:30:45 [INFO] [1700000000000-abc123def] Request started
# 2024-11-21 14:30:45 [INFO] [1700000000000-abc123def] Database query
# 2024-11-21 14:30:45 [INFO] [1700000000000-abc123def] Response sent
```

### 分析性能

```bash
# 查找所有超过 1 秒的请求
grep "duration.*[1-9][0-9]{3,}ms" /var/log/app.log

# 输出:
# 2024-11-21 14:30:46 [WARN] [1700000000001-xyz789abc] Slow query (duration: 5000ms)
```

## 📊 RequestId 的数据结构

```typescript
// RequestId 的组成
requestId = timestamp + '-' + randomString

// 示例
1700000000000-abc123def
│              │
│              └─ 随机字符串 (9 位)
└─ 时间戳 (13 位，毫秒级)

// 优势
- 时间戳: 确保唯一性，便于排序
- 随机字符串: 增加随机性，避免碰撞
- 总长度: 23 位，易于存储和传输
```

## ✅ RequestId 的优势总结

| 优势 | 说明 |
|------|------|
| 🔗 **链路追踪** | 追踪请求从客户端到服务器的完整链路 |
| 🐛 **问题排查** | 快速定位问题发生的位置 |
| 📊 **性能分析** | 分析单个请求的性能瓶颈 |
| 🔐 **安全审计** | 记录用户操作，便于安全审计 |
| 📈 **数据分析** | 分析用户行为和系统性能 |
| 🔄 **分布式追踪** | 支持微服务架构中的请求追踪 |

## 🎯 总结

`requestId` 是一个**强大的工具**，用于：

1. **追踪请求链路** - 从客户端到服务器的完整路径
2. **关联前后端日志** - 通过相同的 ID 关联日志
3. **快速排查问题** - 通过 requestId 快速找到相关日志
4. **分析性能** - 识别性能瓶颈
5. **安全审计** - 记录用户操作

**建议**: 在所有生产环境中都应该使用 `requestId`，这是一个最佳实践。

---

**版本**: 1.0.0
**最后更新**: 2024年11月21日
**状态**: ✅ 完成
