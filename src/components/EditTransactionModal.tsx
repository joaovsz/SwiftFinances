import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Transaction } from '../models/transaction';
import { useTheme } from '../context/ThemeContext';
import { useFinances } from '../context/FinancesContext';

interface EditTransactionModalProps {
    visible: boolean;
    onClose: () => void;
    transaction?: Transaction; // Opcional para nova transação
    isNewTransaction?: boolean;
}

const categories = [
    'Alimentação',
    'Transporte', 
    'Saúde',
    'Compras',
    'Entretenimento',
    'Educação',
    'Casa',
    'Outros'
];

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
    visible,
    onClose,
    transaction,
    isNewTransaction = false
}) => {
    const { theme, isDark } = useTheme();
    const { updateTransaction, addTransaction } = useFinances();
    
    const [label, setLabel] = useState('');
    const [category, setCategory] = useState('Outros');
    const [value, setValue] = useState('');
    const [transactionType, setTransactionType] = useState<1 | 2>(2); // 1=Entrada, 2=Saída
    
    // Atualizar campos quando transaction mudar
    useEffect(() => {
        if (transaction && !isNewTransaction) {
            setLabel(transaction.label);
            setCategory(transaction.category || 'Outros');
            setValue(transaction.value.toString());
            setTransactionType(transaction.type as 1 | 2);
        } else {
            // Resetar para nova transação
            setLabel('');
            setCategory('Outros');
            setValue('');
            setTransactionType(2);
        }
    }, [transaction, isNewTransaction, visible]);

    const handleSave = async () => {
        const numericValue = parseFloat(value.replace(',', '.'));
        
        if (isNaN(numericValue) || numericValue <= 0) {
            Alert.alert('Erro', 'Digite um valor válido');
            return;
        }
        
        if (!label.trim()) {
            Alert.alert('Erro', 'Digite uma descrição para a transação');
            return;
        }

        try {
            if (isNewTransaction) {
                // Criar nova transação
                const newTransaction: Transaction = {
                    id: Date.now(),
                    label: label.trim(),
                    category,
                    value: numericValue,
                    type: transactionType,
                    date: new Date().toISOString(),
                    isAutomatic: false
                };
                await addTransaction(newTransaction);
            } else if (transaction) {
                // Atualizar transação existente
                const updatedTransaction: Transaction = {
                    ...transaction,
                    label: label.trim(),
                    category,
                    value: numericValue,
                    type: transactionType
                };
                await updateTransaction(updatedTransaction);
            }
            onClose();
        } catch (error) {
            Alert.alert('Erro', isNewTransaction 
                ? 'Não foi possível criar a transação'
                : 'Não foi possível atualizar a transação'
            );
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        {isNewTransaction ? 'Nova Transação' : 'Editar Transação'}
                    </Text>

                    {/* Tipo de Transação (somente para nova) */}
                    {isNewTransaction && (
                        <>
                            <Text style={[styles.label, { color: theme.colors.text }]}>
                                Tipo:
                            </Text>
                            <View style={styles.typeSelector}>
                                <TouchableOpacity
                                    onPress={() => setTransactionType(1)}
                                    style={[
                                        styles.typeButton,
                                        {
                                            backgroundColor: transactionType === 1 
                                                ? '#22c55e'
                                                : (isDark ? '#374151' : '#f3f4f6'),
                                            borderColor: theme.colors.border
                                        }
                                    ]}
                                >
                                    <Text style={[
                                        styles.typeText,
                                        {
                                            color: transactionType === 1 
                                                ? '#ffffff'
                                                : theme.colors.text
                                        }
                                    ]}>
                                        💰 Entrada
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    onPress={() => setTransactionType(2)}
                                    style={[
                                        styles.typeButton,
                                        {
                                            backgroundColor: transactionType === 2 
                                                ? '#ef4444'
                                                : (isDark ? '#374151' : '#f3f4f6'),
                                            borderColor: theme.colors.border
                                        }
                                    ]}
                                >
                                    <Text style={[
                                        styles.typeText,
                                        {
                                            color: transactionType === 2 
                                                ? '#ffffff'
                                                : theme.colors.text
                                        }
                                    ]}>
                                        📉 Saída
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                    <Text style={[styles.label, { color: theme.colors.text }]}>
                        Descrição:
                    </Text>
                    <TextInput
                        value={label}
                        onChangeText={setLabel}
                        style={[styles.input, { 
                            color: theme.colors.text,
                            borderColor: theme.colors.border,
                            backgroundColor: isDark ? '#374151' : '#f9fafb'
                        }]}
                        placeholder="Nome da transação"
                        placeholderTextColor={theme.colors.text + '80'}
                    />

                    <Text style={[styles.label, { color: theme.colors.text }]}>
                        Valor:
                    </Text>
                    <TextInput
                        value={value}
                        onChangeText={setValue}
                        style={[styles.input, { 
                            color: theme.colors.text,
                            borderColor: theme.colors.border,
                            backgroundColor: isDark ? '#374151' : '#f9fafb'
                        }]}
                        placeholder="0.00"
                        keyboardType="numeric"
                        placeholderTextColor={theme.colors.text + '80'}
                    />

                    <Text style={[styles.label, { color: theme.colors.text }]}>
                        Categoria:
                    </Text>
                    <View style={styles.categoriesGrid}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setCategory(cat)}
                                style={[
                                    styles.categoryButton,
                                    {
                                        backgroundColor: category === cat 
                                            ? theme.colors.primary
                                            : (isDark ? '#374151' : '#f3f4f6'),
                                        borderColor: theme.colors.border
                                    }
                                ]}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    {
                                        color: category === cat 
                                            ? '#ffffff'
                                            : theme.colors.text
                                    }
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.button, styles.cancelButton]}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={handleSave}
                            style={[styles.button, { backgroundColor: theme.colors.primary }]}
                        >
                            <Text style={styles.saveButtonText}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    categoryButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '500',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#6b7280',
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    typeSelector: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    typeText: {
        fontSize: 14,
        fontWeight: '600',
    },
});