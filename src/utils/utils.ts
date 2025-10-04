export function formatToBRL(value: number): string {
    // Validação para evitar erro com valores undefined/null
    if (value === undefined || value === null || isNaN(value)) {
        console.warn('formatToBRL: Valor inválido recebido:', value);
        return 'R$ 0,00';
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
export function parseFromBRL(value: string): number {
    return parseFloat(value.replace(/[R$\s.]/g, '').replace(',', '.'));
}