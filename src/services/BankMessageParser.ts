export interface BankTransactionInfo {
    amount: number;
    description: string;
    category?: string;
    merchant?: string;
    type: 'debit' | 'credit' | 'pix' | 'purchase';
}

export interface BankPattern {
    bank: string;
    appIds: string[];
    patterns: {
        title: RegExp[];
        body: RegExp[];
        amountExtraction: RegExp[];
    };
}

export class BankMessageParser {
    private static bankPatterns: BankPattern[] = [
        {
            bank: 'Nubank',
            appIds: ['com.nubank.app'],
            patterns: {
                title: [
                    /compra.*crédito.*aprovada/i,
                    /compra.*débito.*aprovada/i,
                    /cartão.*débito/i,
                    /cartão.*crédito/i,
                    /compra.*aprovada/i,
                    /transação.*realizada/i,
                ],
                body: [
                    /compra\s+de\s+R\$/i,
                    /R\$.*\d+,\d{2}/,
                    /valor.*R\$.*\d+/i,
                    /débito.*R\$.*\d+/i,
                    /crédito.*R\$.*\d+/i,
                ],
                amountExtraction: [
                    /R\$\s?(\d+,\d{2})/,
                    /R\$\s?(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/,
                    /(\d+,\d{2})(?=\s)/,
                ],
            },
        },
        {
            bank: 'Itaú',
            appIds: ['com.itau.app', 'com.itau'],
            patterns: {
                title: [
                    /itaú.*débito/i,
                    /compra.*cartão/i,
                    /débito.*conta/i,
                    /transação.*aprovada/i,
                ],
                body: [
                    /débito\s+de\s+R\$/i,
                    /R\$.*\d+,\d{2}/,
                    /valor.*\d+/i,
                    /compra.*R\$.*\d+/i,
                ],
                amountExtraction: [
                    /R\$\s?(\d+,\d{2})/,
                    /R\$\s?(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/,
                    /(\d+,\d{2})(?=\s|-)/,
                ],
            },
        },
        {
            bank: 'Bradesco',
            appIds: ['com.banco.bradesco', 'com.bradesco'],
            patterns: {
                title: [
                    /cartão.*utilizado/i,
                    /compra.*realizada/i,
                    /débito.*automático/i,
                ],
                body: [
                    /R\$.*\d+[,.]?\d*/,
                    /valor.*R\$.*\d+/i,
                    /débito.*R\$.*\d+/i,
                ],
                amountExtraction: [
                    /R\$\s?(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/g,
                    /(\d{1,3}(?:\.\d{3})*(?:,\d{2})?).*reais?/gi,
                ],
            },
        },
        {
            bank: 'Santander',
            appIds: ['com.santander.app'],
            patterns: {
                title: [
                    /compra.*aprovada/i,
                    /cartão.*débito/i,
                    /transação.*cartão/i,
                ],
                body: [
                    /R\$.*\d+[,.]?\d*/,
                    /valor.*\d+/i,
                    /compra.*R\$.*\d+/i,
                ],
                amountExtraction: [
                    /R\$\s?(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/g,
                    /(\d{1,3}(?:\.\d{3})*(?:,\d{2})?).*reais?/gi,
                ],
            },
        },
        {
            bank: 'PicPay',
            appIds: ['com.picpay.app'],
            patterns: {
                title: [
                    /pagamento.*realizado/i,
                    /transferência.*enviada/i,
                    /compra.*aprovada/i,
                ],
                body: [
                    /R\$.*\d+[,.]?\d*/,
                    /valor.*R\$.*\d+/i,
                    /você.*pagou.*R\$/i,
                ],
                amountExtraction: [
                    /R\$\s?(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/g,
                    /(\d{1,3}(?:\.\d{3})*(?:,\d{2})?).*reais?/gi,
                ],
            },
        },
    ];

    static parseMessage(title: string, body: string, appId: string): BankTransactionInfo | null {
        // Encontrar o padrão do banco baseado no appId
        const bankPattern = this.findBankPattern(appId);
        if (!bankPattern) {
            console.log(`🏦 Banco não reconhecido para appId: ${appId}`);
            return null;
        }

        // Verificar se a mensagem corresponde aos padrões do banco
        const titleMatch = this.matchesPatterns(title, bankPattern.patterns.title);
        const bodyMatch = this.matchesPatterns(body, bankPattern.patterns.body);

        if (!titleMatch && !bodyMatch) {
            console.log(`📱 Mensagem não corresponde aos padrões do ${bankPattern.bank}`);
            return null;
        }

        // Extrair valor
        const amount = this.extractAmount(title + ' ' + body, bankPattern.patterns.amountExtraction);
        if (!amount) {
            console.log('💰 Não foi possível extrair o valor da mensagem');
            return null;
        }

        // Extrair descrição
        const description = this.extractDescription(title, body, bankPattern.bank);

        // Determinar categoria baseada no conteúdo
        const category = this.determineCategory(title + ' ' + body);

        // Determinar tipo de transação
        const type = this.determineTransactionType(title + ' ' + body);

        return {
            amount,
            description,
            category,
            type,
            merchant: this.extractMerchant(title, body),
        };
    }

    private static findBankPattern(appId: string): BankPattern | null {
        return this.bankPatterns.find(pattern =>
            pattern.appIds.some(id => appId.includes(id) || id.includes(appId))
        ) || null;
    }

    private static matchesPatterns(text: string, patterns: RegExp[]): boolean {
        return patterns.some(pattern => pattern.test(text));
    }

    private static extractAmount(text: string, patterns: RegExp[]): number | null {
        for (const pattern of patterns) {
            const matches = text.match(pattern);
            if (matches && matches[1]) {
                // Converter formato brasileiro para número
                const cleanAmount = matches[1]
                    .replace(/\./g, '') // Remove pontos de milhares
                    .replace(',', '.'); // Troca vírgula por ponto decimal

                const amount = parseFloat(cleanAmount);
                if (!isNaN(amount) && amount > 0) {
                    return amount;
                }
            }
        }
        return null;
    }

    private static extractDescription(title: string, body: string, bankName: string): string {
        const fullText = title + ' ' + body;

        // PRIORIDADE 1: Extrair nome do estabelecimento como descrição
        const merchant = this.extractMerchant(title, body);
        if (merchant && merchant.length >= 3) {
            // Capitalizar primeira letra de cada palavra
            const capitalizedMerchant = merchant.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
            return capitalizedMerchant.substring(0, 40);
        }

        // PRIORIDADE 2: Tentar extrair o texto que vem após o valor monetário
        const afterAmountPatterns = [
            /R\$\s?\d+[.,]?\d*\s+(?:aprovada\s+)?(?:em\s+|no\s+|para\s+)?([^0-9]{3,40})(?:\s+para|\s+cartao|\s+com|\s+final|\s*$)/i,
            /R\$\s?\d+[.,]?\d*\s+([A-Za-z\s]{3,40})\s+(?:para|cartao|com|final)/i,
            /(?:em\s+|no\s+)([A-Z\s]{3,40})(?:\s+para|\s+cartao|$)/i,
            /-\s+([A-Z\s]{3,40})(?:\s|$)/i
        ];

        for (const pattern of afterAmountPatterns) {
            const match = fullText.match(pattern);
            if (match && match[1]) {
                let description = match[1].trim()
                    .replace(/\s+/g, ' ') // Normalizar espaços
                    .replace(/\s+(para|cartao|com|final).*$/i, '') // Remover texto desnecessário
                    .trim();

                if (description.length >= 3) {
                    // Capitalizar primeira letra de cada palavra
                    description = description.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
                    return description.substring(0, 40);
                }
            }
        }

        // PRIORIDADE 3: Fallback usando título/corpo sem palavras genéricas
        let description = (title || body)
            .replace(/R\$\s?\d+[.,]?\d*/g, '') // Remove valores
            .replace(/\d{2}\/\d{2}\/\d{4}/g, '') // Remove datas
            .replace(/\d{2}:\d{2}/g, '') // Remove horários
            .replace(/compra|aprovada|debito|credito|cartao/gi, '') // Remove palavras comuns
            .trim();

        // Se ainda não temos uma boa descrição, usar padrão do banco
        if (description.length < 3) {
            description = `Transação ${bankName}`;
        }

        // Capitalizar e limitar tamanho
        description = description.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        return description.substring(0, 40);
    } private static extractMerchant(title: string, body: string): string | undefined {
        const text = title + ' ' + body;

        // Padrões comuns para estabelecimentos (usando texto original, não lowercase)
        const merchantPatterns = [
            /aprovada\s+em\s+([A-Za-z\s]{3,30})\s+para/i,
            /em\s+([A-Za-z\s]{3,30})\s+para/i,
            /no\s+([A-Z\s]{3,30})/i,
            /em\s+([A-Z\s]{3,30})/i,
            /-\s+([A-Z\s]{3,30})/i,
        ];

        for (const pattern of merchantPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                let merchant = match[1].trim();
                // Limpar texto comum
                merchant = merchant.replace(/\s+(para|cartao|com|final).*$/i, '');
                return merchant.trim();
            }
        }

        return undefined;
    }

    private static determineCategory(text: string): string {
        const lowerText = text.toLowerCase();

        const categoryPatterns = [
            { pattern: /supermercado|mercado|alimentação|comida/i, category: 'Alimentação' },
            { pattern: /posto|gasolina|combustível|shell|ipiranga/i, category: 'Transporte' },
            { pattern: /farmácia|medicamento|saúde/i, category: 'Saúde' },
            { pattern: /shopping|loja|magazine|varejo/i, category: 'Compras' },
            { pattern: /restaurante|bar|lanchonete|ifood|uber.*eats/i, category: 'Alimentação' },
            { pattern: /netflix|spotify|amazon|assinatura/i, category: 'Entretenimento' },
            { pattern: /uber|99|taxi|transporte/i, category: 'Transporte' },
        ];

        for (const { pattern, category } of categoryPatterns) {
            if (pattern.test(lowerText)) {
                return category;
            }
        }

        return 'Outros';
    }

    private static determineTransactionType(text: string): 'debit' | 'credit' | 'pix' | 'purchase' {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('pix')) return 'pix';
        if (lowerText.includes('crédito') || lowerText.includes('credit')) return 'credit';
        if (lowerText.includes('débito') || lowerText.includes('debit')) return 'debit';

        return 'purchase';
    }

    // Função auxiliar para formatar data de forma legível
    static formatTransactionDate(): string {
        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const timeStr = now.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        return `${dateStr} às ${timeStr}`;
    }

    // Método para teste e debug
    static testParser() {
        const testCases = [
            {
                title: 'Cartão de débito',
                body: 'Compra aprovada de R$ 25,50 no SUPERMERCADO XYZ em 01/10/2025',
                appId: 'com.nubank.app',
            },
            {
                title: 'Nubank',
                body: 'Compra de R$ 120,00 aprovada no POSTO SHELL',
                appId: 'com.nubank.app',
            },
            {
                title: 'Itaú Débito',
                body: 'Débito de R$ 45,30 - UBER TRIP',
                appId: 'com.itau.app',
            },
        ];

        console.log('🧪 Testando parser de mensagens bancárias:');
        testCases.forEach((testCase, index) => {
            console.log(`\n--- Teste ${index + 1} ---`);
            const result = this.parseMessage(testCase.title, testCase.body, testCase.appId);
            console.log('Input:', testCase);
            console.log('Output:', result);
        });
    }
}