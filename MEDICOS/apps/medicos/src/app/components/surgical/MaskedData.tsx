import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';

interface MaskedDataProps {
  value: string;
  type: 'cpf' | 'phone' | 'text';
}

export function MaskedData({ value, type }: MaskedDataProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  const maskCPF = (cpf: string) => {
    if (!cpf) return '';
    const cleaned = cpf.replace(/\D/g, '');
    return `***.***.**${cleaned.slice(-2)}`;
  };

  const maskPhone = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    return `(**) ****-${cleaned.slice(-4)}`;
  };

  const maskText = (text: string) => {
    if (!text) return '';
    return '*'.repeat(text.length);
  };

  const getMaskedValue = () => {
    if (isRevealed) return value;
    
    switch (type) {
      case 'cpf':
        return maskCPF(value);
      case 'phone':
        return maskPhone(value);
      case 'text':
        return maskText(value);
      default:
        return value;
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <span className="font-mono">{getMaskedValue()}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={() => setIsRevealed(!isRevealed)}
      >
        {isRevealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
      </Button>
    </div>
  );
}
