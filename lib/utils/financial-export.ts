'use client'

// Dynamic imports to avoid SSR issues

interface RevenueStream {
  id: string
  name: string
  monthlyAmount: number
  growthRate: number
}

interface ExpenseCategory {
  id: string
  name: string
  monthlyAmount: number
  growthRate: number
  category: 'fixed' | 'variable'
}

interface MonthlyProjection {
  month: number
  year: number
  revenue: number
  expenses: number
  cashFlow: number
  cumulativeCashFlow: number
}

interface KeyMetrics {
  monthlyBurnRate: number
  runway: number
  breakEvenMonth: number | null
  cac: number
  ltv: number
  ltvCacRatio: number
  grossMargin: number
  netMargin: number
}

interface FinancialProjectionData {
  name: string
  revenueStreams: RevenueStream[]
  expenseCategories: ExpenseCategory[]
  projections: MonthlyProjection[]
  keyMetrics: KeyMetrics | null
  scenario: string
  timeframe: number
  startingCash: number
}

export async function exportFinancialProjectionsToPDF(data: FinancialProjectionData) {
  // Dynamic import to avoid SSR issues
  const { default: jsPDF } = await import('jspdf')
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - 2 * margin
  let yPosition = margin

  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  // Title Page
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  const titleLines = doc.splitTextToSize(data.name, maxWidth)
  doc.text(titleLines, margin, yPosition, { align: 'center' })
  yPosition += titleLines.length * 10 + 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Scenario: ${data.scenario.charAt(0).toUpperCase() + data.scenario.slice(1)}`, margin, yPosition, { align: 'center' })
  yPosition += 10
  doc.text(`Timeframe: ${data.timeframe} months (${data.timeframe / 12} years)`, margin, yPosition, { align: 'center' })
  yPosition += 10
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition, { align: 'center' })
  yPosition += 20

  // Key Metrics Summary
  if (data.keyMetrics) {
    doc.addPage()
    yPosition = margin
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('Key Metrics Summary', margin, yPosition)
    yPosition += 15

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    const metrics = [
      `Monthly Burn Rate: $${data.keyMetrics.monthlyBurnRate.toLocaleString()}`,
      `Runway: ${data.keyMetrics.runway === -1 ? '∞' : `${data.keyMetrics.runway} months`}`,
      data.keyMetrics.breakEvenMonth ? `Break-Even Month: ${data.keyMetrics.breakEvenMonth}` : 'Break-Even: Not reached',
      `CAC: $${data.keyMetrics.cac.toLocaleString()}`,
      `LTV: $${data.keyMetrics.ltv.toLocaleString()}`,
      `LTV:CAC Ratio: ${data.keyMetrics.ltvCacRatio}:1`,
      `Gross Margin: ${data.keyMetrics.grossMargin.toFixed(1)}%`,
      `Net Margin: ${data.keyMetrics.netMargin.toFixed(1)}%`,
    ]

    metrics.forEach((metric) => {
      checkPageBreak(8)
      doc.text(metric, margin, yPosition)
      yPosition += 8
    })
  }

  // Revenue Streams
  doc.addPage()
  yPosition = margin
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Revenue Streams', margin, yPosition)
  yPosition += 15

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  data.revenueStreams.forEach((stream) => {
    checkPageBreak(15)
    doc.setFont('helvetica', 'bold')
    doc.text(stream.name, margin, yPosition)
    yPosition += 8
    doc.setFont('helvetica', 'normal')
    doc.text(`Monthly Amount: $${stream.monthlyAmount.toLocaleString()}`, margin + 5, yPosition)
    yPosition += 6
    doc.text(`Growth Rate: ${stream.growthRate}% per month`, margin + 5, yPosition)
    yPosition += 10
  })

  // Expense Categories
  doc.addPage()
  yPosition = margin
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Expense Categories', margin, yPosition)
  yPosition += 15

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  data.expenseCategories.forEach((category) => {
    checkPageBreak(15)
    doc.setFont('helvetica', 'bold')
    doc.text(category.name, margin, yPosition)
    yPosition += 8
    doc.setFont('helvetica', 'normal')
    doc.text(`Monthly Amount: $${category.monthlyAmount.toLocaleString()}`, margin + 5, yPosition)
    yPosition += 6
    doc.text(`Growth Rate: ${category.growthRate}% per month`, margin + 5, yPosition)
    yPosition += 6
    doc.text(`Type: ${category.category.charAt(0).toUpperCase() + category.category.slice(1)}`, margin + 5, yPosition)
    yPosition += 10
  })

  // Projections Table
  doc.addPage()
  yPosition = margin
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Financial Projections', margin, yPosition)
  yPosition += 15

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  
  // Table header
  const colWidths = [25, 35, 35, 35, 40]
  const headers = ['Period', 'Revenue', 'Expenses', 'Cash Flow', 'Cumulative']
  
  headers.forEach((header, i) => {
    doc.setFont('helvetica', 'bold')
    doc.text(header, margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0), yPosition)
  })
  yPosition += 8

  // Table rows (showing first 12 months + summary)
  const monthsToShow = Math.min(12, data.projections.length)
  for (let i = 0; i < monthsToShow; i++) {
    checkPageBreak(10)
    const proj = data.projections[i]
    doc.setFont('helvetica', 'normal')
    doc.text(`${proj.month}/${proj.year}`, margin, yPosition)
    doc.text(`$${proj.revenue.toLocaleString()}`, margin + colWidths[0], yPosition)
    doc.text(`$${proj.expenses.toLocaleString()}`, margin + colWidths[0] + colWidths[1], yPosition)
    doc.text(`$${proj.cashFlow.toLocaleString()}`, margin + colWidths[0] + colWidths[1] + colWidths[2], yPosition)
    doc.text(`$${proj.cumulativeCashFlow.toLocaleString()}`, margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], yPosition)
    yPosition += 7
  }

  // Footer
  const totalPages = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
    doc.text(data.name, margin, pageHeight - 10)
    doc.setTextColor(0, 0, 0)
  }

  doc.save(`${data.name.replace(/\s/g, '-')}.pdf`)
}

export async function exportFinancialProjectionsToExcel(data: FinancialProjectionData) {
  // For Excel export, we'll create a CSV file (can be enhanced with xlsx library later)
  if (typeof window === 'undefined') return

  let csv = `${data.name}\n`
  csv += `Scenario: ${data.scenario}\n`
  csv += `Timeframe: ${data.timeframe} months\n`
  csv += `Generated: ${new Date().toLocaleDateString()}\n\n`

  // Key Metrics
  if (data.keyMetrics) {
    csv += 'Key Metrics\n'
    csv += `Monthly Burn Rate,$${data.keyMetrics.monthlyBurnRate}\n`
    csv += `Runway,${data.keyMetrics.runway === -1 ? '∞' : `${data.keyMetrics.runway} months`}\n`
    csv += `Break-Even Month,${data.keyMetrics.breakEvenMonth || 'N/A'}\n`
    csv += `CAC,$${data.keyMetrics.cac}\n`
    csv += `LTV,$${data.keyMetrics.ltv}\n`
    csv += `LTV:CAC Ratio,${data.keyMetrics.ltvCacRatio}:1\n`
    csv += `Gross Margin,${data.keyMetrics.grossMargin}%\n`
    csv += `Net Margin,${data.keyMetrics.netMargin}%\n\n`
  }

  // Revenue Streams
  csv += 'Revenue Streams\n'
  csv += 'Name,Monthly Amount,Growth Rate (%)\n'
  data.revenueStreams.forEach((stream) => {
    csv += `${stream.name},$${stream.monthlyAmount},${stream.growthRate}\n`
  })
  csv += '\n'

  // Expense Categories
  csv += 'Expense Categories\n'
  csv += 'Name,Monthly Amount,Growth Rate (%),Type\n'
  data.expenseCategories.forEach((category) => {
    csv += `${category.name},$${category.monthlyAmount},${category.growthRate},${category.category}\n`
  })
  csv += '\n'

  // Projections
  csv += 'Financial Projections\n'
  csv += 'Period,Revenue,Expenses,Cash Flow,Cumulative Cash Flow\n'
  data.projections.forEach((proj) => {
    csv += `${proj.month}/${proj.year},$${proj.revenue},$${proj.expenses},$${proj.cashFlow},$${proj.cumulativeCashFlow}\n`
  })

  // Download CSV
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${data.name.replace(/\s/g, '-')}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

