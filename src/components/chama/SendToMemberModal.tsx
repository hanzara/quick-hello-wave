import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChamaWalletOps } from '@/hooks/useChamaWalletOps';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { Loader2, Send } from 'lucide-react';

interface SendToMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chamaId: string;
  mgrBalance: number;
}

export const SendToMemberModal: React.FC<SendToMemberModalProps> = ({
  open,
  onOpenChange,
  chamaId,
  mgrBalance
}) => {
  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const { mutate: performOperation, isPending } = useChamaWalletOps();

  const { data: members, isLoading: loadingMembers } = useQuery({
    queryKey: ['chama-members-send', chamaId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // First get members
      const { data: memberData, error: memberError } = await supabase
        .from('chama_members')
        .select('id, user_id')
        .eq('chama_id', chamaId)
        .eq('is_active', true)
        .neq('user_id', user.id);
      
      if (memberError) {
        console.error('Error fetching members:', memberError);
        throw memberError;
      }

      if (!memberData || memberData.length === 0) {
        return [];
      }

      // Then get their profiles
      const userIds = memberData.map(m => m.user_id);
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles_enhanced')
        .select('user_id, full_name, email')
        .in('user_id', userIds);

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
        throw profileError;
      }

      // Merge member and profile data
      const membersWithProfiles = memberData.map(member => ({
        ...member,
        profile: profileData?.find(p => p.user_id === member.user_id)
      }));
      
      console.log('Fetched members with profiles:', membersWithProfiles);
      return membersWithProfiles;
    },
    enabled: open && !!chamaId
  });

  const handleSend = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;
    if (amountNum > mgrBalance) return;
    if (!recipientId) return;

    console.log('Sending funds:', { 
      operation: 'send',
      chamaId,
      amount: amountNum,
      recipient: recipientId
    });

    performOperation({
      operation: 'send',
      chamaId,
      amount: amountNum,
      recipient: recipientId
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setAmount('');
        setRecipientId('');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Send className="h-5 w-5 text-blue-600" />
            Send to Member
          </DialogTitle>
          <DialogDescription>
            Transfer funds from your Merry-Go-Round wallet to another member
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <Label className="text-sm text-muted-foreground">Available Balance</Label>
            <CurrencyDisplay amount={mgrBalance} className="text-2xl font-bold text-blue-600" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-sm font-medium">Select Recipient</Label>
            <Select value={recipientId} onValueChange={setRecipientId}>
              <SelectTrigger id="recipient" className="h-12">
                <SelectValue placeholder="Choose a member" />
              </SelectTrigger>
              <SelectContent>
                {loadingMembers ? (
                  <div className="p-4 text-center text-muted-foreground">Loading members...</div>
                ) : !members || members.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No other members found</div>
                ) : (
                  members.map((member) => {
                    const profile = member.profile;
                    const displayName = profile?.full_name || profile?.email || 'Member';
                    const displayEmail = profile?.email || 'No email';
                    
                    return (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white text-xs font-bold">
                            {displayName[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{displayName}</p>
                            <p className="text-xs text-muted-foreground">{displayEmail}</p>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="send-amount" className="text-sm font-medium">Amount to Send</Label>
            <Input
              id="send-amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              max={mgrBalance}
              step="0.01"
              className="h-12 text-lg"
            />
            <p className="text-xs text-muted-foreground">Maximum: {mgrBalance.toFixed(2)}</p>
          </div>

          {amount && recipientId && parseFloat(amount) > 0 && (
            <div className="bg-muted/50 p-3 rounded-lg space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">You're sending:</span>
                <span className="font-semibold">{parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining balance:</span>
                <span className="font-semibold">{(mgrBalance - parseFloat(amount)).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSend}
            disabled={isPending || !amount || !recipientId || parseFloat(amount) <= 0 || parseFloat(amount) > mgrBalance}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Sending...' : 'Send Funds'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
