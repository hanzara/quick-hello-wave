
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Calendar, DollarSign, Vote } from 'lucide-react';
import { useChamaMetrics } from '@/hooks/useChamaMetrics';
import { useMemberReputation } from '@/hooks/useMemberReputation';
import { useLanguage } from '@/contexts/LanguageContext';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import MemberReputationCard from './MemberReputationCard';

interface ChamaDashboardProps {
  chamaId: string;
  chamaName: string;
}

const ChamaDashboard: React.FC<ChamaDashboardProps> = ({ chamaId, chamaName }) => {
  const { t } = useLanguage();
  const { data: metrics, isLoading: metricsLoading } = useChamaMetrics(chamaId);
  const { data: reputation, isLoading: reputationLoading } = useMemberReputation(chamaId);

  if (metricsLoading || reputationLoading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.net.worth')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CurrencyDisplay 
              amount={metrics?.net_worth || 0} 
              className="text-2xl font-bold" 
              showToggle={false} 
            />
            <p className="text-xs text-muted-foreground">
              Total group savings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.upcoming.contributions')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.upcoming_contributions_count || 0}</div>
            <p className="text-xs text-muted-foreground">
              Members due this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.pending.votes')}</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.pending_votes_count || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active voting sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.roi')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.roi_percentage || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Annual return rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Member Reputation */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{t('member.reputation')}</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reputation?.map((member: any) => (
            <MemberReputationCard
              key={member.id}
              memberName={member.chama_members?.profiles?.full_name || 'Unknown Member'}
              contributionScore={member.contribution_score || 0}
              repaymentScore={member.repayment_score || 0}
              participationScore={member.participation_score || 0}
              overallScore={member.overall_score || 0}
              lastCalculated={member.last_calculated}
            />
          ))}
        </div>
      </div>

      {/* Repayment Performance */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.repayment.performance')}</CardTitle>
          <CardDescription>Average loan repayment performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Performance Score</span>
                <span className="text-sm font-medium">
                  {metrics?.average_repayment_performance?.toFixed(1) || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${metrics?.average_repayment_performance || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChamaDashboard;
