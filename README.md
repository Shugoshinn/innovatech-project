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
│       └── deploy.yml          # Pipeline CI/CD automatizado hacia AWS ECR y EKS
├── api-rest-despachos/
│   ├── src/main/resources/     # Incluye data.sql para el Data Seeding automático
│   ├── Dockerfile              # Dockerfile de la API Despachos
│   └── ... 
├── api-rest-ventas/
│   ├── src/main/resources/     # Incluye data.sql para el Data Seeding automático
│   ├── Dockerfile              # Dockerfile de la API Ventas
│   └── ... 
├── frontend/
│   ├── default.conf.template   # Configuración de Nginx para enrutamiento interno
│   ├── Dockerfile              # Dockerfile de la capa de presentación (React + Nginx)
│   └── ... 
└── infra/                      # Infraestructura como Código (IaC)
    ├── terraform/              # Archivos .tf para VPC, EKS, RDS y Security Groups
    └── k8s/                    # Manifiestos de Kubernetes (Deployments, Services, HPA)
        ├── frontend.yml
        ├── backend_ventas.yml
        ├── backend_despacho.yml
        └── mysql.yml

---

## ⚙️ 2. Stack Tecnológico

El ecosistema de la plataforma está construido utilizando herramientas líderes en la industria para garantizar escalabilidad y tolerancia a fallos:

* **Frontend:** React.js, Vite, Axios.
* **Backend Microservicios:** Java 17, Spring Boot, Hibernate (JPA), Maven.
* **Base de Datos:** MySQL 8.0 (optimizado con HikariCP para el pool de conexiones).
* **Infraestructura Cloud (AWS):** EKS (Elastic Kubernetes Service), EC2 (Nodos worker), ECR (Elastic Container Registry), ALB (Application Load Balancer), VPC.
* **DevOps & IaC:** Docker, Terraform, GitHub Actions, Nginx (como Reverse Proxy / API Gateway interno).

---

## 🚀 3. Flujo de Integración y Despliegue Continuo (CI/CD)

El proyecto cuenta con un pipeline completamente automatizado mediante **GitHub Actions** que asegura despliegues ágiles y sin tiempo de inactividad (*Zero-Downtime*). El flujo se activa con cada `push` al repositorio y consta de tres etapas críticas:

1. **Build:** Compilación del código fuente de los microservicios y el frontend, y empaquetado en imágenes Docker aisladas.
2. **Push:** Autenticación segura mediante roles/credenciales y subida de las nuevas versiones a repositorios privados en **Amazon ECR**.
3. **Deploy:** Ejecución automática de comandos `kubectl` para actualizar los *Deployments* en el clúster de **Amazon EKS**. Se utiliza la estrategia de *Rolling Update*, donde Kubernetes verifica la salud del nuevo contenedor antes de apagar el antiguo, garantizando la continuidad operativa.

---

## 🛠️ 4. Instrucciones de Despliegue Local y Cloud

Sigue estos pasos para aprovisionar la infraestructura desde cero y desplegar los microservicios de Innovatech.

### Requisitos Previos

Asegúrate de tener instalados: `aws-cli`, `terraform`, `kubectl` y `git`.
Configura tus credenciales de acceso a AWS en tu terminal local:

```bash
aws configure

```

### Paso 1: Aprovisionar la Infraestructura (Terraform)

Este paso creará las redes, subredes, grupos de seguridad y el clúster EKS en tu cuenta de AWS.

```bash
# Navegar a la carpeta de infraestructura
cd infra/terraform

# Inicializar y aplicar los cambios
terraform init
terraform apply

```

*(Confirma con `yes` cuando la terminal lo solicite. Este proceso puede tardar entre 10 y 15 minutos).*

### Paso 2: Conectar `kubectl` al Clúster EKS

Una vez que Terraform finalice, actualiza el contexto de tu entorno local para poder enviarle comandos a Kubernetes:

```bash
aws eks update-kubeconfig --region us-east-1 --name <nombre-de-tu-cluster>

```

### Paso 3: Desplegar los Microservicios

Aplica los manifiestos YAML para instanciar la base de datos, los backends, el frontend y la configuración de enrutamiento interno.

```bash
# Navegar a la carpeta de Kubernetes
cd ../k8s

# Aplicar todos los manifiestos de un solo golpe
kubectl apply -f .

```

### Paso 4: Verificación y Data Seeding Automático

Gracias a la implementación de **Data Seeding** automatizado, no es necesario realizar inserciones manuales (DML). Una vez que los contenedores de Spring Boot se levantan, ejecutan internamente sus respectivos scripts `data.sql`, poblando la base de datos MySQL con información de prueba realista para ventas y logística.

Para ver la aplicación funcionando:

1. Obtén la URL pública de tu balanceador de carga:
```bash
kubectl get svc frontend

```


2. Copia la URL de la columna `EXTERNAL-IP`, pégala en tu navegador y haz clic en el botón de **Consultar** para ver el cruce de datos en tiempo real.