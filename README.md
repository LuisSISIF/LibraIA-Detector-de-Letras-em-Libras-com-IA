<p align="center">
<img src="img/logoLibraIA.png" width="220">
</p>

# 👐 LibraIA - Detector de Letras em Libras

**LibraIA** é um aplicativo web responsivo que utiliza **Teachable Machine + TensorFlow.js** para reconhecer letras **A-Z da Língua Brasileira de Sinais (Libras)** em tempo real através da webcam ou por upload de imagem.

O projeto tem como objetivo **promover inclusão digital, acessibilidade e aprendizagem de Libras utilizando Inteligência Artificial**.

---

# ✨ Demonstração

*(Adicione aqui um screenshot ou GIF do sistema funcionando)*

screenshots/demo.png

---

# 🚀 Funcionalidades

🔴🟢 **Predição visual**  
Resultado colorido indicando detecção da letra com percentual de confiança.

📱 **Responsivo**  
Interface adaptada para **desktop e dispositivos móveis**.

🔄 **Alternar câmera**  
Permite utilizar câmera **frontal ou traseira** para melhor detecção.

📁 **Upload de imagem**  
Envie uma imagem contendo um gesto de Libras para análise instantânea.

⚡ **Detecção em tempo real**  
Atualização contínua da predição a cada segundo através da webcam.

---

# 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologias |
|----------|-------------|
| Frontend | HTML5, CSS3, JavaScript Vanilla |
| IA / Machine Learning | TensorFlow.js |
| Treinamento do modelo | Teachable Machine |
| Layout | Flexbox, CSS Grid |
| Ferramentas de desenvolvimento | Live Server |

---

# 📋 Pré-requisitos

Antes de executar o projeto você precisará de:

- Navegador moderno (Chrome, Firefox ou Safari)
- Webcam (para detecção em tempo real)
- Servidor local (necessário por causa de CORS)

---

# 🎯 Como Usar

## 1️⃣ Clonar o repositório

git clone https://github.com/LuisSISIF/LibraIA-Detector-de-Letras-em-Libras-com-IA.git  
cd LibraIA-Detector-de-Letras-em-Libras-com-IA

---

## 2️⃣ Baixar ou treinar o modelo

1. Acesse o Teachable Machine  
2. Crie um projeto **Image Project**  
3. Treine as classes de letras em Libras  
4. Exporte em **TensorFlow.js**  
5. Extraia os arquivos dentro da pasta:

/my_model

---

## 3️⃣ Rodar um servidor local

### Python

python -m http.server 8000

### Node.js

npx http-server . -p 8000

---

## 4️⃣ Acessar o sistema

Abra no navegador:

http://localhost:8000

---

# 🔎 Fluxo de Uso

1️⃣ Clique em **🚀 Iniciar Detecção**

2️⃣ Faça o gesto de uma letra em Libras na frente da câmera

3️⃣ O sistema exibirá a **letra detectada com nível de confiança**

4️⃣ Você também pode **enviar imagens para teste rápido**

---

# 📁 Estrutura do Projeto

| Arquivo | Descrição |
|--------|-----------|
| 📄 index.html | Interface principal |
| 🎨 style.css | Estilização e layout responsivo |
| ⚙️ script.js | Lógica da aplicação e integração com IA |
| 🤖 my_model/ | Arquivos do modelo TensorFlow.js |
| 🖼️ screenshots/ | Imagens e demonstrações do projeto |

---

# 🤝 Contribuições

Contribuições são sempre bem-vindas.

1. Faça um Fork  
2. Crie uma Branch  
3. Commit suas alterações  
4. Envie um Pull Request

---

# 📄 Licença

Este projeto está distribuído sob a licença **MIT**.

Veja o arquivo **LICENSE** para mais detalhes.

---

# 🤝 Apoio Tecnológico

<p align="center">

Projeto desenvolvido por <b>Luís Henrique Freire de Lima</b>  
com suporte tecnológico da

<a href="https://www.andromedasolutions.com.br">
<img src="img/logoAndromeda.png" width="220">
</a>

</p>

---

# 🙌 Autor

**Luís Henrique Freire de Lima**

LinkedIn  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lu%C3%ADs-henrique-freire-de-lima/) 

GitHub  
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LuisSISIF)

---

💙 Feito com dedicação para promover **acessibilidade, inclusão digital e aprendizado de Libras através da Inteligência Artificial.**

#Libras #InteligenciaArtificial #Acessibilidade #TensorFlowJS
