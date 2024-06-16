# Estágio de construção
FROM node:16 AS builder
WORKDIR /app

# Instalação do NestJS CLI globalmente
RUN npm install -g @nestjs/cli

# Copiar arquivos de configuração e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Build do projeto NestJS
RUN npm run build

# Segundo estágio para produção
FROM node:16-alpine
WORKDIR /app

# Copiar arquivos do estágio de construção
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Instalar dependências de produção
RUN npm install --production

# Expor a porta 3000 e definir o comando padrão
EXPOSE 3000
CMD ["node", "dist/main"]