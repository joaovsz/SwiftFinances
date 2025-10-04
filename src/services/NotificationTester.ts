import { BankMessageParser } from './BankMessageParser';
import { NotificationService } from './NotificationService';
import { testRealBankMessages } from './BankParserTester';

export class NotificationTester {

    /**
     * Testa o parser com mensagens reais de bancos
     */
    static testBankMessages() {
        const testCases = [
            // Nubank - Formato real
            {
                bank: 'Nubank',
                appId: 'com.nubank.app',
                title: 'Compra no crédito aprovada',
                body: 'Compra de R$ 90,00 aprovada em Bacanas para o cartao com final 5771',
                expected: { amount: 90.00, type: 'credit', merchant: 'Bacanas' }
            },
            {
                bank: 'Nubank',
                appId: 'com.nubank.app',
                title: 'Compra no débito aprovada',
                body: 'Compra de R$ 25,50 aprovada em SUPERMERCADO XYZ para o cartao com final 1234',
                expected: { amount: 25.50, type: 'debit', merchant: 'SUPERMERCADO XYZ' }
            },            // Itaú
            {
                bank: 'Itaú',
                appId: 'com.itau.app',
                title: 'Itaú Débito',
                body: 'Débito de R$ 45,30 - POSTO SHELL CENTRO',
                expected: { amount: 45.30, type: 'debit', merchant: 'POSTO SHELL' }
            },

            // PicPay
            {
                bank: 'PicPay',
                appId: 'com.picpay.app',
                title: 'Pagamento realizado',
                body: 'Você pagou R$ 89,90 para FARMACIA POPULAR',
                expected: { amount: 89.90, type: 'purchase', merchant: 'FARMACIA POPULAR' }
            },

            // Bradesco
            {
                bank: 'Bradesco',
                appId: 'com.banco.bradesco',
                title: 'Compra Débito',
                body: 'Compra realizada: R$ 234,67 - MAGAZINE LUIZA',
                expected: { amount: 234.67, type: 'purchase', merchant: 'MAGAZINE LUIZA' }
            },

            // Santander
            {
                bank: 'Santander',
                appId: 'com.santander.app',
                title: 'Débito Conta Corrente',
                body: 'Débito de R$ 156,78 em MERCADOPAGO*MCDONALDS',
                expected: { amount: 156.78, type: 'debit', merchant: 'MCDONALDS' }
            },
        ];

        console.log('🧪 INICIANDO TESTES DO PARSER BANCÁRIO\n');

        testCases.forEach((testCase, index) => {
            console.log(`📱 Teste ${index + 1}: ${testCase.bank}`);
            console.log(`Título: "${testCase.title}"`);
            console.log(`Corpo: "${testCase.body}"`);

            const result = BankMessageParser.parseMessage(
                testCase.title,
                testCase.body,
                testCase.appId
            );

            if (result) {
                console.log(`✅ SUCESSO:`);
                console.log(`   Valor: R$ ${(result.amount || 0).toFixed(2)}`);
                console.log(`   Descrição: ${result.description}`);
                console.log(`   Categoria: ${result.category || 'N/A'}`);
                console.log(`   Estabelecimento: ${result.merchant || 'N/A'}`);
                console.log(`   Tipo: ${result.type}`);

                // Verificar se está próximo do esperado
                const amountMatch = Math.abs(result.amount - testCase.expected.amount) < 0.01;
                const typeMatch = result.type === testCase.expected.type;

                if (amountMatch && typeMatch) {
                    console.log(`   ✅ Valores corretos!`);
                } else {
                    console.log(`   ⚠️ Esperado: R$ ${testCase.expected.amount}, Tipo: ${testCase.expected.type}`);
                }
            } else {
                console.log(`❌ FALHOU - Não foi possível extrair dados`);
            }

            console.log('─'.repeat(50));
        });

        // Usar função de teste atualizada
        const result = testRealBankMessages();
        return result.totalCount;
    }    /**
     * Testa casos específicos inseridos pelo usuário
     */
    static async testCustomMessage(title: string, body: string, appId: string = 'com.nubank.app') {
        console.log(`🧪 TESTE PERSONALIZADO`);
        console.log(`App: ${appId}`);
        console.log(`Título: "${title}"`);
        console.log(`Corpo: "${body}"`);

        const result = BankMessageParser.parseMessage(title, body, appId);

        if (result) {
            console.log(`✅ RESULTADO:`);
            console.log(`   Valor: R$ ${(result.amount || 0).toFixed(2)}`);
            console.log(`   Descrição: ${result.description}`);
            console.log(`   Categoria: ${result.category || 'Não categorizado'}`);
            console.log(`   Estabelecimento: ${result.merchant || 'Não identificado'}`);
            console.log(`   Tipo: ${result.type}`);
            return result;
        } else {
            console.log(`❌ Mensagem não reconhecida como transação bancária`);
            return null;
        }
    }

