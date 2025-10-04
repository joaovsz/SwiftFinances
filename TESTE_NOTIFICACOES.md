# 🧪 Como Testar o Sistema de Notificações Bancárias

## 🚨 Resolução do Erro de Importação

Se você está vendo o erro `"Não é possível localizar o módulo './BankMessageParser'"`, siga estes passos:

### Método 1: Recriar a importação
1. Delete a linha `import { BankMessageParser } from './BankMessageParser';`
2. Salve o arquivo
3. Reescreva a linha de importação
4. Salve novamente

### Método 2: Reiniciar TypeScript
1. No VS Code: `Cmd/Ctrl + Shift + P`
2. Digite "TypeScript: Restart TS Server"
3. Pressione Enter

### Método 3: Limpar cache (se necessário)
```bash
cd /Users/jhonm/Documents/Projetos/SwiftFinances
rm -rf .expo
rm -rf node_modules/.cache
npx expo start --clear
```

## 📱 Métodos de Teste

### 1. 🧪 Tela de Teste no App

**Localização**: Configurações > Testar Notificações

**Funcionalidades**:
- ✅ Testes pré-definidos para todos os bancos
- ✅ Teste personalizado com suas próprias mensagens  
- ✅ Simulação completa (parser + criação de transação)
- ✅ Interface visual com resultados

**Como usar**:
1. Abra o app
2. Vá em Configurações
3. Toque em "Testar Notificações" 🧪
4. Escolha um teste rápido ou digite uma mensagem personalizada

### 2. 📝 Console/Terminal (Desenvolvimento)

**Para desenvolvedores**:

```typescript
// Importar no código
import { NotificationTester } from '../services/NotificationTester';

// Executar testes
NotificationTester.testBankMessages(); // Testa todos os bancos

// Teste personalizado
NotificationTester.testCustomMessage(
  'Cartão de débito',
  'Compra aprovada de R$ 25,50 no SUPERMERCADO XYZ',
  'com.nubank.app'
);

// Simulação completa
NotificationTester.simulateNotification(
  'Cartão de débito', 
  'R$ 50,00 - POSTO SHELL',
  'com.nubank.app'
);
```

### 3. 🔍 Teste Manual no Console

```javascript
// No console do React Native Debugger ou Metro
import { BankMessageParser } from './src/services/BankMessageParser';

// Testar uma mensagem
const result = BarkMessageParser.parseMessage(
  'Cartão de débito',
  'Compra aprovada de R$ 25,50 no SUPERMERCADO XYZ',
  'com.nubank.app'
);

console.log(result);
```

### 4. 📲 Teste com Notificações Reais (Android)

**ATENÇÃO**: Funciona apenas no dispositivo físico Android com APK instalado.

**Configuração necessária**:
1. ✅ App instalado via APK
2. ✅ Notificações permitidas
3. ✅ **Acesso às notificações ativado** (crítico!)
4. ✅ App não otimizado para bateria
5. ✅ Serviço ativado no app

**Teste real**:
1. Ative o serviço: Configurações > Notificações Bancárias > Iniciar Monitoramento
2. Faça uma compra real com cartão
3. Aguarde a notificação do banco
4. Verifique se a transação foi criada automaticamente

## 📋 Exemplos de Mensagens para Teste

### Nubank
```
Título: "Cartão de débito"
Corpo: "Compra aprovada de R$ 25,50 no SUPERMERCADO XYZ em 03/10/2024 às 14:30"
App: com.nubank.app
```

### Itaú  
```
Título: "Itaú Débito"
Corpo: "Débito de R$ 45,30 - UBER TRIP 12345"
App: com.itau.app
```

### PicPay
```
Título: "Pagamento realizado"
Corpo: "Você pagou R$ 89,90 para FARMACIA POPULAR"
App: com.picpay.app
```

### Bradesco
```
Título: "Compra Débito"
Corpo: "Compra realizada: R$ 234,67 - MAGAZINE LUIZA"
App: com.banco.bradesco
```

### Santander
```
Título: "Débito Conta Corrente"
Corpo: "Débito de R$ 156,78 em MERCADOPAGO*MCDONALDS"
App: com.santander.app
```

## 🎯 O Que Verificar nos Testes

### ✅ Parser Funcionando
- [x] Extrai valor corretamente (R$ formato brasileiro)
- [x] Identifica tipo de transação
- [x] Extrai nome do estabelecimento
- [x] Categoriza automaticamente
- [x] Funciona com diferentes formatos de mensagem

### ✅ Criação de Transação
- [x] Cria transação do tipo "Saída" (tipo 2)
- [x] Valor correto
- [x] Data/hora atual
- [x] Marcada como automática
- [x] Categoria inferida

### ✅ Interface
- [x] Indicador visual 🔔 na transação
- [x] Marcação "(Auto)" no nome
- [x] Pode ser editada/excluída normalmente

## 🚨 Troubleshooting

### Teste não funciona?
1. **Verificar importações**: Erro de módulo não encontrado?
2. **Reiniciar TypeScript**: Cache pode estar corrompido
3. **Verificar formato**: Mensagem segue o padrão dos bancos?
4. **Console logs**: Verificar erros no Metro/console

### Parser não reconhece mensagem?
1. **Verificar app ID**: Está na lista de bancos suportados?
2. **Formato da mensagem**: Tem "R$" e valor?
3. **Regex patterns**: Título/corpo batem com os padrões?
4. **Testar manualmente**: Use a função `testRegex()`

### Transação não é criada?
1. **Serviço ativo**: NotificationService está rodando?
2. **Auto-create ativo**: Configuração permite criação automática?
3. **Contexto integrado**: FinancesProvider está recebendo?
4. **Permissões**: Notificações estão permitidas?

## 📊 Resultados Esperados

### Teste Bem-Sucedido
```
✅ SUCESSO:
   Valor: R$ 25.50
   Descrição: SUPERMERCADO XYZ
   Categoria: Alimentação
   Estabelecimento: SUPERMERCADO XYZ
   Tipo: debit
   ✅ Valores corretos!
```

### Transação Criada
```
📝 Transação que seria criada:
   ID: 1696348800000
   Label: SUPERMERCADO XYZ
   Valor: 25.5
   Tipo: 2 (Saída)
   Data: 2024-10-03T17:00:00.000Z
   Categoria: Alimentação
   Automática: true
```

## 🎛️ Configurações de Teste

### Desenvolvimento
- Use a tela de teste no app para interface visual
- Console para logs detalhados
- Tester class para testes automatizados

### Produção  
- APK em dispositivo físico
- Notificações reais dos bancos
- Monitoramento em tempo real

## 📞 Próximos Passos

1. **Resolver erro de importação** (se existir)
2. **Testar parser** com mensagens de exemplo
3. **Instalar APK** quando pronto
4. **Configurar permissões** no Android
5. **Testar com notificações reais**
6. **Ajustar padrões** se necessário

---

💡 **Dica**: Comece sempre com os testes rápidos na interface do app antes de testar com notificações reais!