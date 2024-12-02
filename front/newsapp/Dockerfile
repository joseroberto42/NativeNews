# 1. Use uma imagem base do Node.js para construção
FROM node:18 as builder

# 2. Configure o diretório de trabalho
WORKDIR /app

# 3. Copie os arquivos do frontend para o container
COPY package*.json ./

# 4. Instale as dependências
RUN npm install

# 5. Copie o restante do código e construa o projeto
COPY . .
RUN npm run build

# 6. Use uma imagem mais leve para servir os arquivos (opcional para apps React Native, mas útil para web)
FROM nginx:alpine

# 7. Copie os arquivos construídos para o diretório padrão do Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# 8. Exponha a porta onde o frontend será servido
EXPOSE 80

# 9. Inicie o Nginx
CMD ["nginx", "-g", "daemon off;"]
