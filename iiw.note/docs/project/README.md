# 项目开发

公司除了安防平台项目，还有很多其他的大小项目。

## 安防平台

### 在本机部署一套安防平台测试服务

### 平时开发测试

> 用webstorm开发


> 用vscode开发

欲了解更多信息，请访问: <https://go.microsoft.com/fwlink/?linkid=830387>

```json5
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "hardware",
            "cwd": "C:\\Users\\iotimc\\Desktop\\iotimc\\iiw.safe\\iiw.safe.hardware",
            "program": "C:\\Users\\iotimc\\Desktop\\iotimc\\iiwlib\\server.js"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "hardware.list",
            "cwd": "C:\\Users\\iotimc\\Desktop\\iotimc\\iiw.safe\\iiw.safe.hardware\\modules\\iiw.safe.hardware.list",
            "program": "C:\\Users\\iotimc\\Desktop\\iotimc\\iiwlib\\server.js"
        }
    ]
}
```
