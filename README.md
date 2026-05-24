# OpenGeon

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## Sobre

**OpenGeon** é um projeto focado em localizar mercados e postos de gasolina em um raio de 10 km do usuário, ou qualquer área desejada. É possível ver a latitude, longitude e total de postos e mercados na aba lateral, ao lado do mapa.

Pins vermelhos (*mercados*) e azuis (*postos de gasolina*) serão exibidos no mapa para rápida identificação desses estabelecimentos. Mostrando suas coordenadas ao serem pressionados. 
ㅤ
<br>
<br>
![image](./src/imagens/github/github(2).png)
ㅤㅤ
## Como usar

Ao acessar o site, uma janela solicitando acesso a localização será exibida na parte superior da tela, clique em ```Permitir```.

![image](./src/imagens/github/github(1).png)


Os pins azuis e vermelhos indicam as posições dos mercados e postos de gasolina no mapa. Clique em cima de um pin para ver sua latitude e longitude.

![image](./src/imagens/github/github(3).png)


Em caso de recusa, a localização padrão, Brasília, será usada.

![image](./src/imagens/github/github(4).png)


Para escolher outros endereços clique em ```Selecionar cep```, digite o cep da localização desejada e clique na lupa.

![image](./src/imagens/github/github(5).png)


Para coordenadas inválidas um aviso será exibido no canto inferior direito, e a localização padrão será usada.

![image](./src/imagens/github/github(6).png)

## Funcionalidades

- Coleta da localização atual
- Mapa completo, com legendas para identificação e zoom
- Personalização da latitude e longitude, para maior precisão (usuário)
- Marcadores em postos e mercados em um raio de 10 km
- Exibição da latitude e longitude em tempo real
- Coordenadas a partir do CEP
- Mapa mundial interativo

## Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização e responsividade |
| JavaScript | Interatividade no frontend e chamadas à API's |

| Biblioteca | Uso |
|---|---|
| Leaflet.js | Renderização do mapa |
| Bootstrap | Notificações |
| Notyf | Responsividade e componentes |
| Font Awesome | Ícones |

## Estrutura do projeto

```bash
OpenGeon/
├── src/
│   └──style.css
│   └──app.js
│   └──imagens/
├── index.html
├── README.md
```

## Acesse

> [Acesse aqui](https://luizagsoaress.github.io/OpenGeo)
