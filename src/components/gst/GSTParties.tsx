import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, Truck, ShoppingCart, AlertTriangle } from 'lucide-react';
import { TopParty, CommonParty } from '@/types/gst';
import { motion } from 'framer-motion';

interface GSTPartiesProps {
  topSuppliers: TopParty[];
  topCustomers: TopParty[];
  commonParties: CommonParty[];
}

export function GSTParties({ topSuppliers, topCustomers, commonParties }: GSTPartiesProps) {
  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const getConcentrationColor = (percentage: number) => {
    if (percentage >= 25) return 'text-status-error';
    if (percentage >= 15) return 'text-status-warning';
    return 'text-status-success';
  };

  const getConcentrationBadge = (percentage: number) => {
    if (percentage >= 25) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-status-error/10 text-status-error">
          High
        </span>
      );
    }
    if (percentage >= 15) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-status-warning/10 text-status-warning">
          Moderate
        </span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Suppliers */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="border-border bg-card shadow-card h-full">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Top Suppliers (by Invoice Value)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier Name</TableHead>
                    <TableHead>PAN</TableHead>
                    <TableHead className="text-right">Invoice Value</TableHead>
                    <TableHead className="text-right">Share %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topSuppliers.map((supplier, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{supplier.pan}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(supplier.invoiceValue)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`font-bold ${getConcentrationColor(supplier.sharePercentage)}`}>
                            {supplier.sharePercentage}%
                          </span>
                          {getConcentrationBadge(supplier.sharePercentage)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Customers */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="border-border bg-card shadow-card h-full">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Top Customers (by Invoice Value)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>PAN</TableHead>
                    <TableHead className="text-right">Invoice Value</TableHead>
                    <TableHead className="text-right">Share %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCustomers.map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{customer.pan}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(customer.invoiceValue)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`font-bold ${getConcentrationColor(customer.sharePercentage)}`}>
                            {customer.sharePercentage}%
                          </span>
                          {getConcentrationBadge(customer.sharePercentage)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Common Parties */}
      {commonParties.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-status-warning/30 bg-status-warning/5 shadow-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-status-warning" />
                Common Parties Analysis
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  (Entities acting as both supplier and customer)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-status-warning/10 border border-status-warning/20 rounded-lg p-4 mb-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-status-warning">⚠️ Risk Alert:</span>{' '}
                  Common parties may indicate circular trading, related-party exposure, or revenue inflation concerns. 
                  These transactions require additional scrutiny during underwriting.
                </p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Party Name</TableHead>
                    <TableHead className="text-right">Sales Share %</TableHead>
                    <TableHead className="text-right">As Customer</TableHead>
                    <TableHead className="text-right">As Supplier</TableHead>
                    <TableHead className="text-right">Total Invoices</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commonParties.map((party, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{party.name}</TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold text-status-warning">{party.salesSharePercentage}%</span>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(party.customerInvoiceValue)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(party.supplierInvoiceValue)}</TableCell>
                      <TableCell className="text-right">{party.totalInvoices}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
