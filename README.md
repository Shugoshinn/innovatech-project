# Innovatech Chile - Plataforma de Microservicios (Frontend & Backend)
## Proyecto de Automatización, Contenedorización e Infraestructura como Código (IaC)

Este repositorio contiene la solución completa de DevOps para el despliegue automatizado y seguro de la plataforma de **Innovatech Chile**, estructurado bajo un modelo de **Monorepo** que integra los componentes de Frontend, Backend (Microservicios de Ventas y Despachos) e Infraestructura.

El diseño arquitectónico y de automatización cumple estrictamente con los estándares requeridos en la pauta de evaluación de **Introducción a Herramientas DevOps (ISY1101)** de Duoc UC.

---

## 🏗️ 1. Arquitectura del Repositorio (Monorepo)

La solución está organizada de forma lineal y clara para permitir la gestión unificada de los servicios y su infraestructura:

```text
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline CI/CD completamente automatizado
├── api-rest-despachos/
│   ├── Dockerfile              # Dockerfile Optimizado (Multi-stage + Non-root)
│   ├── entrypoint.sh           # Script de control de orden de arranque (wait-for-it)
│   └── ...                     # Código fuente de la API Despachos
├── api-rest-ventas/
│   ├── Dockerfile              # Dockerfile Optimizado (Multi-stage + Non-root)
│   ├── entrypoint.sh           # Script de control de orden de arranque (wait-for-it)
│   └── ...                     # Código fuente de la API Ventas
├── frontend/
│   ├── Dockerfile              # Dockerfile de la capa de presentación
│   └── ...                     # Código fuente del Frontend
├── infra/                      # Infraestructura como Código (IaC) con Terraform
│   ├── main.tf                 # Definición de Red (VPC), Security Groups y EC2
│   └── ...
└── docker-compose.yml          # Orquestador del stack completo de servicios