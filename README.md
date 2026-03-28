# 🏠 Red House — 训战设计平台

> 企业场景化模拟训战课程自助设计工具

## 产品定位

面向企业人才发展负责人、培训师、OD/TD 专家，帮助用户自助设计高质量的场景化模拟训战课程，覆盖交付前准备、交付中执行、交付后能力迁移与评价全流程。

## 功能模块

| 阶段 | 状态 | 说明 |
|------|------|------|
| Phase 0 — 品牌首页 | ✅ 已完成 | 红色系深色专业风格 (`index.html`) |
| Phase 1 — 洞察定义 | ✅ 已完成 | 商业影响图·场景萃取·行为清单 (`app.html`) |
| Phase 2 — 模拟设计 | ⏳ 规划中 | 7要素画布 |
| Phase 3 — 原型验证 | ⏳ 规划中 | ABCD行为评估 |

## 技术架构

- **纯前端**：HTML / CSS / JavaScript，无后端依赖
- **持久化**：浏览器 localStorage（key: `rh_projects_v1`）
- **AI 支持**：内置 AI API 配置（支持 OpenAI / 兼容接口）
- **零依赖部署**：直接托管静态文件即可

## 快速开始

### 本地运行
```bash
cd RedHouse
python3 -m http.server 7788
# 打开 http://localhost:7788
```

### 文件结构
```
RedHouse/
├── index.html      # 品牌首页
├── app.html        # 工作台主应用
└── README.md
```

## 设计原则

- 产出物以**屏幕可视化报告**为优先，再支持打印/PDF 导出
- 与 Eureka / Persona Lab 系列**严格隔离**，独立部署
- 界面风格：红色系深色，专业严肃

---

*Built with ❤️ for L&D professionals*
