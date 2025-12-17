# Usar uma imagem base super leve do Nginx (Alpine Linux)
FROM nginx:alpine

# Copiar os ficheiros do teu projeto para a pasta pública do Nginx
COPY . /usr/share/nginx/html

# Expor a porta 80 (padrão web)
EXPOSE 80

# O comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]