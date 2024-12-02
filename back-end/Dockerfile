# 1. Use uma imagem base do Node.js
FROM node:18

# 2. Configure o diretório de trabalho
WORKDIR /app

# 3. Copie os arquivos do backend para o container
COPY package*.json ./

# 4. Instale as dependências
RUN npm install

# 5. Copie o restante do código para o container
COPY . .

# 6. Exponha a porta onde o servidor backend será executado
EXPOSE 5000

# 7. Comando para iniciar o servidor
CMD ["npm", "start"]