    /**
     * Simula uma notificação completa (para testar o serviço)
     */
    static async simulateNotification(title: string, body: string, appId: string = 'com.nubank.app') {
        console.log(`📲 SIMULANDO NOTIFICAÇÃO COMPLETA`);

        try {
            // Usar a nova função de simulação que realmente cria a transação
            const result = await NotificationService.simulateAutomaticTransaction(title, body, appId);

            if (result) {
                console.log(`✅ SIMULAÇÃO COMPLETA COM SUCESSO:`);
                console.log(`   💰 Valor: R$ ${(result.value || 0).toFixed(2)}`);
                console.log(`   📝 Descrição: ${result.label}`);
                console.log(`   🏷️ Categoria: ${result.category}`);
                console.log(`   📊 Tipo: ${result.type} (Saída)`);
                console.log(`   🤖 Automática: ${result.isAutomatic}`);
                console.log(`   📅 Data: ${result.date}`);
                console.log(`   🆔 ID: ${result.id}`);

                return result;
            } else {
                console.log(`❌ Simulação falhou - não foi possível criar transação`);
                return null;
            }
        } catch (error) {
            console.error('❌ Erro na simulação:', error);
            return null;
        }
    }    /**
     * Lista bancos suportados
     */
    static listSupportedBanks() {
        console.log(`🏦 BANCOS SUPORTADOS:`);
        console.log(`
    1. Nubank (com.nubank.app)
    2. Itaú (com.itau.app)
    3. Bradesco (com.banco.bradesco)
    4. Santander (com.santander.app)
    5. PicPay (com.picpay.app)
    6. C6 Bank (com.c6bank.app)
    7. Inter (com.inter.app)
    8. BTG Pactual (com.btg.pactual.app)
    `);
    }

    /**
     * Testa expressões regulares específicas
     */
    static testRegexPatterns(text: string) {
        const patterns = [
            { name: 'Valor R$', regex: /R\$\s?(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/g },
            { name: 'Valor decimal', regex: /(\d{1,3}(?:\.\d{3})*(?:,\d{2})?).*reais?/gi },
            { name: 'Cartão débito', regex: /cartão.*débito/i },
            { name: 'Cartão crédito', regex: /cartão.*crédito/i },
            { name: 'Compra aprovada', regex: /compra.*aprovada/i },
            { name: 'Pagamento realizado', regex: /pagamento.*realizado/i },
            { name: 'Débito conta', regex: /débito.*conta/i },
        ];

        console.log(`🔍 TESTANDO PADRÕES REGEX: "${text}"`);

        patterns.forEach(pattern => {
            const matches = text.match(pattern.regex);
            if (matches) {
                console.log(`✅ ${pattern.name}: ${matches.join(', ')}`);
            } else {
                console.log(`❌ ${pattern.name}: Não encontrado`);
            }
        });
    }
}

// Funções de conveniência para uso no console
export const runBankTests = () => NotificationTester.testBankMessages();
export const testMessage = (title: string, body: string, appId?: string) =>
    NotificationTester.testCustomMessage(title, body, appId);
export const simulateNotif = (title: string, body: string, appId?: string) =>
    NotificationTester.simulateNotification(title, body, appId);
export const listBanks = () => NotificationTester.listSupportedBanks();
export const testRegex = (text: string) => NotificationTester.testRegexPatterns(text);