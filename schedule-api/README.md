### Configs

|Nome                    |Padrão                                    |Descrição                                          |
|:----------------------:|:----------------------------------------:|:-------------------------------------------------:|
|KEYS                    | any_hash                                 | Hash utilizada para autenticação do cliente passada como x-secret no headers da requisição|
|AUTH_ENABLED            | true                                     | Serve para ligar e desligar a autenticação        |
|CLUSTER_WORK_ENABLED    | false                                    | Serve para ligar e desligar a autenticação        |
|ESPORTES_API_URL        | http://IPv4 PUBLICO:8080                   | url para a API esportes                                                  |
|REDIS_HOST              | 172.16.238.2                             | Host do redis                                                  |
|REDIS_PORT              | 6379                                     | Porta do redis                                                  |


### Rodar projeto
Crie um arquivo .env a partir do .env.exemple, na variável ESPORTES_API_URL adicione o seu IP publico.
No linux podemos utilizar no terminal o comando ```ifconfig``` para achar o IP publico/IPv4 Address ou dentro das configurações de rede/wifi.

> Isso é necessário caso utilize o docker para executar o projeto, pois o mesmo não consegue acessar o localhost da maquina, de dentro de um container, para fazer isso exisge um pouco mais de configurações :)

Podemos deixar as outras variáveis da forma como esta...

### Pré requisitos

- Docker
ou
- Node 16.17.1


Para executar utilizando o docker, execute o seguinte comando.

```docker-compose up -d```

Aguarde um momento para baixar as imagens e executar.

Para executar com npm, pare o container da api

```docker stop schedule_api```

e execute com o npm

```npm run dev```



### Testes

Para executar os teste unitários

```npm run test:unit```

para testes de carga

```npm run test:ab```


### Api

Se tudo deu certo em sua maquina o projeto subiu na porta 8000 se você utilizou o docker, podemos requisitar a aplicação com o IP 172.16.238.3:8000
caso executou com npm, é só utilizar o localhost no lugar do IP.

Segue o cURL para request

```
curl --location --request GET 'http://172.16.238.3:8000/api/schedule/2019-01-01' \
--header 'x-secret: any_hash'
```


```json
{
    "Campeonato Inglês": {
        "Fase única": {
            "fase_id": 5756,
            "ordem": 1,
            "data_inicio": "2018-08-10",
            "data_fim": "2019-05-12",
            "nome": "Fase única",
            "edicao_id": 2701,
            "nome_edicao": "Campeonato Inglês 2018/19",
            "jogos": [
                {
                    "vencedor_jogo": {
                        "equipe_id": 2936,
                        "label": "visitante"
                    },
                    "rodada": 21,
                    "placar": {
                        "2668": 0,
                        "2936": 1
                    },
                    "suspenso": false,
                    "data_hora_realizacao": "2019-01-01 10:30:00",
                    "nome_sede": "Goodison Park",
                    "equipes": {
                        "2668": {
                            "nome": "Everton Football Club",
                            "apelido": "Everton",
                            "escudos": {
                                "60x60": "https://s.glbimg.com/es/sde/f/organizacoes/2017/10/22/Everton-65.png",
                                "30x30": "https://s.glbimg.com/es/sde/f/organizacoes/2017/10/22/Everton-30.png",
                                "svg": null,
                                "45x45": "https://s.glbimg.com/es/sde/f/organizacoes/2017/10/22/Everton-45.png"
                            }
                        },
                        "2936": {
                            "nome": "Leicester City Football Club",
                            "apelido": "Leicester",
                            "escudos": {
                                "60x60": "https://s.glbimg.com/es/sde/f/equipes/2014/07/22/lei65.png",
                                "30x30": "https://s.glbimg.com/es/sde/f/equipes/2014/07/22/lei30.png",
                                "svg": null,
                                "45x45": "https://s.glbimg.com/es/sde/f/equipes/2014/07/22/lei45.png"
                            }
                        }
                    }
                }
            ]
        }
    }
}
```