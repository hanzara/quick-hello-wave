import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Lock, Eye, EyeOff, ArrowRight, Wallet, PiggyBank, 
  Calendar as CalendarIcon, AlertCircle, Loader2 
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { useToast } from '@/hooks/use-toast';

interface TransferToSavingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mainWalletBalance: number;
  savingGoals: Array<{ id: string; goal_name: string; current_amount: number; target_amount: number }>;
  onTransfer: (data: TransferData) => Promise<void>;
  isLoading: boolean;
}

interface TransferData {
  amount: number;
  sourceOfFunds: string;
  savingCategory: string;
  notes?: string;
  frequency: string;
  startDate?: Date;
}

const TransferToSavingModal: React.FC<TransferToSavingModalProps> = ({
  isOpen,
  onClose,
  mainWalletBalance,
  savingGoals,
  onTransfer,
  isLoading
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [amount, setAmount] = useState('');
  const [sourceOfFunds, setSourceOfFunds] = useState('');
  const [savingCategory, setSavingCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [frequency, setFrequency] = useState('one_time');
  const [startDate, setStartDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const sourcesOfFunds = [
    'Salary', 'Business', 'Freelance', 'Gift', 'Loan', 'Investment Returns', 'Other'
  ];

  const savingCategories = [
    'Emergency Fund', 'Travel', 'School Fees', 'Investment', 'Wedding', 'Business Capital', 
    'Home Purchase', 'Healthcare', 'Car Purchase', 'Vacation', 'Other'
  ];

  const quickAmounts = [500, 1000, 2000, 5000];

  const handlePinSubmit = () => {
    // In a real app, verify PIN against user's stored PIN hash
    if (pin.length === 4) {
      setStep(2);
    } else {
      toast({
        title: "Invalid PIN",
        description: "Please enter a 4-digit PIN",
        variant: "destructive"
      });
    }
  };

  const handleTransfer = async () => {
    if (!amount || !sourceOfFunds || !savingCategory) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(amount) > mainWalletBalance) {
      toast({
        title: "Insufficient Funds",
        description: "Amount exceeds your Main Wallet balance",
        variant: "destructive"
      });
      return;
    }

    try {
      await onTransfer({
        amount: parseFloat(amount),
        sourceOfFunds,
        savingCategory,
        notes: notes || undefined,
        frequency,
        startDate: frequency !== 'one_time' ? startDate : undefined
      });
      
      // Reset form
      setStep(1);
      setPin('');
      setAmount('');
      setSourceOfFunds('');
      setSavingCategory('');
      setNotes('');
      setFrequency('one_time');
      setStartDate(undefined);
      
      onClose();
    } catch (error) {
      // Error already handled in parent
    }
  };

  const selectedGoal = savingGoals.find(g => g.goal_name === savingCategory);
  const progressPercentage = selectedGoal ? (selectedGoal.current_amount / selectedGoal.target_amount) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary" />
            Transfer to Saving Wallet
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <Lock className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">PIN Authentication Required</h3>
              <p className="text-muted-foreground">Enter your 4-digit PIN to proceed</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Input
                  type={showPin ? "text" : "password"}
                  placeholder="• • • •"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={4}
                  className="text-center text-2xl tracking-widest"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPin(!showPin)}
                >
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              <Button 
                onClick={handlePinSubmit} 
                className="w-full"
                disabled={pin.length !== 4}
              >
                Verify PIN & Continue
              </Button>

              <Button variant="link" className="w-full text-sm">
                Forgot PIN?
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* Amount Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (KES) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                  <span>Available in Main Wallet</span>
                  <CurrencyDisplay amount={mainWalletBalance} className="font-medium" showToggle={false} />
                </div>
              </div>

              <div className="flex gap-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(quickAmount.toString())}
                  >
                    KES {quickAmount.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Wallet Display */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className="font-medium">Main Wallet</p>
                      <CurrencyDisplay amount={mainWalletBalance} className="text-sm" showToggle={false} />
                    </div>
                    <Wallet className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">To</p>
                      <p className="font-medium">Saving Wallet</p>
                    </div>
                    <PiggyBank className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="source">Source of Funds *</Label>
                <Select value={sourceOfFunds} onValueChange={setSourceOfFunds}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourcesOfFunds.map((source) => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Saving Goal / Category *</Label>
                <Select value={savingCategory} onValueChange={setSavingCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {savingCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Goal Progress */}
            {selectedGoal && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{selectedGoal.goal_name} Progress</span>
                      <span className="text-sm text-green-600">{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Current: KES {selectedGoal.current_amount.toLocaleString()}</span>
                      <span>Target: KES {selectedGoal.target_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="e.g., Salary saved from Sept bonus"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Automation */}
            <div className="space-y-4">
              <div>
                <Label>Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_time">One-time</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {frequency !== 'one_time' && (
                <div>
                  <Label>Start Date</Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          setIsCalendarOpen(false);
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            {/* Live Summary */}
            {amount && sourceOfFunds && savingCategory && (
              <Card className="border-primary bg-primary/5">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Transfer Summary</h4>
                  <div className="space-y-1 text-sm">
                    <p>You're moving <strong>KES {parseFloat(amount).toLocaleString()}</strong></p>
                    <p>from <strong>Main Wallet</strong> → <strong>Saving Wallet</strong></p>
                    <p>For: <Badge variant="secondary">{savingCategory}</Badge></p>
                    <p>Source: <Badge variant="outline">{sourceOfFunds}</Badge></p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleTransfer} 
                className="flex-1"
                disabled={!amount || !sourceOfFunds || !savingCategory || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Confirm & Transfer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransferToSavingModal;