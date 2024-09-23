export function formatToBRL(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
export function parseFromBRL(value: string): number {
    return parseFloat(value.replace(/[R$\s.]/g, '').replace(',', '.'));
}