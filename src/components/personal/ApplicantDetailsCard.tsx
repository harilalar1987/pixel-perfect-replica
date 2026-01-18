import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApplicantDetails, BusinessDetails } from '@/types/personalDiscussion';
import { User, Phone, Mail, Calendar, Video, Building2, Users, MapPin, Factory } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface ApplicantDetailsCardProps {
  applicant: ApplicantDetails;
  business: BusinessDetails;
}

export function ApplicantDetailsCard({ applicant, business }: ApplicantDetailsCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Applicant Information */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Applicant Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="font-medium text-foreground">{applicant.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Designation</p>
              <p className="font-medium text-foreground">{applicant.designation}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">{applicant.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium text-foreground text-sm">{applicant.email}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">Interview Details</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground text-sm">
                    {format(new Date(applicant.interviewDate), 'dd MMM yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Mode</p>
                  <Badge variant="outline" className="text-xs">
                    {applicant.interviewMode}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Interviewed By</p>
                <p className="font-medium text-foreground text-sm">{applicant.interviewedBy}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">Business Name</p>
            <p className="font-medium text-foreground">{business.businessName}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Constitution</p>
              <p className="font-medium text-foreground text-sm">{business.constitution}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Years in Business</p>
              <p className="font-medium text-foreground">{business.yearsInBusiness} years</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Industry</p>
              <p className="font-medium text-foreground text-sm">{business.industry}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Products/Services</p>
            <p className="font-medium text-foreground text-sm">{business.productServices}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Employees</p>
                <p className="font-medium text-foreground">{business.numberOfEmployees}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Factory className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Premises</p>
                <Badge variant={business.businessPremises === 'Owned' ? 'default' : 'secondary'} className="text-xs">
                  {business.businessPremises}
                </Badge>
              </div>
            </div>
            {business.monthlyRent && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Rent</p>
                  <p className="font-medium text-foreground">{formatCurrency(business.monthlyRent)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Key Customers</p>
              <div className="flex flex-wrap gap-1">
                {business.keyCustomers.slice(0, 3).map((customer, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {customer}
                  </Badge>
                ))}
                {business.keyCustomers.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{business.keyCustomers.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Key Suppliers</p>
              <div className="flex flex-wrap gap-1">
                {business.keySuppliers.slice(0, 3).map((supplier, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {supplier}
                  </Badge>
                ))}
                {business.keySuppliers.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{business.keySuppliers.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
