import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Transaction } from '../models/transaction';
import { useTheme } from '../context/ThemeContext';
import { useFinances } from '../context/FinancesContext';
import { ArrowUpIcon, ArrowDownIcon } from 'react-native-heroicons/outline';

interface TransactionModalProps {
    visible: boolean;
    onClose: () => void;
    transaction?: Transaction; // Se fornecido, é modo edição; se não, é modo criação
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

// Componente para seleção de tipo de transação
interface TransactionTypeSelectorProps {
    selectedType: 1 | 2;
    onTypeChange: (type: 1 | 2) => void;
    theme: any;
    isDark: boolean;
}

const TransactionTypeSelector: React.FC<TransactionTypeSelectorProps> = ({
    selectedType,
    onTypeChange,
    theme,
    isDark
}) => (
    <>
        <Text style={[styles.label, { color: theme.colors.text }]}>
            Tipo:
        </Text>
        <View style={styles.typeSelector}>
            <TouchableOpacity
                onPress={() => onTypeChange(1)}
                style={[
                    styles.typeButton,
                    {
                        backgroundColor: selectedType === 1 
                            ? '#22c55e'
                            : (isDark ? '#374151' : '#f3f4f6'),
                        borderColor: theme.colors.border
                    }
                ]}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ArrowUpIcon size={16} color={selectedType === 1 ? '#ffffff' : theme.colors.text} />
                    <Text style={[
                        styles.typeText,
                        {
                            color: selectedType === 1 
                                ? '#ffffff'
                                : theme.colors.text,
                            marginLeft: 6
                        }
                    ]}>
                        Entrada
                    </Text>
                </View>
            </TouchableOpacity>
            
            <TouchableOpacity
                onPress={() => onTypeChange(2)}
                style={[
                    styles.typeButton,
                    {
                        backgroundColor: selectedType === 2 
                            ? '#ef4444'
                            : (isDark ? '#374151' : '#f3f4f6'),
                        borderColor: theme.colors.border
                    }
                ]}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ArrowDownIcon size={16} color={selectedType === 2 ? '#ffffff' : theme.colors.text} />
                    <Text style={[
                        styles.typeText,
                        {
                            color: selectedType === 2 
                                ? '#ffffff'
                                : theme.colors.text,
                            marginLeft: 6
                        }
                    ]}>
                        Saída
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    </>
);

// Componente para campos do formulário
interface TransactionFormFieldsProps {
    label: string;
    onLabelChange: (text: string) => void;
    value: string;
    onValueChange: (text: string) => void;
    category: string;
    onCategoryChange: (category: string) => void;
    theme: any;
    isDark: boolean;
}

const TransactionFormFields: React.FC<TransactionFormFieldsProps> = ({
    label,
    onLabelChange,
    value,
    onValueChange,
    category,
    onCategoryChange,
    theme,
    isDark
}) => (
    <>
        <Text style={[styles.label, { color: theme.colors.text }]}>
            Descrição:
        </Text>
        <TextInput
            value={label}
            onChangeText={onLabelChange}
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
            onChangeText={(text) => {
                // Remove tudo que não é número
                const numericValue = text.replace(/[^\d]/g, '');
                
                // Se não tem valor, limpa o campo
                if (!numericValue) {
                    onValueChange('');
                    return;
                }
                
                // Converte para número e divide por 100 para ter centavos
                const number = parseInt(numericValue) / 100;
                
                // Formata com máscara monetária
                const formatted = `R$ ${number.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
                
                onValueChange(formatted);
            }}
            style={[styles.input, { 
                color: theme.colors.text,
                borderColor: theme.colors.border,
                backgroundColor: isDark ? '#374151' : '#f9fafb'
            }]}
            placeholder="R$ 0,00"
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
                    onPress={() => onCategoryChange(cat)}
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
    </>
);

// Componente para ações do modal
interface TransactionModalActionsProps {
    onCancel: () => void;
    onSave: () => void;
    saveButtonText: string;
    theme: any;
}

const TransactionModalActions: React.FC<TransactionModalActionsProps> = ({
    onCancel,
    onSave,
    saveButtonText,
    theme
}) => (
    <View style={styles.buttonRow}>
        <TouchableOpacity
            onPress={onCancel}
            style={[styles.button, styles.cancelButton]}
        >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
            onPress={onSave}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
        >
            <Text style={styles.saveButtonText}>{saveButtonText}</Text>
        </TouchableOpacity>
    </View>
);

export const TransactionModal: React.FC<TransactionModalProps> = ({
    visible,
    onClose,
    transaction
}) => {
    const { theme, isDark } = useTheme();
    const { updateTransaction, addTransaction } = useFinances();
    
    // Determinar se é modo de edição ou criação baseado na presença da transaction
    const isEditMode = !!transaction;
    const isCreateMode = !transaction;
    
    const [label, setLabel] = useState('');
    const [category, setCategory] = useState('Outros');
    const [value, setValue] = useState('');
    const [transactionType, setTransactionType] = useState<1 | 2>(2); // 1=Entrada, 2=Saída
    
    // Resetar ou carregar campos baseado no modo
    useEffect(() => {
        if (visible) {
            if (isEditMode && transaction) {
                // Modo edição: carregar dados da transação
                setLabel(transaction.label);
                setCategory(transaction.category || 'Outros');
                
                // Formatar valor com máscara monetária
                const formattedValue = `R$ ${transaction.value.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
                setValue(formattedValue);
                
                setTransactionType(transaction.type as 1 | 2);
            } else {
                // Modo criação: resetar campos
                setLabel('');
                setCategory('Outros');
                setValue('');
                setTransactionType(2);
            }
        }
    }, [visible, transaction, isEditMode]);

