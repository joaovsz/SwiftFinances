import { BankMessageParser } from './BankMessageParser';

// Função para testar o parser com mensagens reais
export function testRealBankMessages() {
    console.log('🧪 TESTANDO MENSAGENS REAIS DOS BANCOS\n');

    const realTestCases = [
        {
            bank: 'Nubank',
            appId: 'com.nubank.app',
            title: 'Compra no crédito aprovada',
            body: 'Compra de R$ 90,00 aprovada em Bacanas para o cartao com final 5771',
        },
        {
            bank: 'Nubank',
            appId: 'com.nubank.app',
            title: 'Compra no débito aprovada',
            body: 'Compra de R$ 25,50 aprovada em SUPERMERCADO XYZ para o cartao com final 1234',
        },
        {
            bank: 'Itaú',
            appId: 'com.itau.app',
            title: 'Itaú Débito',
            body: 'Débito de R$ 45,30 - POSTO SHELL CENTRO',
        },
        {
            bank: 'PicPay',
            appId: 'com.picpay.app',
            title: 'Pagamento realizado',
            body: 'Você pagou R$ 89,90 para FARMACIA POPULAR',
        },
        {
            bank: 'Bradesco',
            appId: 'com.banco.bradesco',
            title: 'Compra Débito',
            body: 'Compra realizada: R$ 234,67 - MAGAZINE LUIZA',
        },
        {
            bank: 'Santander',
            appId: 'com.santander.app',
            title: 'Débito Conta Corrente',
            body: 'Débito de R$ 156,78 em MERCADOPAGO*MCDONALDS',
        },
    ];

    let successCount = 0;
    let totalCount = realTestCases.length;

    realTestCases.forEach((testCase, index) => {
        console.log(`📱 Teste ${index + 1}: ${testCase.bank}`);
        console.log(`Título: "${testCase.title}"`);
        console.log(`Corpo: "${testCase.body}"`);
        console.log(`App: ${testCase.appId}`);

        const result = BankMessageParser.parseMessage(
            testCase.title,
            testCase.body,
            testCase.appId
        );

        if (result) {
            console.log(`✅ SUCESSO:`);
            console.log(`   💰 Valor: R$ ${result.amount.toFixed(2)}`);
            console.log(`   📝 Descrição: ${result.description}`);
            console.log(`   🏷️ Categoria: ${result.category}`);
            console.log(`   🏪 Estabelecimento: ${result.merchant || 'N/A'}`);
            console.log(`   📊 Tipo: ${result.type}`);
            successCount++;
        } else {
            console.log(`❌ FALHOU - Não foi possível extrair dados`);
        }

        console.log('─'.repeat(50));
    });

    console.log(`\n📊 RESULTADO FINAL:`);
    console.log(`✅ Sucessos: ${successCount}/${totalCount}`);
    console.log(`❌ Falhas: ${totalCount - successCount}/${totalCount}`);
    console.log(`📈 Taxa de sucesso: ${((successCount / totalCount) * 100).toFixed(1)}%`);

    return { successCount, totalCount };
}