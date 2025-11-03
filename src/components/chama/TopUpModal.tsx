import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useChamaWalletOps } from '@/hooks/useChamaWalletOps';
import { useCentralWallet } from '@/hooks/useWalletOperations';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { Loader2 } from 'lucide-react';

interface TopUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chamaId: string;
  savingsBalance: number;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({
  open,
  onOpenChange,
  chamaId,
  savingsBalance
}) => {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<'central' | 'savings'>('central');
  const { mutate: performOperation, isPending } = useChamaWalletOps();
  const { data: centralWalletData } = useCentralWallet();
  
  const centralBalance = centralWalletData?.balance || 0;
  const maxAmount = source === 'central' ? centralBalance : savingsBalance;

  const handleTopUp = () => {
    const amountNum = parseFloat(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      return;
    }
    
    if (amountNum > maxAmount) {
      return;
    }

    performOperation({
      operation: 'topup',
      chamaId,
      amount: amountNum,
      source
    } as any, {
      onSuccess: (data) => {
        console.log('Top-up successful:', data);
        onOpenChange(false);
        setAmount('');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Top Up Merry-Go-Round Wallet</DialogTitle>
          <DialogDescription>
            Transfer funds to your Merry-Go-Round wallet
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Source of Funds</Label>
            <RadioGroup value={source} onValueChange={(v) => setSource(v as 'central' | 'savings')} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="central" id="central" />
                <Label htmlFor="central" className="font-normal cursor-pointer">
                  Central Wallet (<CurrencyDisplay amount={centralBalance} />)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="savings" id="savings" />
                <Label htmlFor="savings" className="font-normal cursor-pointer">
                  Chama Savings (<CurrencyDisplay amount={savingsBalance} />)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Available Balance</Label>
            <CurrencyDisplay amount={maxAmount} className="text-lg font-semibold" />
          </div>

          <div>
            <Label htmlFor="amount">Amount to Transfer</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              max={maxAmount}
              step="0.01"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleTopUp}
            disabled={isPending || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Top Up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
