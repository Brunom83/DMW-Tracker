# 🥚 DMW Farm Tracker

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square)
![Maintenance](https://img.shields.io/badge/maintained-yes-green.svg?style=flat-square)
![DMW](https://img.shields.io/badge/Digimon_Masters-World-orange.svg?style=flat-square)

> **Nota:** Uma aplicação web desenvolvida especificamente para jogadores do **Digimon Masters World (DMW)**. Organiza o teu farm, controla as moedas e maximiza o teu tempo de jogo.

---

## Descrição do Projeto
O **DMW Farm Tracker** ajuda os jogadores a organizar e otimizar o seu tempo de jogo através de um sistema completo de tracking de farm, conversão de moedas e progresso.

### Objetivo Principal
* **Controlar ganhos:** Monitoriza Tera, Mega e Bits em sessões de farm.
* **Organizar Tours:** Alertas para Forest Tour, Bless Tour, etc.
* **Métricas:** Estatísticas de eficiência para maximizar o grind.

---

## Funcionalidades Principais

### 💰 Sistema de Moedas
* Controlo "Antes/Depois" de sessões.
* Conversão automática (Tera ↔ Mega ↔ Bits).
* Histórico de sessões salvo localmente.

### 🥚 Calculadora de Cracked Eggs
* Suporte para 7 tipos de ovos.
* Cálculo em tempo real do valor total.
* Valores ajustáveis conforme a economia do servidor.

### 🏹 Sistema de Tours (Timers)
* **Forest Tour:** (8 raids × 300M) = ~2.4T
* **Bless Tour:** (3 mapas × 0.9T) = ~2.8T
* Notificações sonoras e visuais.

---

## Tecnologias Utilizadas

| Tech | Descrição |
| :--- | :--- |
| **HTML5** | Estrutura semântica |
| **CSS3** | Estilos modernos (Glassmorphism, Dark Theme) |
| **JavaScript (ES6+)** | Lógica da aplicação (Vanilla) |
| **Bootstrap 5** | Layout responsivo |
| **LocalStorage** | Persistência de dados (Offline-first) |
| **Docker** | Containerização para deploy fácil |

---

## Estrutura do Projeto

```text
dmw-farm-tracker/
├── src/
│   ├── js/          # Lógica modular
│   ├── css/         # Estilos
│   └── index.html   # Interface
├── Dockerfile
├── docker-compose.yml
└── README.md