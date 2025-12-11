# Imagem base do Node
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copia apenas package.json e package-lock.json primeiro
COPY package*.json ./

# Instala dependências (modo produção)
RUN npm install --only=production

# Copia o restante do código
COPY . .

# Variável de porta (caso o Easypanel use)
ENV PORT=3001

# Expõe a porta (ajuda no mapeamento)
EXPOSE 3001

# Comando para iniciar o app
CMD ["npm", "start"]
