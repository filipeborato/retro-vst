# Retro VST Effects – Create React App

Este projeto foi iniciado com [Create React App](https://github.com/facebook/create-react-app), mas evoluiu para ser uma plataforma de efeitos de áudio em tempo real, integrando funcionalidades de login, backend protegido, manipulação de plugins e parâmetros.

## Estrutura Geral do Projeto

- **src/**
  - **components/**
    - **Navbar.js**: Barra de navegação com nome do usuário, créditos e botão de login/logout.
    - **PluginGrid.js**: Exibe a lista de plugins disponíveis.
    - **PluginModal.js**: Modal para exibir e manipular parâmetros de um plugin específico. Inclui:
      - Upload de arquivo de áudio.
      - Parâmetros (sliders, toggles e selects) com labels para o usuário.
      - Botões de Preview e Process com estado de carregamento (loading).
      - Integração com backend para envio do arquivo e parâmetros.
    - **LoginModal.js**: Modal para login e signup, exibindo erros de autenticação e usando token para rota /profile.
    - **WaveformSelector.js** (opcional): Visualização e seleção do ponto de preview do áudio.
  - **Plugin.json**: Arquivo de configuração dos plugins. Cada plugin tem:
    - **id**: identificador.
    - **label**: texto de exibição (por exemplo, “Filter Stereo”, “The Function”).
    - **name**: identificador para o backend (por exemplo, “filter-stereo”).
    - **description**: texto descritivo.
    - **parameters**: array de parâmetros (sliders, toggles, selects) com campos { name, type, min, max, defaultValue, ... }.
  - **styles/**: Arquivos CSS para estilização (Navbar.css, PluginModal.css, etc.).
  - **App.js**: Componente principal.
    - Gerencia estado global (perfil do usuário, plugins selecionados, etc.).
    - Chama o LoginModal, PluginModal, etc.

- **public/**: Pasta pública com index.html.

## Scripts Disponíveis

No diretório do projeto, você pode executar:

### `npm start`

Executa a aplicação em modo de desenvolvimento.\
Abra [http://localhost:3000](http://localhost:3000) para visualizar no navegador.

A página recarrega quando você faz alterações no código.\
Você também verá erros de lint no console.

### `npm test`

Inicia o test runner em modo interativo de observação.\
Veja a seção sobre [running tests](https://facebook.github.io/create-react-app/docs/running-tests) para mais informações.

### `npm run build`

Compila a aplicação para produção na pasta `build`.\
Empacota corretamente o React em modo de produção e otimiza para melhor performance.

Os arquivos são minificados e os nomes incluem hashes.\
Sua aplicação está pronta para deploy!

Veja a seção sobre [deployment](https://facebook.github.io/create-react-app/docs/deployment) para mais informações.

### `npm run eject`

**Atenção: esta é uma operação sem volta. Uma vez que você `eject`, não pode retornar!**

Se você não estiver satisfeito com a configuração de build e de ferramentas, pode executar `eject` a qualquer momento. Este comando removerá a dependência única de build do seu projeto.

Depois disso, todos os arquivos de configuração e as dependências transitivas (webpack, Babel, ESLint, etc.) serão copiados diretamente para o seu projeto, para que você tenha controle total. Neste ponto, você está por conta própria.

Você nunca precisa usar `eject`. O conjunto de recursos fornecido pelo Create React App é bom para pequenos e médios deploys, e você não deve se sentir obrigado a usar esse recurso. Porém, ele existe para quando você precisar personalizar a configuração.

## Funcionalidades Principais do Projeto

1. **Login/Signup com Token e Rota /profile**:
   - Ao efetuar login ou signup, o usuário recebe um token.\
   - O token é armazenado em cookies (ou localStorage) para requisições subsequentes.\
   - Uso de rota protegida `/profile` para buscar dados do usuário (ex.: nome e saldo).

2. **Navbar Dinâmica**:
   - Exibe os dados do usuário (nome, créditos) e o botão de logout se o usuário estiver logado.\
   - Exibe "Guest" e o botão "Login / Signup" se não houver perfil carregado.

3. **PluginGrid**:
   - Lista de plugins (lidos do `Plugin.json`).\
   - Cada plugin possui `id`, `label` (para exibição), `name` (para o backend), `description` e uma lista de `parameters`.

4. **PluginModal**:
   - Ao clicar em um plugin na grid, abre um modal.
   - Exibe título (campo `plugin.label`) e descrição (`plugin.description`).
   - Lista parâmetros:
     - **Sliders** com range (min, max, step).\
     - **Toggles** (ON/OFF).\
     - **Selects** com opções.
   - Permite upload de um arquivo de áudio (com validações de extensão e tamanho).
   - Quando o usuário clica em **Preview** ou **Process**:
     - Bloqueia a interface com `isLoading=true`.\
     - Normaliza valores de sliders (0..1) se necessário ou envia diretamente.
     - Monta query string usando `encodeURIComponent(param.name)=value`.\
     - Envia o arquivo para o backend.
     - Ao receber a resposta (blob), inicia o download do arquivo resultante.
     - Exibe alertas de sucesso ou erro.

## Dicas de Backend

- Para suportar o cabeçalho `Authorization` e requisições cross-origin, configure o CORS no backend (por exemplo, usando gin-contrib/cors no Gin).
- Para rotas protegidas, implemente um middleware que valide o token JWT, parse os claims e armazene no contexto.

## Aprendendo Mais

Para saber mais sobre React, visite a [documentação oficial do React](https://reactjs.org/). Se quiser detalhes sobre como o Create React App funciona e como personalizar o build, consulte a [documentação do CRA](https://facebook.github.io/create-react-app/docs/getting-started).

## Licença

Este projeto segue o [MIT License](./LICENSE), podendo ser utilizado livremente.

