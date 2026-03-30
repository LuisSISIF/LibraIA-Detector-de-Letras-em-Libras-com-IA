👐 LibraIA - Detector de Letras em Libras



LibraIA é um app web responsivo que usa Teachable Machine + TensorFlow.js para reconhecer letras A-Z da Língua Brasileira de Sinais (Libras) em tempo real via webcam ou upload de imagem. Promove inclusão digital e acessibilidade!

✨ Demo
(Adicione screenshot do app funcionando)

🚀 Funcionalidades
🔴🟢 Predição visual: Resultado colorido (verde=detectado, vermelho="sem/no") com % confiança

📱 Responsivo: Funciona em mobile/desktop

🔄 Alternar câmera: Frontal/traseira para melhor detecção

📁 Upload imagem: Predição instantânea em fotos

⚡ Real-time: Atualiza a cada 1 segundo na webcam

🛠️ Tecnologias
Frontend	IA/ML	Ferramentas
HTML5/CSS3/JS Vanilla	TensorFlow.js	Teachable Machine
Flexbox/Grid	-	Live Server
📋 Pré-requisitos
Navegador moderno (Chrome/Firefox/Safari)

Webcam (para detecção real-time)

Servidor local (devido CORS)

🎯 Como Usar
1. Clone o repositório
bash
git clone https://github.com/LuisSISIF/LibraIA-Detector-de-Letras-em-Libras-com-IA.git
cd LibraIA-Detector-de-Letras-em-Libras-com-IA
2. Baixe o modelo
Treine em Teachable Machine Image

Exporte TensorFlow.js → Extraia em ./my_model/

3. Rode servidor local
bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server . -p 8000
4. Acesse
text
http://localhost:8000
Fluxo:

Clique "🚀 Iniciar Detecção"

Faça gesto de letra em Libras na câmera

Upload foto para teste rápido

## 📁 **Estrutura**

| Arquivo | Descrição |
|---------|-----------|
| `📄 index.html` | Interface principal |
| `🎨 style.css` | Design responsivo |
| `⚙️ script.js` | Lógica IA completa |
| `🤖 my_model/` | **Modelos aqui** |
| `🖼️ screenshots/` | Imagens demo |

## 🤝 **Contribuições**
1. Fork → Branch → Commit → PR

📄 Licença
Distribuído sob a licença MIT. Veja LICENSE para mais detalhes.

## 🙌 **Autor**

**Luís Henrique Freire de Lima**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lu%C3%ADs-henrique-freire-de-lima/) 
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LuisSISIF)

Feito com ❤️ para inclusão em Libras! #Libras #IA #Acessibilidade #TensorFlowJS
