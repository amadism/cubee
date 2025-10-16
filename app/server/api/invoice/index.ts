import { defineEventHandler, getQuery, createError, setHeader, readBody } from 'h3'

interface InvoiceData {
  customerName: string
  amount: number
  date: string
  caseId: string
  reportType: string
  vehicleModelType: string
  companyName?: string
}

export default defineEventHandler(async (event) => {
  try {
    let invoiceData: InvoiceData & { companyName: string }
    
    if (event.method === 'POST') {
      const body = await readBody(event) as InvoiceData
      invoiceData = {
        customerName: body.customerName,
        amount: body.amount,
        date: body.date,
        caseId: body.caseId,
        reportType: body.reportType,
        vehicleModelType: body.vehicleModelType,
        companyName: body.companyName || 'Cubee'
      }
    } else {
      const query = getQuery(event)
      invoiceData = {
        customerName: query.customerName as string,
        amount: Number(query.amount),
        date: query.date as string,
        caseId: query.caseId as string,
        reportType: query.reportType as string,
        vehicleModelType: query.vehicleModelType as string,
        companyName: (query.companyName as string) || 'Cubee'
      }
    }
    
    // Validate required fields
    const requiredFields = ['customerName', 'amount', 'date', 'caseId', 'reportType', 'vehicleModelType']
    const missingFields = requiredFields.filter(field => !invoiceData[field as keyof typeof invoiceData])
    
    if (missingFields.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Missing required fields: ${missingFields.join(', ')}`
      })
    }

    // Generate HTML invoice with print-optimized styling
    const invoiceHtml = generateInvoiceHtml(invoiceData)
    setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    
    return invoiceHtml
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to generate invoice'
    })
  }
})

function generateInvoiceHtml(data: InvoiceData & { companyName: string }): string {
  const currentDate = new Date(data.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - ${data.companyName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        
        .invoice-container { max-width: 800px; margin: 0 auto; }
        
        .header { background: #0b1220; color: #ffffff; padding: 20px; text-align: left; border-bottom: 4px solid #facc15; }
        
        .brand { display: flex; align-items: center; gap: 12px; }
        
        .brand img { height: 32px; width: 32px; display: inline-block; }
        
        .brand .company { font-size: 1.5rem; font-weight: 700; letter-spacing: 0.2px; }
        
        .content { padding: 24px; background-color: #fefce8; }
        
        .invoice-title { font-size: 1.5rem; font-weight: 600; color: #1f2937; margin-bottom: 16px; text-align: center; }
        
        .invoice-details { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        
        .detail-section { padding: 0; }
        
        .detail-title { font-size: 1rem; font-weight: 600; color: #374151; margin-bottom: 8px; }
        
        .detail-item { margin-bottom: 6px; color: #6b7280; }
        
        .detail-label { font-weight: 500; color: #374151; }
        
        .service-section { margin-bottom: 24px; }
        
        .service-title { font-size: 1.25rem; font-weight: 600; color: #1f2937; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
        
        .service-table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; }
        
        .service-table th { background: #f8fafc; color: #374151; font-weight: 600; padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        
        .service-table td { padding: 12px; border-bottom: 1px solid #f3f4f6; color: #6b7280; }
        
        .service-table tr:last-child td { border-bottom: none; }
        
        .amount-cell { font-weight: 600; color: #1f2937; text-align: right; }
        
        .total-section { text-align: right; margin-top: 16px; padding-top: 12px; border-top: 1px solid #e5e7eb; }
        
        .total-amount { font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-top: 4px; }
        
        .print-button { position: fixed; top: 16px; right: 16px; background: #ffffff; color: #111827; border: 1px solid #e5e7eb; padding: 8px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .print-button:hover { background: #f9fafb; }
        
        @media print {
            body { background: white !important; padding: 0 !important; margin: 0 !important; }
            
            .print-button { display: none !important; }
            
            .invoice-container { box-shadow: none !important; border-radius: 0 !important; margin: 0 !important; max-width: none !important; }
            
            @page {
                margin: 0.5in;
                size: A4;
            }
        }
        
        @media (max-width: 768px) {
            .invoice-details { grid-template-columns: 1fr; gap: 16px; }
            .header, .content { padding: 16px; }
        }
    </style>
</head>
<body>
    <button class="print-button" onclick="window.print()">📄 Print / Save as PDF</button>
    
    <div class="invoice-container">
        <div class="header">
            <div class="brand">
                <img src="/favicon.svg" alt="${data.companyName} Logo" />
                <div class="company">${data.companyName}</div>
            </div>
        </div>
        
        <div class="content">
            <h1 class="invoice-title">Invoice</h1>
            
            <div class="invoice-details">
                <div class="detail-section">
                    <h3 class="detail-title">Bill To</h3>
                    <div class="detail-item">
                        <span class="detail-label">Customer:</span> ${data.customerName}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Case ID:</span> ${data.caseId}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3 class="detail-title">Invoice Details</h3>
                    <div class="detail-item">
                        <span class="detail-label">Invoice Date:</span> ${currentDate}
                    </div>
                </div>
            </div>
            
            <div class="service-section">
                <h2 class="service-title">Service Details</h2>
                <table class="service-table">
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Vehicle Type</th>
                            <th>Report Type</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Vehicle Assessment & Report</td>
                            <td>${data.vehicleModelType}</td>
                            <td>${data.reportType}</td>
                            <td class="amount-cell">€${data.amount.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="total-section">
                    <div class="detail-item">
                        <span class="detail-label">Subtotal:</span> €${data.amount.toFixed(2)}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Tax (0%):</span> €0.00
                    </div>
                    <div class="total-amount">
                        Total: €${data.amount.toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Auto-focus for better printing experience
        document.addEventListener('DOMContentLoaded', function() {
            const printButton = document.querySelector('.print-button');
            
            printButton.addEventListener('click', function() {
                setTimeout(() => {
                    window.print();
                }, 100);
            });
        });
    </script>
</body>
</html>
  `
}
