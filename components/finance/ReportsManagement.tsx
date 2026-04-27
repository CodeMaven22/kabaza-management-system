'use client';

import { useState } from 'react';
import { mockPayments, mockFines, mockConfiscations, mockBikes } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Download, Eye } from 'lucide-react';

type ReportType = 'revenue' | 'fines' | 'confiscations' | 'collection';

export function ReportsManagement() {
  const [reportType, setReportType] = useState<ReportType>('revenue');
  const [dateRange, setDateRange] = useState('month');
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const completedPayments = mockPayments.filter((p) => p.status === 'completed');
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidFines = mockFines.filter((f) => f.status === 'paid');
  const unpaidFines = mockFines.filter((f) => f.status === 'unpaid');

  const generateReportData = (type: ReportType) => {
    switch (type) {
      case 'revenue':
        return {
          title: 'Revenue Report',
          period: `Last ${dateRange}`,
          metrics: [
            { label: 'Total Revenue', value: `MWK ${totalRevenue.toLocaleString()}` },
            { label: 'Transactions', value: completedPayments.length },
            { label: 'Average Transaction', value: `MWK ${Math.round(totalRevenue / completedPayments.length).toLocaleString()}` },
            { label: 'Registration Fees', value: `MWK ${completedPayments.filter((p) => p.paymentType === 'registration').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}` },
            { label: 'Monthly Fees', value: `MWK ${completedPayments.filter((p) => p.paymentType === 'monthly').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}` },
          ],
          details: completedPayments.slice(0, 10),
        };
      case 'fines':
        return {
          title: 'Fines Report',
          period: `Last ${dateRange}`,
          metrics: [
            { label: 'Total Fines Issued', value: `MWK ${mockFines.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}` },
            { label: 'Paid Fines', value: `MWK ${paidFines.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}` },
            { label: 'Unpaid Fines', value: `MWK ${unpaidFines.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}` },
            { label: 'Collection Rate', value: `${Math.round((paidFines.reduce((sum, f) => sum + f.amount, 0) / mockFines.reduce((sum, f) => sum + f.amount, 0)) * 100)}%` },
            { label: 'Total Fines Count', value: mockFines.length },
          ],
          details: mockFines.slice(0, 10),
        };
      case 'confiscations':
        return {
          title: 'Confiscations Report',
          period: `Last ${dateRange}`,
          metrics: [
            { label: 'Total Confiscations', value: mockConfiscations.length },
            { label: 'Active Confiscations', value: mockConfiscations.filter((c) => c.status === 'confiscated').length },
            { label: 'Released Bikes', value: mockConfiscations.filter((c) => c.status === 'released').length },
            { label: 'Total Fine Value', value: `MWK ${mockConfiscations.filter((c) => c.fine).reduce((sum, c) => sum + (c.fine || 0), 0).toLocaleString()}` },
            { label: 'Pending Releases', value: mockConfiscations.filter((c) => c.status === 'confiscated').length },
          ],
          details: mockConfiscations.slice(0, 10),
        };
      case 'collection':
        return {
          title: 'Collection Efficiency Report',
          period: `Last ${dateRange}`,
          metrics: [
            { label: 'Bikes Registered', value: mockBikes.length },
            { label: 'Active Bikes', value: mockBikes.filter((b) => b.status === 'active').length },
            { label: 'Inactive Bikes', value: mockBikes.filter((b) => b.status === 'inactive').length },
            { label: 'Expected Revenue', value: `MWK ${(mockBikes.filter((b) => b.status === 'active').length * 4000).toLocaleString()}` },
            { label: 'Actual Revenue', value: `MWK ${totalRevenue.toLocaleString()}` },
          ],
          details: mockBikes.slice(0, 10),
        };
      default:
        return null;
    }
  };

  const currentReport = generateReportData(reportType);

  const handleExport = (format: 'pdf' | 'excel') => {
    const reportName = `${reportType}_${dateRange}_${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
    alert(`Report exported as ${reportName}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Financial Reports</h2>
        <p className="text-gray-600">Generate and export financial reports</p>
      </div>

      {/* Report Generator */}
      <Card>
        <CardHeader>
          <CardTitle>Report Generator</CardTitle>
          <CardDescription>Select report type and date range</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type *</Label>
              <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue Report</SelectItem>
                  <SelectItem value="fines">Fines Report</SelectItem>
                  <SelectItem value="confiscations">Confiscations Report</SelectItem>
                  <SelectItem value="collection">Collection Efficiency Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range *</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setSelectedReport(currentReport)} variant="default" className="gap-2">
              <Eye size={18} />
              Preview Report
            </Button>
            <Button onClick={() => handleExport('pdf')} variant="outline" className="gap-2">
              <Download size={18} />
              Export as PDF
            </Button>
            <Button onClick={() => handleExport('excel')} variant="outline" className="gap-2">
              <Download size={18} />
              Export as Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      {selectedReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={24} />
              {selectedReport.title}
            </CardTitle>
            <CardDescription>Generated for period: {selectedReport.period}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {selectedReport.metrics.map((metric: any, index: number) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
              ))}
            </div>

            {/* Details Table */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 px-4">ID</th>
                      <th className="text-left py-2 px-4">Description</th>
                      <th className="text-left py-2 px-4">Date</th>
                      <th className="text-right py-2 px-4">Amount</th>
                      <th className="text-left py-2 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport.details.map((item: any, index: number) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-4">{item.id}</td>
                        <td className="py-2 px-4">
                          {item.description || item.reason || item.registrationNumber || 'N/A'}
                        </td>
                        <td className="py-2 px-4">
                          {item.paymentDate || item.issuedDate || item.confiscatedDate || item.registrationDate || 'N/A'}
                        </td>
                        <td className="py-2 px-4 text-right">
                          {item.amount || item.fine ? `MWK ${(item.amount || item.fine).toLocaleString()}` : '-'}
                        </td>
                        <td className="py-2 px-4">
                          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {item.status || 'active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export Options */}
            <div className="flex gap-2 border-t border-gray-200 pt-4">
              <Button onClick={() => handleExport('pdf')} variant="outline" className="gap-2">
                <Download size={18} />
                Download as PDF
              </Button>
              <Button onClick={() => handleExport('excel')} variant="outline" className="gap-2">
                <Download size={18} />
                Download as Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sample Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Report Templates</CardTitle>
          <CardDescription>Quick access to common reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Monthly Revenue Summary', type: 'revenue', description: 'Complete monthly revenue breakdown' },
              { name: 'Fine Collection Status', type: 'fines', description: 'All issued and paid fines' },
              { name: 'Confiscation Inventory', type: 'confiscations', description: 'Confiscated bikes status' },
              { name: 'Collection Efficiency', type: 'collection', description: 'Bike registration vs revenue' },
            ].map((report) => (
              <Card key={report.name} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{report.name}</p>
                      <p className="text-sm text-gray-600">{report.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