    const handleSave = async () => {
        // Extrair valor numérico da máscara R$ X.XXX,XX
        const cleanValue = value.replace(/[^\d,]/g, '').replace(',', '.');
        const numericValue = parseFloat(cleanValue);
        
        if (!value || isNaN(numericValue) || numericValue <= 0) {
            Alert.alert('Erro', 'Digite um valor válido');
            return;
        }
        
        if (!label.trim()) {
            Alert.alert('Erro', 'Digite uma descrição para a transação');
            return;
        }

        try {
            if (isCreateMode) {
                // MODO CRIAÇÃO: Criar nova transação
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
            } else {
                // MODO EDIÇÃO: Atualizar transação existente
                const updatedTransaction: Transaction = {
                    ...transaction!,
                    label: label.trim(),
                    category,
                    value: numericValue,
                    type: transactionType
                };
                await updateTransaction(updatedTransaction);
            }
            
            onClose();
        } catch (error) {
            const errorMessage = isCreateMode 
                ? 'Não foi possível criar a transação'
                : 'Não foi possível atualizar a transação';
            Alert.alert('Erro', errorMessage);
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
                        {isCreateMode ? 'Nova Transação' : 'Editar Transação'}
                    </Text>

                    {/* Seletor de Tipo (visível apenas no modo criação) */}
                    {isCreateMode && (
                        <TransactionTypeSelector 
                            selectedType={transactionType}
                            onTypeChange={setTransactionType}
                            theme={theme}
                            isDark={isDark}
                        />
                    )}

                    {/* Campos comuns para ambos os modos */}
                    <TransactionFormFields 
                        label={label}
                        onLabelChange={setLabel}
                        value={value}
                        onValueChange={setValue}
                        category={category}
                        onCategoryChange={setCategory}
                        theme={theme}
                        isDark={isDark}
                    />

                    {/* Botões de ação */}
                    <TransactionModalActions 
                        onCancel={onClose}
                        onSave={handleSave}
                        saveButtonText={isCreateMode ? 'Criar' : 'Salvar'}
                        theme={theme}
                    />

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
        borderRadius: 16,
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

// Alias para manter compatibilidade com código existente
export const EditTransactionModal = TransactionModal;