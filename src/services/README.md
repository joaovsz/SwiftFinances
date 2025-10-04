# 📱 Serviço de Notificações Bancárias - SwiftFinances

## 📋 Visão Geral

O SwiftFinances agora inclui um sistema inteligente que monitora notificações de bancos e cria automaticamente transações de saída quando detecta compras ou pagamentos.

## 🏦 Bancos Suportados

- **Nubank** - `com.nubank.app`
- **Itaú** - `com.itau.app`
- **Bradesco** - `com.banco.bradesco`
- **Santander** - `com.santander.app`
- **PicPay** - `com.picpay.app`
- **C6 Bank** - `com.c6bank.app`
- **Inter** - `com.inter.app`
- **BTG Pactual** - `com.btg.pactual.app`

## ⚙️ Como Configurar

### 1. Permissões Necessárias

Para o serviço funcionar corretamente, você precisa:

#### Android:
1. **Permitir Notificações**:
   - Configurações > Aplicativos > SwiftFinances
   - Notificações > Ativar

2. **Acesso às Notificações** (Crítico):
   - Configurações > Aplicativos e notificações > Acesso especial
   - Acesso às notificações > SwiftFinances > Ativar

3. **Otimização de Bateria**:
   - Configurações > Bateria > Otimização de bateria
   - Encontrar SwiftFinances > Não otimizar

### 2. Ativação no App

1. Abra o SwiftFinances
2. Vá em **Configurações** (aba inferior)
3. Toque em **Notificações Bancárias**
4. Ative as configurações desejadas
5. Toque em **Iniciar Monitoramento**

## 🤖 Como Funciona

### Detecção Automática
O sistema monitora notificações em tempo real e identifica:

- Mensagens de compras com cartão
- Débitos automáticos
- Transferências PIX
- Pagamentos em estabelecimentos

### Extração de Dados
Para cada notificação bancária detectada, o sistema extrai:

- **Valor**: R$ 25,50, R$ 120,00, etc.
- **Descrição**: Nome do estabelecimento ou tipo de transação
- **Categoria**: Alimentação, Transporte, Compras, etc.
- **Tipo**: Débito, Crédito, PIX, Compra

### Criação Automática
As transações são criadas automaticamente com:
- Tipo: **Saída** (tipo 2)
- Valor extraído da notificação
- Data/hora atual
- Marcação como transação automática
- Categoria inferida baseada no contexto

## 📱 Exemplos de Notificações Reconhecidas

### Nubank
```
Título: Cartão de débito
Corpo: Compra aprovada de R$ 25,50 no SUPERMERCADO XYZ
```
**Resultado**: Transação de R$ 25,50 - Categoria: Alimentação

### Itaú
```
Título: Itaú Débito
Corpo: Débito de R$ 45,30 - UBER TRIP
```
**Resultado**: Transação de R$ 45,30 - Categoria: Transporte

### PicPay
```
Título: Pagamento realizado
Corpo: Você pagou R$ 120,00 para POSTO SHELL
```
**Resultado**: Transação de R$ 120,00 - Categoria: Transporte

## ⚡ Funcionalidades

### Configurações Disponíveis

- **Criação Automática**: Ativa/desativa a criação automática de transações
- **Som de Confirmação**: Toca som quando uma transação é criada
- **Bancos Monitorados**: Lista dos bancos suportados

### Identificação Visual

- Transações automáticas aparecem com ícone 🔔
- Marcação "(Auto)" no nome da transação
- Mesmo comportamento de edição/exclusão

### Teste e Debug

- **Teste do Parser**: Permite testar mensagens manualmente
- **Logs**: Sistema de logs para debug
- **Ajuda**: Instruções detalhadas sobre permissões

## 🔧 Desenvolvimento

### Estrutura do Código

```
src/services/
├── NotificationService.ts    # Serviço principal
├── BankMessageParser.ts      # Parser de mensagens
└── README.md                # Este arquivo

src/components/
└── NotificationSettingsScreen.tsx  # Interface de configuração
```

### Adicionando Novos Bancos

Para adicionar suporte a um novo banco:

1. Edite `BankMessageParser.ts`
2. Adicione novo padrão em `bankPatterns`:

```typescript
{
  bank: 'NovoBanco',
  appIds: ['com.novobanco.app'],
  patterns: {
    title: [/compra.*cartão/i],
    body: [/R\$.*\d+/],
    amountExtraction: [/R\$\s?(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/g],
  },
}
```

### Testando o Parser

```typescript
import { BankMessageParser } from '../services/BankMessageParser';

// Teste manual
BankMessageParser.testParser();

// Teste específico
const result = BankMessageParser.parseMessage(
  'Cartão débito',
  'Compra de R$ 50,00 no MERCADO XYZ',
  'com.nubank.app'
);
```

## 🚨 Limitações e Considerações

### Limitações Técnicas

- **Android Only**: Funcionalidade específica para Android
- **Permissões Sensíveis**: Requer acesso às notificações do sistema
- **Dependente dos Bancos**: Funciona apenas com bancos suportados
- **Formato de Mensagem**: Depende do formato atual das notificações

### Privacidade

- **Dados Locais**: Todas as configurações ficam no dispositivo
- **Não Armazena**: Não armazena conteúdo de notificações
- **Processo Local**: Todo processamento é feito no dispositivo

### Precisão

- **Parser Inteligente**: Usa regex e padrões para extrair dados
- **Categorização**: Inferência baseada em palavras-chave
- **Falsos Positivos**: Pode ocasionalmente não reconhecer transações
- **Falsos Negativos**: Pode criar transações incorretas (raro)

## 🆘 Solução de Problemas

### Não Está Funcionando

1. **Verificar Permissões**:
   - Notificações ativadas?
   - Acesso às notificações ativado?
   - App não está otimizado para bateria?

2. **Banco Suportado**:
   - O banco está na lista de suportados?
   - App do banco está instalado?
   - App do banco envia notificações?

3. **Configuração do Serviço**:
   - Serviço está ativo?
   - Criação automática está habilitada?
   - Teste com o parser manual

### Transações Incorretas

- Use o teste manual para verificar se a mensagem é reconhecida
- Verifique o formato da notificação do banco
- Reporte casos específicos para melhoria dos padrões

### Performance

- O serviço é otimizado para baixo consumo
- Funciona apenas quando há notificações
- Não impacta significativamente a bateria

## 📄 Changelog

### v1.0.0 (Inicial)
- Implementação do serviço base
- Suporte a 8 bancos principais
- Interface de configuração
- Sistema de categorização automática
- Integração com contexto de finanças

## 🤝 Contribuindo

Para contribuir com melhorias:

1. **Novos Bancos**: Adicione padrões para bancos não suportados
2. **Melhor Parsing**: Aprimore a extração de dados
3. **Categorização**: Melhore a inferência de categorias
4. **UI/UX**: Aprimore a interface de configuração

## 📧 Suporte

Para dúvidas ou problemas:
- Verifique este README
- Use a função "Teste do Parser"
- Use a "Ajuda com Permissões" no app