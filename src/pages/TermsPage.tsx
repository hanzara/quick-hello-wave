import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="space-y-8">
          {/* Terms and Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <FileText className="h-6 w-6" />
                Terms and Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h3>1. Acceptance of Terms</h3>
              <p>
                By accessing and using our fintech platform, you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h3>2. Use License</h3>
              <p>
                Permission is granted to temporarily download one copy of our platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul>
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on our platform</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>

              <h3>3. Financial Services</h3>
              <p>
                Our platform provides financial technology services including but not limited to payment processing, digital wallets, and financial analytics. By using these services, you acknowledge that:
              </p>
              <ul>
                <li>You are responsible for all transactions made through your account</li>
                <li>You will provide accurate and current information</li>
                <li>You will not use the service for any illegal activities</li>
                <li>You understand the risks associated with digital financial services</li>
              </ul>

              <h3>4. Account Security</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>

              <h3>5. Limitation of Liability</h3>
              <p>
                In no event shall our company or its suppliers be liable for any damages arising out of the use or inability to use the materials on our platform.
              </p>

              <h3>6. Governing Law</h3>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which our company operates.
              </p>
            </CardContent>
          </Card>

          {/* Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="h-6 w-6" />
                Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h3>1. Information We Collect</h3>
              <p>
                We collect information you provide directly to us, such as when you create an account, make a transaction, or contact us for support.
              </p>
              <ul>
                <li>Personal information (name, email address, phone number)</li>
                <li>Financial information (account details, transaction history)</li>
                <li>Usage data (how you interact with our platform)</li>
                <li>Device information (IP address, browser type, operating system)</li>
              </ul>

              <h3>2. How We Use Your Information</h3>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and security alerts</li>
                <li>Respond to your comments and questions</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h3>3. Information Sharing</h3>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>
              <ul>
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist in our operations</li>
              </ul>

              <h3>4. Data Security</h3>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h3>5. Data Retention</h3>
              <p>
                We retain your information for as long as necessary to provide our services and comply with legal obligations.
              </p>

              <h3>6. Your Rights</h3>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to processing of your information</li>
                <li>Data portability</li>
              </ul>

              <h3>7. Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@ourplatform.com.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};