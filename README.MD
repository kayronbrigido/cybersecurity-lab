# 🛡️ Cybersecurity Lab

### Hands-on Security Labs for Developers

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/kayronbrigido/cybersecurity-lab)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![OWASP](https://img.shields.io/badge/OWASP-Security%20Labs-000000?logo=owasp)](https://owasp.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Contributions](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)](CONTRIBUTING.md)

**Learn. Test. Secure. Repeat.**

Cybersecurity Lab is an open-source educational project designed to help developers and aspiring security professionals learn cybersecurity through practical, hands-on exercises.

The project covers web application security, penetration testing, network security, infrastructure, cloud security, and DevSecOps.

Each laboratory provides a controlled environment where you can understand vulnerabilities, reproduce security issues, analyze their impact, and implement appropriate mitigations.

The goal is not only to learn how to identify vulnerabilities, but also how to build more secure applications and infrastructure.

---

## 🎯 Project Objectives

- Develop practical cybersecurity and penetration testing skills.
- Understand common web application and API vulnerabilities.
- Learn how to identify and analyze security weaknesses.
- Practice vulnerability exploitation in authorized environments.
- Understand security mechanisms and defensive strategies.
- Apply security best practices to Full Stack applications.
- Integrate security testing into development workflows and CI/CD pipelines.
- Build a collaborative knowledge base for the cybersecurity community.

## 🧭 Learning Path

The laboratories are organized into progressive learning levels, allowing beginners to develop their skills while providing more advanced challenges for experienced developers.

| Level | Area | Topics |
|---|---|---|
| 01 | Web Application Security | OWASP Top 10, XSS, SQL Injection, IDOR, CSRF |

Difficulty will increase progressively as new laboratories are introduced.

## 🧪 Available Laboratories

Each laboratory is designed to be independent, reproducible, and focused on a specific security topic.

| # | Laboratory | Topics | Difficulty |
|---|---|---|---|
| 01 | IDOR & BOLA in REST APIs | API Security, Authorization, Multi-tenancy | Intermediate |

> **Note:** The roadmap includes planned topics. Check each laboratory directory for implementation status and available instructions.

## 🛠️ Tools & Technologies

The project uses open-source tools and technologies commonly found in cybersecurity and software engineering environments.

### Security & Penetration Testing

- [Kali Linux](https://www.kali.org/)
- [Nmap](https://nmap.org/)
- [OWASP ZAP](https://www.zaproxy.org/)
- [Metasploit Framework](https://www.metasploit.com/)
- [WhatWeb](https://github.com/urbanadventurer/WhatWeb)
- [WPScan](https://wpscan.com/)
- [Wireshark](https://www.wireshark.org/)

### Application Security

- [OWASP](https://owasp.org/)
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)
- [Burp Suite](https://portswigger.net/burp)
- [JWT](https://jwt.io/)

### Infrastructure & Cloud

- [Docker](https://www.docker.com/)
- Linux
- AWS
- Docker Compose

### Development & Automation

- Node.js
- TypeScript
- Python
- Bash
- PowerShell
- GitHub Actions

Tools may vary depending on the laboratory.

## 🚀 Getting Started

### Prerequisites

Most laboratories require some combination of the following tools:

- Docker and Docker Compose
- Git
- Kali Linux or another Linux distribution
- Node.js
- Basic knowledge of HTTP, networking, and web development

Check the prerequisites listed in each laboratory before starting.

### Clone the repository

```bash
git clone https://github.com/kayronbrigido/cybersecurity-lab.git

cd cybersecurity-lab
```

### Choose a laboratory

Navigate to the desired laboratory directory.

For example:

```bash
cd labs/01-idor-bola
```

Follow the instructions provided in its `README.md` file.

Laboratories that use Docker generally provide their own `Dockerfile` and/or `compose.yaml` configuration.

## 📚 Laboratory Structure

Each laboratory follows a consistent documentation format to make the exercises easier to understand and reproduce.

```text
labs/
├── 01-idor-bola/
│   ├── README.md
│   ├── Dockerfile
│   ├── compose.yaml
│   ├── security-test.sh
│
│
└── 02-another-security/
    └── README.md
```

### Standard Laboratory Contents

Each laboratory aims to include:

1. **Objective & Concepts** — What will be studied and why it matters.
2. **Prerequisites** — Required tools and technical knowledge.
3. **Lab Environment** — Authorized and isolated testing environment.
4. **Step-by-Step Instructions** — Commands and practical explanations.
5. **Expected Results** — How to interpret the results.
6. **Vulnerability Analysis** — Root cause and potential impact.
7. **Mitigation & Remediation** — How to fix the identified issue.
8. **Security Testing** — How to validate the correction.
9. **Evidence & Report** — A practical reporting template.
10. **References** — Additional documentation and learning resources.

## 🔐 Security & Ethical Guidelines

This project is intended exclusively for educational purposes and authorized security testing.

All practical exercises must be performed in controlled environments, such as local Docker containers, intentionally vulnerable applications, or dedicated training machines.

**Important rules:**

- Only test systems you own or have explicit permission to assess.
- Never perform unauthorized security testing against third-party systems.
- Do not use the techniques presented here to access, modify, or expose other people's data.
- Avoid destructive exploitation, denial-of-service attacks, and activities that may disrupt real services.
- Never include real credentials, API keys, tokens, or sensitive information in laboratory files.
- Follow responsible disclosure practices when handling vulnerabilities discovered outside your own lab.

The maintainers are not responsible for misuse of the information provided in this repository.

## 🤝 Contributing

Contributions from the cybersecurity and software development communities are welcome!

You can contribute by:

- Creating new practical laboratories.
- Improving existing documentation.
- Adding security testing examples.
- Fixing errors or outdated instructions.
- Translating laboratories into other languages.
- Suggesting new topics and learning resources.

### Contribution Guidelines

When submitting a new laboratory, please ensure that it:

- Uses an authorized and controlled testing environment.
- Includes clear setup and execution instructions.
- Explains the underlying security concepts.
- Demonstrates appropriate mitigation strategies.
- Provides reproducible results.
- Includes references to reliable technical documentation.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a contribution.

## 📖 References & Learning Resources

The following resources are recommended for further study:

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [MITRE ATT&CK](https://attack.mitre.org/)
- [CIS Critical Security Controls](https://www.cisecurity.org/controls)


## 📄 License

This project is intended to be distributed under the MIT License.

See the [LICENSE](LICENSE) file for details.

---

## ⭐ Support the Project

If you find this project useful, consider giving it a star ⭐ on GitHub.

Share it with other developers, contribute new laboratories, and help make cybersecurity knowledge more accessible to the