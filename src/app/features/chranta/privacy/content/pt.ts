import { PrivacyPolicy } from '../privacy-policy';

export const PT: PrivacyPolicy = {
  languageName: 'Português',
  title: 'Política de privacidade do Chranta',
  updated: 'Última atualização: 12 de outubro de 2026',
  intro:
    'O Chranta é um app de finanças pessoais para iPhone, iPad e Android. Ele foi criado para que suas informações financeiras nunca saiam do seu dispositivo. Esta política explica quais informações o app usa, onde elas ficam e o que não fazemos com elas.',
  sections: [
    {
      heading: 'Resumo',
      paragraphs: [
        'Não coletamos, recebemos, armazenamos, vendemos nem compartilhamos seus dados pessoais. Tudo o que você registra no Chranta fica no seu dispositivo, criptografado.',
      ],
      bullets: [
        'Não é preciso criar conta nem se cadastrar.',
        'Sem servidores: não temos nenhum backend que receba seus dados.',
        'Sem publicidade, análises, relatórios de falhas ou ferramentas de rastreamento.',
        'O assistente de IA funciona totalmente no seu dispositivo e não envia seus dados a nenhum serviço de IA de terceiros.',
      ],
    },
    {
      heading: 'Quem somos',
      paragraphs: [
        'O Chranta é desenvolvido por Christian Cruz Arango, desenvolvedor independente (cacruz.com). Nesta política, «nós» se refere ao desenvolvedor.',
      ],
    },
    {
      heading: 'Informações que você registra no app',
      paragraphs: [
        'Para funcionar, o Chranta guarda as informações que você decide registrar. Elas ficam apenas no seu dispositivo, em um banco de dados criptografado com SQLCipher (AES-256). A chave de criptografia fica nas Chaves do iOS (Keychain) ou no Keystore do Android. Nós não podemos ver nem acessar essas informações.',
      ],
      bullets: [
        'País, idioma, moeda e saldo inicial.',
        'Receitas, despesas, categorias e orçamentos.',
        'Dívidas, parcelas e contas fixas (por exemplo aluguel, luz ou internet).',
        'Metas de economia e dinheiro reservado.',
        'Suas preferências, como o horário dos lembretes e se os valores são exibidos.',
      ],
    },
    {
      heading: 'Assistente de IA (no dispositivo)',
      paragraphs: [
        'O assistente usa um modelo de linguagem de código aberto, Qwen3-0.6B (licença Apache-2.0), que vem incluído no app e é executado localmente no seu dispositivo com o LiteRT, do Google. O modelo nunca é baixado nem consultado em um servidor remoto.',
        'O que você escreve para o assistente, e os registros financeiros que ele lê para responder, são processados apenas no seu dispositivo. Nada é enviado à OpenAI, ao Google, à Anthropic ou a qualquer outro serviço de IA de terceiros, nem a nós. As conversas não são guardadas, e o assistente nunca salva um registro antes que você o revise e confirme. O assistente funciona sem conexão com a internet.',
      ],
    },
    {
      heading: 'Face ID, Touch ID e código do dispositivo',
      paragraphs: [
        'Você pode bloquear o Chranta com Face ID, Touch ID, impressão digital ou o código do seu dispositivo. A autenticação é feita pelo sistema operacional: o app só sabe se ela deu certo e nunca tem acesso aos seus dados biométricos.',
      ],
    },
    {
      heading: 'Lembretes de pagamento',
      paragraphs: [
        'Os lembretes são opcionais e vêm desativados. Quando você os ativa, eles são agendados localmente pelo sistema de notificações do seu dispositivo; nenhum serviço push ou servidor é usado. Você decide se os nomes e valores aparecem na tela de bloqueio.',
      ],
    },
    {
      heading: 'Backups',
      paragraphs: [
        'Você pode exportar um backup criptografado com uma frase-senha escolhida por você e importá-lo depois. Você decide onde salvar ou compartilhar o arquivo (por exemplo Arquivos, iCloud Drive ou e-mail) pelo menu de compartilhamento do dispositivo; esse destino trata o arquivo conforme a própria política. Sem a sua frase-senha, ninguém, nem nós, consegue abri-lo.',
        'Os backups do próprio dispositivo (como iCloud ou o backup do Google) podem incluir os dados do app, conforme suas configurações; esses dados continuam criptografados.',
      ],
    },
    {
      heading: 'Conexão com a internet e terceiros',
      paragraphs: [
        'O Chranta não precisa de conexão com a internet e não transmite seus dados. Ele não inclui SDKs de terceiros de análises, publicidade, atribuição ou relatórios de falhas, e não rastreia você entre apps ou sites.',
        'A única ação que usa a internet é um link opcional para cacruz.com, que abre no seu navegador. A Apple e o Google podem coletar informações quando você baixa o app, conforme as próprias políticas de privacidade.',
      ],
    },
    {
      heading: 'Permissões',
      paragraphs: [
        'O Chranta pede apenas as permissões de que precisa, e só quando você usa a função relacionada:',
      ],
      bullets: [
        'Face ID / biometria: para desbloquear o app.',
        'Notificações: apenas se você ativar os lembretes de pagamento.',
        'Acesso a arquivos: apenas quando você escolhe um backup para importar.',
      ],
    },
    {
      heading: 'Retenção e exclusão de dados',
      paragraphs: [
        'Suas informações ficam no seu dispositivo até que você as apague. Você pode excluir qualquer registro dentro do app, e ao desinstalar o Chranta os dados são removidos do seu dispositivo. Como não guardamos nenhum dado seu, não há nada a excluir do nosso lado.',
      ],
    },
    {
      heading: 'Crianças',
      paragraphs: [
        'O Chranta não é direcionado a menores de 13 anos. Não coletamos informações de ninguém, incluindo crianças.',
      ],
    },
    {
      heading: 'Seus direitos',
      paragraphs: [
        'Como seus dados ficam apenas no seu dispositivo, você tem controle total a qualquer momento: pode vê-los, corrigi-los, exportá-los (com um backup) e apagá-los diretamente no app. Isso vale onde quer que você more, inclusive sob a LGPD, o RGPD e a CCPA.',
      ],
    },
    {
      heading: 'Alterações nesta política',
      paragraphs: [
        'Se a forma como o Chranta trata as informações mudar, atualizaremos esta página e sua data antes que a mudança chegue ao app. Se um dia o app precisar enviar dados para fora do seu dispositivo, ele vai explicar o que é enviado e para quem, e pedir sua permissão antes.',
      ],
    },
    {
      heading: 'Contato',
      paragraphs: [
        'Para dúvidas sobre esta política ou sobre o Chranta, use o formulário de contato em cacruz.com/for-companies.',
      ],
    },
  ],
};
