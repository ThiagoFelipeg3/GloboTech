## Considerações

1. O projeto poderia ser feito somente com javascript puro, ficaria mais simples até, acredito que o typescript entrega um
   modelo de tipagens muito bom, mantendo a aplicação um pouco mais segura.
2. O projeto possui testes utilizando o [Jest](https://jestjs.io/pt-BR/docs/getting-started) porém apesar de gosta do modelo
   TDD eu não utilizei aqui, e a corbetura de teste esta muito baixa, geralmente gosto de deixar mais proximo de 80% de cobertura.
3. Meus conhecimentos sobre futebol é baixa, felizmente meus familiares gostam bastante e convesei um pouco com eles sobre.
4. Utilizei docker somente no projeto **schedule_api** então para o projeto funcionar tesmo de utilizar o IP public da maquina
   Deixei explicado do arquivo README do projeto, algumas configurações.
5. Para ver de fato a quantidade de requisições deixei no código um incremento do redis para saber a quantidade de I/O que o mesmo recebeu
   é somente para isso então em produção eu removeria este código, vou deixar explicado logo mais.

## Schedule_api

Dito isso, aqui vai algumas explicações sobre os passos que fiz, escolhas e testes, caso tenha alguma duvida por favor entre em contato.

### Estrutura

A arquitetura que utilizei pensando em um BFF pode ser que eu tenha exagerado um pouco, causando um **overengineering**, mas tentei colocar no projeto
algumas possíbilidades que gosto de fazer em projetos mais robustos.

Se analizar o código vai perceber que tentei abstair ao máximo algumas responsabilidades, utilizando interfaces por exemplo.
Entre o express e a base de código utilizei um padrão chamado **adapter**, afim de reduzir os riscos de quebra em uma possível alteraçõa de framework.
Obviamente é raro realizar uma alteração deste tipo, porém se precisar realizar a troca do express por outro, fica mais simples, é só o novo serviço implementar este adapter.

### Mudanças futuras

Hoje oque é feito é salvar em cache a pesquisa a partir da data, porém com um pouco mais de tempo realizaria mais mudança
Em um cenário em que os jogos estiverem ocorrendo dentro do ano atual(2022/2023), além de salvar por mais tempo os jogos que já ocorreram
e os jogos que estão para ocorrere, quanto mais proximo o jogo estiver de acontecer menor seria estes tempo de cache.

> Exemplo

1. Jogo 1 data 05/11/2022: jogos que já ocorreram salvaria por mais tempo, cerca de duas semanas
2. Jogo 2: data 06/11/2022 hoje e agora: jogos no mesmo dia salvaria de 1 em 1h, caso esteja acontecendo no momento em reduziria este tempo.
3. Jogo 3: data 07/11/2022: a mesma regra do jogo 1

Mais exemplos sobre o Jogo 2, que ocorre no momento da pesquisa, realizaria um tratativa, validando em background(cron, job etc.) se o jogo sofreu alguma alteração,
esta validação pode ser feito com mais frequéncia(5 em 5min exemplo) para atualizar o cache do BFF.

Uma outra melhoria que faria é com as conexões do redis, hoje este projeto esta utilizando o [Cluster](https://nodejs.org/api/cluster.html) do node, sendo bem simplista é como um loadbalance de processos
isso ajuda muito em altas cargas de requisições, PW2, kubernetes pode fazer isso também.
Utilizando esta funcionalidade acaba aumentando a quantidade de conexões com o redis, isso sem falar em escalabilidade, seria interessante resolver utilizando arquitetura mestre-escravo
na qual somente o mestre tenha conexão com o redis, esta é uma das soluções.

Para melhorias, e que reduziria o volume de requisições é de além de retornar os jogos da data atual, retornar os jogos das datas proximas, por exemplo um dia antes e um dia depois.
Vai ser mais rápido para navegar entre os dias para caso o cliente digitar o dia errado.
Mas isso cabe uma analizer comportamental do cliente, talvez um mapa de calor ajudaria tomar esta decisão.

### Teste de carga

Para o teste de carga utilizar um pacote chamado [AutoCannon](https://www.npmjs.com/package/autocannon) ele fica integrado com o projeto e pode ser executado via npm
Confeso que nunca utilizei, porém ele demontrou ser bem competente.
Para teste de carga gosto muito de utilizar o [AB Apache](https://httpd.apache.org/docs/2.4/programs/ab.html), porém gastaria mais tempo para configurar deixando integrado ao projeto.

Realizei testes com o [Cluster](https://nodejs.org/api/cluster.html) e sem ele, mostro como desativar no arquivo README.
O projeto Schedule conseguiu receber um grande volume de carga, vendo a imagem, conseguimos ver a quantidade de requisições o volume de dados retornados e a quantidade de I/O do redis.

Neste exemplo simulamos 1000 clientes acessando durante 30 segundos, com o node trabalhando com 10 workers

![schedule carga](schedule_carga.png?raw=true)

Se observar no primeiro terminal do lado esquerdo inferior, informa a quantidade de requests realizadas, neste caso 265k em 30 segundos, sendo 263822 deram sucesso, já no terminal inferior direito, informa que 265750 requisitaram o cache/redis
com este volume somente 10 requisitaram a api esportes-api, isso acontece por causa dos 10 works trabalhando simultaneamente.
Caso eu queira rodar um novo teste, não vai ser preciso requisitar o serviço esportes-api novamente caso realize com as mesmas datas.
