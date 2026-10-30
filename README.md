# SaúdeIngá

Protótipo acadêmico de uma plataforma para organizar solicitações e filas de atendimento na saúde pública.

## Proposta
O sistema demonstra como tecnologia pode melhorar a organização de demandas, a visualização de prioridades e o acompanhamento pelo cidadão.

## Recursos
- Interface responsiva para computador e celular
- Identidade visual própria em formato de painel/central de atendimento
- Cadastro de solicitações
- Geração automática de protocolo
- Consulta de protocolo
- Fila com pesquisa e filtros
- Indicadores de consultas, exames e prioridades
- Estimativa demonstrativa de tempo
- Modo claro/escuro
- Armazenamento local com localStorage
- Painel demonstrativo para gestão

## Tecnologias
HTML5, CSS3, JavaScript, LocalStorage, Git, GitHub e Render.

## Como executar
Abra `index.html` no navegador ou use o Live Server no VS Code.

## Estrutura
```text
saudeinga/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## Observação
Este projeto é exclusivamente educacional. Não utilize dados reais de pacientes. Uma aplicação real precisaria de backend seguro, autenticação, controle de acesso, criptografia, logs/auditoria, conformidade com a LGPD e integrações oficiais.

Os dados desta versão ficam somente no navegador utilizado. Portanto, uma solicitação criada em um computador não aparece automaticamente em outro dispositivo.

## Evolução futura
A versão seguinte poderia utilizar uma API com backend e PostgreSQL para centralizar os dados e permitir autenticação de cidadãos e gestores.
