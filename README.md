# Bem-vindo ao Zievo Test!

Este repositório contém uma aplicação Headless Angular em conjunto com uma API construída em PHP para gerenciamento de produtos e vendas e um banco de dados para armazenamento das informações. A aplicação foi criada como um desafio proposto pela empresa [Zievo](https://zievo.com.br), e pretende botar em pratica as minhas habilidades de desenvolvimento, tratamento de dados e estruturação de banco de dados. As instruções do teste podem ser verificadas no [link](https://felipestemler.com.br/zievo-test/assets/desafio-tecnico-php.pdf).

## Publicação

Foi criado um link para visualização do sistema em ambiente web.  O projeto publicado pode ser visualizado clicando no link abaixo: 

<aside>
💡 [https://felipestemler.com.br/zievo-test](https://felipestemler.com.br/zievo-test)

</aside>

## Tecnologias Utilizadas

Este projeto utiliza as seguintes tecnologias:

- **Angular**
- **PHP**
- **PostgreSQL**
- **MySQL (**Foi usado na versão Live devido a uma limitação do servidor).

## **Instalação**

### Clonar o Repositório

Para começar, clone este repositório para o seu ambiente local usando o seguinte comando:

```
git clone <https://github.com/FeStemler/zievo-test.git>
```

### Instalação do Angular CLI

Certifique-se de ter o Angular CLI instalado globalmente. Se não tiver, você pode instalar executando o seguinte comando:

```
npm install -g @angular/cli
```

### Instalação dos Módulos

Navegue até o diretório do projeto clonado e instale as dependências do projeto usando o npm:

```
cd zievo-test
npm install
```

### Iniciar o Servidor de Desenvolvimento

Após instalar as dependências, você pode iniciar o servidor de desenvolvimento executando o seguinte comando:

```
ng serve -o
```

Isso abrirá automaticamente o navegador padrão no endereço `http://localhost:4200/`, onde você poderá visualizar a aplicação em execução.

## Instalação da API (Servidor PHP)

Para a execução correta da aplicação, você precisará configurar um servidor PHP local para fornecer os serviços de back-end necessários. Siga estas etapas:

1. Certifique-se de ter o PHP instalado em seu sistema. Você pode verificar se o PHP está instalado executando o seguinte comando no terminal:
    
    ```
    php -v
    ```
    
    Se o PHP estiver instalado, você verá uma mensagem mostrando a versão do PHP. Caso contrário, será necessário instalar o PHP antes de prosseguir.
    
2. Configure um servidor PHP local. Existem várias opções disponíveis, como XAMPP, WAMP, ou simplesmente configurar um servidor Apache local.
3. Uma vez que o servidor PHP esteja configurado, navegue até o diretório onde você clonou o repositório da API.
4. Inicie o servidor PHP. Dependendo da sua configuração específica, você pode usar o seguinte comando para iniciar o servidor:
    
    ```
    php -S localhost:8000
    ```
    
    Isso iniciará um servidor PHP local na porta 8000. Se você estiver usando uma ferramenta como XAMPP ou WAMP, siga as instruções específicas da ferramenta para iniciar o servidor.
    
5. Certifique-se de que a API esteja funcionando corretamente, acessando `http://localhost:8000` em seu navegador. Você deve ver uma mensagem indicando que a API está em execução.
6. Se necessário, ajuste as configurações da aplicação Angular para se conectar à API local. Isso geralmente envolve modificar os URLs de API para apontar para `http://localhost:8000` ou o endereço que você configurou para o servidor PHP.

Com a API em execução e devidamente configurada, você pode iniciar a aplicação Angular e começar a testar!

## Estrutura do Projeto

Para facilitar a navegação entre as pastas, seguem instruções sobre a estrutura do projeto Angular:

- **Dist**: Esta pasta contém os arquivos de deploy automático do Angular. Aqui estão todos os arquivos necessários para replicar o projeto, incluindo:
    - **Build da Aplicação**: Localizado sob o nome "Zievo-front".
    - **API em PHP**: Localizado sob o nome "api".
    - **Banco de Dados PostgreSQL**.
- **Src**: Aqui é onde a aplicação Angular foi construída, juntamente com seus arquivos e lógica. Optamos pela estrutura MVC (Model, View e Controller), organizando as pastas da seguinte forma:
    - **App**
        - **Interfaces (Model)**: Define o modelo de dados utilizado na aplicação.
        - **Components (View)**: Componentes da interface de usuário.
        - **Services (Controller)**: Serviços para controle de dados. Foram criados três serviços principais:
            - **StateControl**: Controla ações e alterações na página.
            - **ZievoApi**: Realiza conexão com a API em PHP utilizando o http do angular.
            - **DataControl**: Armazena funções de formatação de dados compartilhadas por mais de um componente.

A seguir, seguem detalhes das rotas principais da API em PHP:

- **apiProdutos.php**: Esta rota trata das operações relacionadas a produtos, como recuperar dados ou cadastrar novos produtos.
- **apiTipoProduto.php**: Aqui, você pode acessar informações sobre tipos de produtos e também cadastrar novos tipos.
- **apiVendas.php**: Responsável por lidar com informações de vendas, permitindo a recuperação de dados e o registro de novas vendas.

## Contato

Se você tiver alguma dúvida ou feedback sobre esta aplicação, sinta-se à vontade para entrar em contato comigo através dos seguintes meios:

- **E-mail**: [fe.stemler@gmail.com](mailto:fe.stemler@gmail.com)
- **LinkedIn**: [https://www.linkedin.com/in/felipe-henrique-stemler-gomes/](https://www.linkedin.com/in/felipe-henrique-stemler-gomes/)
